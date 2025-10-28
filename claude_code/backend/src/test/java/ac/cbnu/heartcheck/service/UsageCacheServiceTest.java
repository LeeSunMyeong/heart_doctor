package ac.cbnu.heartcheck.service;

import ac.cbnu.heartcheck.entity.UserType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.time.Duration;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * 사용량 캐시 서비스 테스트
 * TDD 방식으로 Redis 기반 사용량 추적 검증
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("사용량 캐시 서비스 테스트")
class UsageCacheServiceTest {

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    private UsageCacheService usageCacheService;

    @BeforeEach
    void setUp() {
        usageCacheService = new UsageCacheService(redisTemplate);
    }

    @Test
    @DisplayName("FREE_USER 일일 사용량 조회 - 캐시 없음")
    void testGetDailyUsageForFreeUserNoCache() {
        // Given
        Long userId = 1L;
        String expectedKey = "user:1:total_usage"; // FREE_USER는 총 사용량 사용

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(expectedKey)).thenReturn(null);

        // When
        int usage = usageCacheService.getDailyUsage(userId, UserType.FREE_USER);

        // Then
        assertThat(usage).isEqualTo(0);
        verify(valueOperations).get(expectedKey);
    }

    @Test
    @DisplayName("PREMIUM_USER 일일 사용량 조회 - 캐시 존재")
    void testGetDailyUsageForPremiumUserWithCache() {
        // Given
        Long userId = 2L;
        String expectedKey = "user:2:daily_usage:" + LocalDate.now();

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(expectedKey)).thenReturn(3);

        // When
        int usage = usageCacheService.getDailyUsage(userId, UserType.PREMIUM_USER);

        // Then
        assertThat(usage).isEqualTo(3);
        verify(valueOperations).get(expectedKey);
    }

    @Test
    @DisplayName("일일 사용량 증가 - PREMIUM_USER")
    void testIncrementDailyUsagePremiumUser() {
        // Given
        Long userId = 2L;
        String expectedKey = "user:2:daily_usage:" + LocalDate.now();

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.increment(expectedKey)).thenReturn(1L);

        // When
        int newUsage = usageCacheService.incrementDailyUsage(userId, UserType.PREMIUM_USER);

        // Then
        assertThat(newUsage).isEqualTo(1);
        verify(valueOperations).increment(expectedKey);
        verify(redisTemplate).expire(eq(expectedKey), any(Duration.class));
    }

    @Test
    @DisplayName("일일 사용량 증가 - FREE_USER (총 사용량만 추적)")
    void testIncrementDailyUsageFreeUser() {
        // Given
        Long userId = 1L;
        String expectedKey = "user:1:total_usage";

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.increment(expectedKey)).thenReturn(1L);

        // When
        int newUsage = usageCacheService.incrementDailyUsage(userId, UserType.FREE_USER);

        // Then
        assertThat(newUsage).isEqualTo(1);
        verify(valueOperations).increment(expectedKey);
        // FREE_USER는 총 사용량이므로 만료 시간 설정하지 않음
    }

    @Test
    @DisplayName("총 사용량 조회")
    void testGetTotalUsage() {
        // Given
        Long userId = 1L;
        String expectedKey = "user:1:total_usage";

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(expectedKey)).thenReturn(1);

        // When
        int totalUsage = usageCacheService.getTotalUsage(userId);

        // Then
        assertThat(totalUsage).isEqualTo(1);
        verify(valueOperations).get(expectedKey);
    }

    @Test
    @DisplayName("일일 사용량 초기화")
    void testResetDailyUsage() {
        // Given
        Long userId = 2L;
        String expectedKey = "user:2:daily_usage:" + LocalDate.now();

        // When
        usageCacheService.resetDailyUsage(userId);

        // Then
        verify(redisTemplate).delete(expectedKey);
    }

    @Test
    @DisplayName("세션 토큰 저장")
    void testStoreSessionToken() {
        // Given
        Long userId = 1L;
        String token = "test.jwt.token";
        String expectedKey = "user:1:session_token";

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        // When
        usageCacheService.storeSessionToken(userId, token);

        // Then
        verify(valueOperations).set(eq(expectedKey), eq(token), any(Duration.class));
    }

    @Test
    @DisplayName("세션 토큰 검증")
    void testValidateSessionToken() {
        // Given
        Long userId = 1L;
        String token = "test.jwt.token";
        String expectedKey = "user:1:session_token";

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(expectedKey)).thenReturn(token);

        // When
        boolean isValid = usageCacheService.validateSessionToken(userId, token);

        // Then
        assertThat(isValid).isTrue();
        verify(valueOperations).get(expectedKey);
    }

    @Test
    @DisplayName("세션 토큰 무효화")
    void testInvalidateSessionToken() {
        // Given
        Long userId = 1L;
        String expectedKey = "user:1:session_token";

        // When
        usageCacheService.invalidateSessionToken(userId);

        // Then
        verify(redisTemplate).delete(expectedKey);
    }
}