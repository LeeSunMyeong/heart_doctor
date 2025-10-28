package ac.cbnu.heartcheck.service;

import ac.cbnu.heartcheck.entity.DailyUsageQuota;
import ac.cbnu.heartcheck.entity.User;
import ac.cbnu.heartcheck.repository.DailyUsageQuotaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

/**
 * Daily Usage Quota Service
 * Heart Doctor 일일 사용량 제한 비즈니스 로직 서비스
 *
 * @author CBNU Development Team
 * @version 1.4
 * @since 2024
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DailyUsageQuotaService {

    private final DailyUsageQuotaRepository dailyUsageQuotaRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    // Redis 키 패턴
    private static final String REDIS_KEY_PREFIX = "daily_usage:";
    private static final int CACHE_EXPIRY_HOURS = 26; // 26시간 (하루 + 2시간 여유)

    // 기본 사용량 제한
    private static final int FREE_USER_DAILY_LIMIT = 1;
    private static final int PREMIUM_USER_DAILY_LIMIT = 5;

    /**
     * 사용자의 오늘 사용량 조회 (Redis 캐시 우선)
     * @param user 사용자
     * @return 오늘 사용량
     */
    public int getTodayUsageCount(User user) {
        String redisKey = generateRedisKey(user.getUserId(), LocalDate.now());

        try {
            // Redis에서 먼저 조회
            Object cachedCount = redisTemplate.opsForValue().get(redisKey);
            if (cachedCount != null) {
                return (Integer) cachedCount;
            }

            // Redis에 없으면 DB에서 조회
            Optional<DailyUsageQuota> quotaOpt = findTodayQuota(user);
            int usageCount = quotaOpt.map(DailyUsageQuota::getCount).orElse(0);

            // Redis에 캐시
            redisTemplate.opsForValue().set(redisKey, usageCount, CACHE_EXPIRY_HOURS, TimeUnit.HOURS);

            return usageCount;

        } catch (Exception e) {
            log.error("Error retrieving usage count from Redis for user: {}", user.getUserId(), e);
            // Redis 오류 시 DB에서 직접 조회
            return findTodayQuota(user).map(DailyUsageQuota::getCount).orElse(0);
        }
    }

    /**
     * 사용자의 일일 제한량 조회
     * @param user 사용자
     * @return 일일 제한량
     */
    public int getDailyLimit(User user) {
        // 프리미엄 사용자 여부 확인 (실제로는 Subscription 엔티티와 연계)
        // 현재는 단순화하여 Role로 판단
        if (User.Role.ADMIN.equals(user.getRole()) || User.Role.DOCTOR.equals(user.getRole())) {
            return Integer.MAX_VALUE; // 관리자/의사는 무제한
        }

        // TODO: Subscription 서비스와 연계하여 프리미엄 사용자 확인
        // 현재는 기본값으로 FREE 사용자로 처리
        return FREE_USER_DAILY_LIMIT;
    }

    /**
     * 사용량 증가 (Redis + DB 동기화)
     * @param user 사용자
     * @return 증가 후 사용량
     */
    @Transactional
    public int incrementUsage(User user) {
        LocalDate today = LocalDate.now();
        String redisKey = generateRedisKey(user.getUserId(), today);

        try {
            // Redis에서 증가
            Long newCount = redisTemplate.opsForValue().increment(redisKey);
            if (newCount == 1) {
                // 첫 증가인 경우 TTL 설정
                redisTemplate.expire(redisKey, CACHE_EXPIRY_HOURS, TimeUnit.HOURS);
            }

            // DB 동기화
            syncToDatabase(user, today, newCount.intValue());

            log.info("Usage incremented for user: {} to count: {}", user.getUserId(), newCount);
            return newCount.intValue();

        } catch (Exception e) {
            log.error("Error incrementing usage in Redis for user: {}", user.getUserId(), e);
            // Redis 오류 시 DB에서 직접 처리
            return incrementUsageInDatabase(user, today);
        }
    }

    /**
     * 사용 가능 여부 확인
     * @param user 사용자
     * @return 사용 가능 여부
     */
    public boolean canUseService(User user) {
        int currentUsage = getTodayUsageCount(user);
        int dailyLimit = getDailyLimit(user);

        boolean canUse = currentUsage < dailyLimit;
        log.debug("User: {} usage check - current: {}, limit: {}, canUse: {}",
                user.getUserId(), currentUsage, dailyLimit, canUse);

        return canUse;
    }

    /**
     * 남은 사용량 조회
     * @param user 사용자
     * @return 남은 사용량
     */
    public int getRemainingUsage(User user) {
        int currentUsage = getTodayUsageCount(user);
        int dailyLimit = getDailyLimit(user);

        return Math.max(0, dailyLimit - currentUsage);
    }

    /**
     * 사용량 정보 조회
     * @param user 사용자
     * @return 사용량 정보 맵
     */
    public DailyUsageInfo getUsageInfo(User user) {
        int currentUsage = getTodayUsageCount(user);
        int dailyLimit = getDailyLimit(user);
        int remaining = Math.max(0, dailyLimit - currentUsage);
        boolean canUse = remaining > 0;

        return DailyUsageInfo.builder()
                .userId(user.getUserId())
                .date(LocalDate.now())
                .currentUsage(currentUsage)
                .dailyLimit(dailyLimit)
                .remainingUsage(remaining)
                .canUse(canUse)
                .build();
    }

    /**
     * 특정 기간 사용량 조회
     * @param user 사용자
     * @param startDate 시작일
     * @param endDate 종료일
     * @return 기간별 사용량 목록
     */
    public List<DailyUsageQuota> getUsageByDateRange(User user, LocalDate startDate, LocalDate endDate) {
        return dailyUsageQuotaRepository.findByUserAndDateRange(user, startDate, endDate);
    }

    /**
     * 사용량 초기화 (관리자용)
     * @param user 사용자
     * @param date 날짜
     */
    @Transactional
    public void resetUsage(User user, LocalDate date) {
        String redisKey = generateRedisKey(user.getUserId(), date);

        try {
            // Redis 캐시 삭제
            redisTemplate.delete(redisKey);

            // DB에서도 삭제 또는 0으로 초기화
            Optional<DailyUsageQuota> quotaOpt = dailyUsageQuotaRepository.findByUserAndDay(user, date);
            if (quotaOpt.isPresent()) {
                DailyUsageQuota quota = quotaOpt.get();
                quota.setCount(0);
                dailyUsageQuotaRepository.save(quota);
            }

            log.info("Usage reset for user: {} on date: {}", user.getUserId(), date);

        } catch (Exception e) {
            log.error("Error resetting usage for user: {} on date: {}", user.getUserId(), date, e);
            throw new RuntimeException("사용량 초기화 중 오류가 발생했습니다.", e);
        }
    }

    // Private helper methods

    private Optional<DailyUsageQuota> findTodayQuota(User user) {
        return dailyUsageQuotaRepository.findByUserAndDay(user, LocalDate.now());
    }

    private String generateRedisKey(Long userId, LocalDate date) {
        return REDIS_KEY_PREFIX + userId + ":" + date.toString();
    }

    private void syncToDatabase(User user, LocalDate date, int count) {
        try {
            Optional<DailyUsageQuota> quotaOpt = dailyUsageQuotaRepository.findByUserAndDay(user, date);

            DailyUsageQuota quota;
            if (quotaOpt.isPresent()) {
                quota = quotaOpt.get();
                quota.setCount(count);
            } else {
                quota = DailyUsageQuota.builder()
                        .user(user)
                        .day(date)
                        .count(count)
                        .limit(getDailyLimit(user))
                        .build();
            }

            dailyUsageQuotaRepository.save(quota);

        } catch (Exception e) {
            log.error("Error syncing usage to database for user: {} date: {}", user.getUserId(), date, e);
            // DB 동기화 실패해도 Redis는 정상 작동하도록 예외를 던지지 않음
        }
    }

    private int incrementUsageInDatabase(User user, LocalDate date) {
        Optional<DailyUsageQuota> quotaOpt = dailyUsageQuotaRepository.findByUserAndDay(user, date);

        DailyUsageQuota quota;
        if (quotaOpt.isPresent()) {
            quota = quotaOpt.get();
            quota.setCount(quota.getCount() + 1);
        } else {
            quota = DailyUsageQuota.builder()
                    .user(user)
                    .day(date)
                    .count(1)
                    .limit(getDailyLimit(user))
                    .build();
        }

        DailyUsageQuota saved = dailyUsageQuotaRepository.save(quota);
        return saved.getCount();
    }

    /**
     * 일일 사용량 정보 DTO
     */
    @lombok.Builder
    @lombok.Getter
    public static class DailyUsageInfo {
        private Long userId;
        private LocalDate date;
        private int currentUsage;
        private int dailyLimit;
        private int remainingUsage;
        private boolean canUse;
    }
}