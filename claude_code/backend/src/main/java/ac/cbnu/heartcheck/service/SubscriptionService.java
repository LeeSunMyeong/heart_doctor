package ac.cbnu.heartcheck.service;

import ac.cbnu.heartcheck.entity.CostModel;
import ac.cbnu.heartcheck.entity.Subscription;
import ac.cbnu.heartcheck.entity.Subscription.SubscriptionStatus;
import ac.cbnu.heartcheck.entity.User;
import ac.cbnu.heartcheck.repository.CostModelRepository;
import ac.cbnu.heartcheck.repository.SubscriptionRepository;
import ac.cbnu.heartcheck.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * SubscriptionService for Heart Doctor system
 * 구독 관리 비즈니스 로직
 *
 * @author CBNU Development Team
 * @version 1.0
 * @since 2024
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final CostModelRepository costModelRepository;
    private final UserRepository userRepository;

    /**
     * 사용자 ID로 모든 구독 조회
     * @param userId 사용자 ID
     * @return 구독 목록
     */
    public List<Subscription> getUserSubscriptions(Long userId) {
        log.debug("Fetching subscriptions for user ID: {}", userId);
        return subscriptionRepository.findByUserId(userId);
    }

    /**
     * 사용자의 활성 구독 조회
     * @param userId 사용자 ID
     * @return 활성 구독 (없으면 null)
     */
    public Subscription getActiveSubscription(Long userId) {
        log.debug("Fetching active subscription for user ID: {}", userId);
        return subscriptionRepository.findByUserIdAndStatus(userId, SubscriptionStatus.ACTIVE)
                .orElse(null);
    }

    /**
     * 사용자의 유효한 구독 조회 (활성 + 만료되지 않음)
     * @param userId 사용자 ID
     * @return 유효한 구독 (없으면 null)
     */
    public Subscription getValidSubscription(Long userId) {
        log.debug("Fetching valid subscription for user ID: {}", userId);
        return subscriptionRepository.findValidSubscriptionByUserId(userId, LocalDateTime.now())
                .orElse(null);
    }

    /**
     * 사용자가 활성 구독을 가지고 있는지 확인
     * @param userId 사용자 ID
     * @return 활성 구독 존재 여부
     */
    public boolean hasActiveSubscription(Long userId) {
        boolean hasActive = subscriptionRepository.hasActiveSubscription(userId, LocalDateTime.now());
        log.debug("User ID {} has active subscription: {}", userId, hasActive);
        return hasActive;
    }

    /**
     * 새로운 구독 생성
     * @param userId 사용자 ID
     * @param costModelId 요금제 ID
     * @return 생성된 구독
     */
    @Transactional
    public Subscription createSubscription(Long userId, Short costModelId) {
        log.info("Creating subscription for user ID: {} with cost model ID: {}", userId, costModelId);

        // 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + userId));

        // 요금제 조회
        CostModel costModel = costModelRepository.findById(costModelId)
                .orElseThrow(() -> new IllegalArgumentException("요금제를 찾을 수 없습니다: " + costModelId));

        // 기존 활성 구독 확인
        subscriptionRepository.findByUserIdAndStatus(userId, SubscriptionStatus.ACTIVE)
                .ifPresent(existing -> {
                    throw new IllegalStateException("이미 활성 구독이 존재합니다");
                });

        // 구독 기간 계산
        LocalDateTime fromDate = LocalDateTime.now();
        LocalDateTime toDate = calculateEndDate(fromDate, costModel);

        // 구독 생성
        Subscription subscription = Subscription.builder()
                .user(user)
                .costModel(costModel)
                .fromDate(fromDate)
                .toDate(toDate)
                .status(SubscriptionStatus.PENDING) // 결제 완료 후 ACTIVE로 변경
                .build();

        Subscription saved = subscriptionRepository.save(subscription);
        log.info("Created subscription ID: {} for user ID: {}", saved.getId(), userId);

        return saved;
    }

    /**
     * 구독 활성화 (결제 완료 후)
     * @param subscriptionId 구독 ID
     * @return 활성화된 구독
     */
    @Transactional
    public Subscription activateSubscription(Long subscriptionId) {
        log.info("Activating subscription ID: {}", subscriptionId);

        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new IllegalArgumentException("구독을 찾을 수 없습니다: " + subscriptionId));

        subscription.activate();
        Subscription activated = subscriptionRepository.save(subscription);

        log.info("Activated subscription ID: {}", subscriptionId);
        return activated;
    }

    /**
     * 구독 취소
     * @param subscriptionId 구독 ID
     * @return 취소된 구독
     */
    @Transactional
    public Subscription cancelSubscription(Long subscriptionId) {
        log.info("Canceling subscription ID: {}", subscriptionId);

        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new IllegalArgumentException("구독을 찾을 수 없습니다: " + subscriptionId));

        if (subscription.isCanceled()) {
            throw new IllegalStateException("이미 취소된 구독입니다");
        }

        subscription.cancel();
        Subscription canceled = subscriptionRepository.save(subscription);

        log.info("Canceled subscription ID: {}", subscriptionId);
        return canceled;
    }

    /**
     * 구독 연장
     * @param subscriptionId 구독 ID
     * @param additionalDays 연장할 일수
     * @return 연장된 구독
     */
    @Transactional
    public Subscription extendSubscription(Long subscriptionId, int additionalDays) {
        log.info("Extending subscription ID: {} by {} days", subscriptionId, additionalDays);

        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new IllegalArgumentException("구독을 찾을 수 없습니다: " + subscriptionId));

        subscription.extend(additionalDays);
        Subscription extended = subscriptionRepository.save(subscription);

        log.info("Extended subscription ID: {} to {}", subscriptionId, extended.getToDate());
        return extended;
    }

    /**
     * 만료된 구독 처리 (스케줄러)
     * 매일 자정에 실행
     */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void processExpiredSubscriptions() {
        log.info("Processing expired subscriptions...");

        List<Subscription> expiredSubscriptions = subscriptionRepository.findExpiredSubscriptions(LocalDateTime.now());

        for (Subscription subscription : expiredSubscriptions) {
            subscription.updateStatus(); // EXPIRED로 상태 변경
            subscriptionRepository.save(subscription);
            log.info("Expired subscription ID: {}", subscription.getId());
        }

        log.info("Processed {} expired subscriptions", expiredSubscriptions.size());
    }

    /**
     * 곧 만료될 구독 조회 (알림용)
     * @return 만료 예정 구독 목록
     */
    public List<Subscription> getExpiringSoonSubscriptions() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sevenDaysLater = now.plusDays(7);

        return subscriptionRepository.findExpiringSoonSubscriptions(now, sevenDaysLater);
    }

    /**
     * 구독 종료일 계산
     * @param fromDate 시작일
     * @param costModel 요금제
     * @return 종료일
     */
    private LocalDateTime calculateEndDate(LocalDateTime fromDate, CostModel costModel) {
        int days = costModel.getSubscriptionDays();

        if (days == Integer.MAX_VALUE) {
            // 평생 요금제는 100년 후로 설정
            return fromDate.plusYears(100);
        }

        return fromDate.plusDays(days);
    }

    /**
     * 특정 기간의 신규 구독 수 조회
     * @param startDate 시작일
     * @param endDate 종료일
     * @return 신규 구독 수
     */
    public long countNewSubscriptions(LocalDateTime startDate, LocalDateTime endDate) {
        return subscriptionRepository.countNewSubscriptions(startDate, endDate);
    }

    /**
     * 구독 ID로 조회
     * @param subscriptionId 구독 ID
     * @return 구독
     */
    public Subscription getSubscriptionById(Long subscriptionId) {
        return subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new IllegalArgumentException("구독을 찾을 수 없습니다: " + subscriptionId));
    }
}
