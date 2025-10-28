package ac.cbnu.heartcheck.service;

import ac.cbnu.heartcheck.entity.CostModel;
import ac.cbnu.heartcheck.entity.Payment;
import ac.cbnu.heartcheck.entity.Payment.PaymentStatus;
import ac.cbnu.heartcheck.entity.Payment.StoreType;
import ac.cbnu.heartcheck.entity.Subscription;
import ac.cbnu.heartcheck.entity.User;
import ac.cbnu.heartcheck.repository.CostModelRepository;
import ac.cbnu.heartcheck.repository.PaymentRepository;
import ac.cbnu.heartcheck.repository.SubscriptionRepository;
import ac.cbnu.heartcheck.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * PaymentService for Heart Doctor system
 * 결제 관리 비즈니스 로직
 *
 * @author CBNU Development Team
 * @version 1.0
 * @since 2024
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final CostModelRepository costModelRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionService subscriptionService;

    /**
     * 결제 생성 (초기 상태: PENDING)
     * @param userId 사용자 ID
     * @param costModelId 요금제 ID
     * @param storeInfo 스토어 정보 (G/A)
     * @return 생성된 결제
     */
    @Transactional
    public Payment createPayment(Long userId, Short costModelId, String storeInfo) {
        log.info("Creating payment for user ID: {} with cost model ID: {}", userId, costModelId);

        // 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + userId));

        // 요금제 조회
        CostModel costModel = costModelRepository.findById(costModelId)
                .orElseThrow(() -> new IllegalArgumentException("요금제를 찾을 수 없습니다: " + costModelId));

        // 스토어 정보 검증
        validateStoreInfo(storeInfo);

        // 결제 생성
        Payment payment = Payment.builder()
                .user(user)
                .costModel(costModel)
                .status(PaymentStatus.PENDING)
                .storeInfo(storeInfo)
                .payTime(LocalDateTime.now())
                .build();

        Payment saved = paymentRepository.save(payment);
        log.info("Created payment ID: {} for user ID: {}", saved.getId(), userId);

        return saved;
    }

    /**
     * 결제 검증 및 완료 처리
     * @param paymentId 결제 ID
     * @param transactionId 트랜잭션 ID (영수증 번호)
     * @return 완료된 결제
     */
    @Transactional
    public Payment completePayment(Long paymentId, String transactionId) {
        log.info("Completing payment ID: {} with transaction ID: {}", paymentId, transactionId);

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("결제를 찾을 수 없습니다: " + paymentId));

        if (payment.isSuccess()) {
            throw new IllegalStateException("이미 완료된 결제입니다");
        }

        if (payment.isCanceled() || payment.isRefunded()) {
            throw new IllegalStateException("취소 또는 환불된 결제는 완료할 수 없습니다");
        }

        // 트랜잭션 ID 중복 확인
        if (transactionId != null) {
            paymentRepository.findByTransactionId(transactionId).ifPresent(existing -> {
                if (!existing.getId().equals(paymentId)) {
                    throw new IllegalStateException("이미 사용된 트랜잭션 ID입니다: " + transactionId);
                }
            });
        }

        // TODO: 실제 결제 게이트웨이 검증 로직 추가
        // - Google Play Billing API 검증
        // - Apple App Store Receipt Validation
        boolean verified = verifyPaymentWithGateway(payment, transactionId);

        if (verified) {
            // 결제 완료 처리
            payment.markAsSuccess(transactionId);
            Payment completed = paymentRepository.save(payment);

            // 구독 생성
            try {
                Subscription subscription = subscriptionService.createSubscription(
                        payment.getUser().getUserId(),
                        payment.getCostModel().getCostId()
                );

                // 구독 활성화
                subscriptionService.activateSubscription(subscription.getId());

                // 결제와 구독 연결
                payment.setSubscription(subscription);
                paymentRepository.save(payment);

                log.info("Payment completed and subscription activated: payment ID={}, subscription ID={}",
                        completed.getId(), subscription.getId());
            } catch (Exception e) {
                log.error("Failed to create subscription after payment completion", e);
                // 결제는 성공했지만 구독 생성 실패 - 수동 처리 필요
                // TODO: 알림 또는 재시도 로직 추가
            }

            return completed;
        } else {
            // 결제 실패 처리
            payment.markAsFailed();
            Payment failed = paymentRepository.save(payment);
            log.warn("Payment verification failed: payment ID={}", paymentId);
            throw new IllegalStateException("결제 검증에 실패했습니다");
        }
    }

    /**
     * 결제 실패 처리
     * @param paymentId 결제 ID
     * @return 실패 처리된 결제
     */
    @Transactional
    public Payment failPayment(Long paymentId) {
        log.info("Failing payment ID: {}", paymentId);

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("결제를 찾을 수 없습니다: " + paymentId));

        if (payment.isSuccess()) {
            throw new IllegalStateException("완료된 결제는 실패 처리할 수 없습니다");
        }

        payment.markAsFailed();
        Payment failed = paymentRepository.save(payment);

        log.info("Payment marked as failed: payment ID={}", paymentId);
        return failed;
    }

    /**
     * 결제 취소
     * @param paymentId 결제 ID
     * @return 취소된 결제
     */
    @Transactional
    public Payment cancelPayment(Long paymentId) {
        log.info("Canceling payment ID: {}", paymentId);

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("결제를 찾을 수 없습니다: " + paymentId));

        if (payment.isCanceled()) {
            throw new IllegalStateException("이미 취소된 결제입니다");
        }

        if (payment.isRefunded()) {
            throw new IllegalStateException("환불된 결제는 취소할 수 없습니다");
        }

        payment.markAsCanceled();
        Payment canceled = paymentRepository.save(payment);

        log.info("Payment canceled: payment ID={}", paymentId);
        return canceled;
    }

    /**
     * 환불 처리
     * @param paymentId 결제 ID
     * @return 환불된 결제
     */
    @Transactional
    public Payment refundPayment(Long paymentId) {
        log.info("Refunding payment ID: {}", paymentId);

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("결제를 찾을 수 없습니다: " + paymentId));

        if (!payment.isSuccess()) {
            throw new IllegalStateException("성공한 결제만 환불할 수 있습니다");
        }

        if (payment.isRefunded()) {
            throw new IllegalStateException("이미 환불된 결제입니다");
        }

        // TODO: 실제 환불 게이트웨이 로직 추가
        // - Google Play Billing API 환불
        // - Apple App Store 환불 처리
        boolean refunded = processRefundWithGateway(payment);

        if (refunded) {
            payment.markAsRefunded();
            Payment refundedPayment = paymentRepository.save(payment);

            // 연결된 구독이 있으면 취소 처리
            if (payment.getSubscription() != null) {
                try {
                    subscriptionService.cancelSubscription(payment.getSubscription().getId());
                    log.info("Subscription canceled due to refund: subscription ID={}",
                            payment.getSubscription().getId());
                } catch (Exception e) {
                    log.error("Failed to cancel subscription after refund", e);
                    // TODO: 수동 처리 필요 알림
                }
            }

            log.info("Payment refunded: payment ID={}", paymentId);
            return refundedPayment;
        } else {
            throw new IllegalStateException("환불 처리에 실패했습니다");
        }
    }

    /**
     * 결제 조회
     * @param paymentId 결제 ID
     * @return 결제 정보
     */
    public Payment getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("결제를 찾을 수 없습니다: " + paymentId));
    }

    /**
     * 트랜잭션 ID로 결제 조회
     * @param transactionId 트랜잭션 ID
     * @return 결제 정보
     */
    public Payment getPaymentByTransactionId(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new IllegalArgumentException("결제를 찾을 수 없습니다: " + transactionId));
    }

    /**
     * 사용자의 결제 이력 조회
     * @param userId 사용자 ID
     * @param pageable 페이지 정보
     * @return 결제 이력
     */
    public Page<Payment> getUserPaymentHistory(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + userId));

        return paymentRepository.findByUser(user, pageable);
    }

    /**
     * 사용자의 성공한 결제 목록 조회
     * @param userId 사용자 ID
     * @return 성공한 결제 목록
     */
    public List<Payment> getUserSuccessfulPayments(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + userId));

        return paymentRepository.findSuccessfulPaymentsByUser(user);
    }

    /**
     * 사용자의 최근 결제 조회
     * @param userId 사용자 ID
     * @return 최근 결제
     */
    public Payment getUserLatestPayment(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + userId));

        List<Payment> payments = paymentRepository.findLatestSuccessfulPaymentByUser(
                user, PageRequest.of(0, 1)
        );

        return payments.isEmpty() ? null : payments.get(0);
    }

    /**
     * 특정 기간의 매출 계산
     * @param startDate 시작일
     * @param endDate 종료일
     * @return 매출액
     */
    public BigDecimal calculateRevenue(LocalDateTime startDate, LocalDateTime endDate) {
        BigDecimal revenue = paymentRepository.calculateRevenueByDateRange(startDate, endDate);
        return revenue != null ? revenue : BigDecimal.ZERO;
    }

    /**
     * 요금제별 결제 통계
     * @return 요금제별 결제 건수
     */
    public List<Object[]> getPaymentStatsByPlan() {
        return paymentRepository.countByPlanType();
    }

    /**
     * 스토어 정보 검증
     * @param storeInfo 스토어 정보
     */
    private void validateStoreInfo(String storeInfo) {
        if (storeInfo == null || storeInfo.isEmpty()) {
            throw new IllegalArgumentException("스토어 정보는 필수입니다");
        }

        try {
            StoreType.fromCode(storeInfo);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("유효하지 않은 스토어 정보입니다: " + storeInfo);
        }
    }

    /**
     * 결제 게이트웨이 검증 (구현 필요)
     * @param payment 결제 정보
     * @param transactionId 트랜잭션 ID
     * @return 검증 성공 여부
     */
    private boolean verifyPaymentWithGateway(Payment payment, String transactionId) {
        log.debug("Verifying payment with gateway: payment ID={}, transaction ID={}",
                payment.getId(), transactionId);

        // TODO: 실제 결제 게이트웨이 검증 구현
        if (payment.isGooglePlay()) {
            // Google Play Billing API 검증
            return verifyGooglePlayPurchase(transactionId);
        } else if (payment.isAppStore()) {
            // Apple App Store Receipt Validation
            return verifyAppStoreReceipt(transactionId);
        }

        return false;
    }

    /**
     * Google Play 구매 검증 (구현 필요)
     * @param transactionId 트랜잭션 ID
     * @return 검증 성공 여부
     */
    private boolean verifyGooglePlayPurchase(String transactionId) {
        log.debug("Verifying Google Play purchase: {}", transactionId);
        // TODO: Google Play Developer API 연동
        // - packageName, productId, token으로 검증
        // - 구매 상태 확인 (purchased, canceled, pending)
        return true; // 임시로 true 반환
    }

    /**
     * Apple App Store 영수증 검증 (구현 필요)
     * @param transactionId 트랜잭션 ID
     * @return 검증 성공 여부
     */
    private boolean verifyAppStoreReceipt(String transactionId) {
        log.debug("Verifying App Store receipt: {}", transactionId);
        // TODO: Apple App Store Server API 연동
        // - receipt-data를 Apple 서버에 전송하여 검증
        // - 구매 상태 및 유효성 확인
        return true; // 임시로 true 반환
    }

    /**
     * 환불 게이트웨이 처리 (구현 필요)
     * @param payment 결제 정보
     * @return 환불 성공 여부
     */
    private boolean processRefundWithGateway(Payment payment) {
        log.debug("Processing refund with gateway: payment ID={}", payment.getId());

        // TODO: 실제 환불 게이트웨이 구현
        if (payment.isGooglePlay()) {
            // Google Play Billing API 환불
            return refundGooglePlayPurchase(payment);
        } else if (payment.isAppStore()) {
            // Apple App Store 환불 처리
            return refundAppStorePurchase(payment);
        }

        return false;
    }

    /**
     * Google Play 구매 환불 (구현 필요)
     * @param payment 결제 정보
     * @return 환불 성공 여부
     */
    private boolean refundGooglePlayPurchase(Payment payment) {
        log.debug("Refunding Google Play purchase: payment ID={}", payment.getId());
        // TODO: Google Play Developer API 환불 요청
        return true; // 임시로 true 반환
    }

    /**
     * Apple App Store 구매 환불 (구현 필요)
     * @param payment 결제 정보
     * @return 환불 성공 여부
     */
    private boolean refundAppStorePurchase(Payment payment) {
        log.debug("Refunding App Store purchase: payment ID={}", payment.getId());
        // TODO: Apple App Store Server API 환불 요청
        return true; // 임시로 true 반환
    }
}
