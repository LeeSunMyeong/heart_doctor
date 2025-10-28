package ac.cbnu.heartcheck.service;

import ac.cbnu.heartcheck.entity.UserType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * 사용량 캐시 서비스
 * Redis를 이용한 사용량 추적 및 세션 관리
 * 계층화된 인가 시스템의 2차 실시간 검증을 담당
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UsageCacheService {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final String DAILY_USAGE_PREFIX = "user:%d:daily_usage:%s";
    private static final String TOTAL_USAGE_PREFIX = "user:%d:total_usage";
    private static final String SESSION_TOKEN_PREFIX = "user:%d:session_token";

    /**
     * 사용자의 일일 사용량 조회
     * FREE_USER는 총 사용량을 반환 (일일 제한 없음)
     * PREMIUM_USER는 일일 사용량을 반환
     */
    public int getDailyUsage(Long userId, UserType userType) {
        String key;

        if (userType == UserType.FREE_USER) {
            // FREE_USER는 총 사용량으로 제한
            key = String.format(TOTAL_USAGE_PREFIX, userId);
        } else {
            // PREMIUM_USER는 일일 사용량으로 제한
            key = String.format(DAILY_USAGE_PREFIX, userId, LocalDate.now());
        }

        Object usage = redisTemplate.opsForValue().get(key);
        return usage != null ? (Integer) usage : 0;
    }

    /**
     * 총 사용량 조회 (FREE_USER용)
     */
    public int getTotalUsage(Long userId) {
        String key = String.format(TOTAL_USAGE_PREFIX, userId);
        Object usage = redisTemplate.opsForValue().get(key);
        return usage != null ? (Integer) usage : 0;
    }

    /**
     * 일일 사용량 증가
     * 사용자 타입에 따라 다른 키를 사용
     */
    public int incrementDailyUsage(Long userId, UserType userType) {
        String key;

        if (userType == UserType.FREE_USER) {
            // FREE_USER는 총 사용량 증가 (만료 시간 없음)
            key = String.format(TOTAL_USAGE_PREFIX, userId);
            Long newUsage = redisTemplate.opsForValue().increment(key);

            log.info("FREE_USER {} total usage incremented to {}", userId, newUsage);
            return newUsage.intValue();
        } else {
            // PREMIUM_USER는 일일 사용량 증가 (자정에 만료)
            key = String.format(DAILY_USAGE_PREFIX, userId, LocalDate.now());
            Long newUsage = redisTemplate.opsForValue().increment(key);

            // 자정까지의 시간으로 만료 시간 설정
            Duration timeUntilMidnight = calculateTimeUntilMidnight();
            redisTemplate.expire(key, timeUntilMidnight);

            log.info("PREMIUM_USER {} daily usage incremented to {}", userId, newUsage);
            return newUsage.intValue();
        }
    }

    /**
     * 일일 사용량 초기화 (스케줄러에서 사용)
     */
    public void resetDailyUsage(Long userId) {
        String key = String.format(DAILY_USAGE_PREFIX, userId, LocalDate.now());
        redisTemplate.delete(key);
        log.info("Daily usage reset for user {}", userId);
    }

    /**
     * 세션 토큰 저장
     * JWT 토큰과 실시간 상태 동기화를 위함
     */
    public void storeSessionToken(Long userId, String token) {
        String key = String.format(SESSION_TOKEN_PREFIX, userId);
        // 토큰 만료 시간 (1시간)
        Duration tokenExpiry = Duration.ofHours(1);

        redisTemplate.opsForValue().set(key, token, tokenExpiry);
        log.debug("Session token stored for user {}", userId);
    }

    /**
     * 세션 토큰 검증
     */
    public boolean validateSessionToken(Long userId, String token) {
        String key = String.format(SESSION_TOKEN_PREFIX, userId);
        Object storedToken = redisTemplate.opsForValue().get(key);

        boolean isValid = token.equals(storedToken);
        log.debug("Session token validation for user {}: {}", userId, isValid);
        return isValid;
    }

    /**
     * 세션 토큰 무효화 (로그아웃 시)
     */
    public void invalidateSessionToken(Long userId) {
        String key = String.format(SESSION_TOKEN_PREFIX, userId);
        redisTemplate.delete(key);
        log.info("Session token invalidated for user {}", userId);
    }

    /**
     * 자정까지의 시간 계산
     */
    private Duration calculateTimeUntilMidnight() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime midnight = now.toLocalDate().plusDays(1).atTime(LocalTime.MIDNIGHT);
        return Duration.between(now, midnight);
    }

    /**
     * 사용자의 모든 캐시 데이터 삭제 (계정 삭제 시)
     */
    public void clearUserCache(Long userId) {
        String totalUsageKey = String.format(TOTAL_USAGE_PREFIX, userId);
        String dailyUsageKey = String.format(DAILY_USAGE_PREFIX, userId, LocalDate.now());
        String sessionTokenKey = String.format(SESSION_TOKEN_PREFIX, userId);

        redisTemplate.delete(totalUsageKey);
        redisTemplate.delete(dailyUsageKey);
        redisTemplate.delete(sessionTokenKey);

        log.info("All cache data cleared for user {}", userId);
    }
}