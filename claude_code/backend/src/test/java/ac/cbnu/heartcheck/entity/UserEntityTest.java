package ac.cbnu.heartcheck.entity;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.ArrayList;

/**
 * User 엔티티 단위 테스트
 * Heart Doctor 명세서 기준 User 엔티티 검증
 */
class UserEntityTest {

    @Test
    @DisplayName("User 엔티티 빌더 패턴 생성 테스트")
    void testUserBuilder() {
        // Given & When
        User user = User.builder()
                .userName("홍길동")
                .userDob("19900101")
                .phone("01012345678")
                .password("encrypted_password_hash")
                .provider("google")
                .providerUid("google_1234567890")
                .role(User.Role.USER)
                .isActive(true)
                .build();

        // Then
        assertNotNull(user);
        assertEquals("홍길동", user.getUserName());
        assertEquals("19900101", user.getUserDob());
        assertEquals("01012345678", user.getPhone());
        assertEquals("encrypted_password_hash", user.getPassword());
        assertEquals("google", user.getProvider());
        assertEquals("google_1234567890", user.getProviderUid());
        assertEquals(User.Role.USER, user.getRole());
        assertTrue(user.getIsActive());
    }

    @Test
    @DisplayName("User Role ENUM 테스트")
    void testUserRoleEnum() {
        // Given & When & Then
        assertEquals("사용자", User.Role.USER.getDescription());
        assertEquals("관리자", User.Role.ADMIN.getDescription());
        assertEquals("의사", User.Role.DOCTOR.getDescription());
    }

    @Test
    @DisplayName("User Provider ENUM 테스트")
    void testProviderEnum() {
        // Given & When & Then
        assertEquals("GOOGLE", User.Provider.GOOGLE.name());
        assertEquals("구글", User.Provider.GOOGLE.getDisplayName());
        assertEquals("APPLE", User.Provider.APPLE.name());
        assertEquals("애플", User.Provider.APPLE.getDisplayName());
        assertEquals("KAKAO", User.Provider.KAKAO.name());
        assertEquals("카카오", User.Provider.KAKAO.getDisplayName());

        // fromCode 테스트
        assertEquals(User.Provider.GOOGLE, User.Provider.fromCode("google"));
        assertEquals(User.Provider.APPLE, User.Provider.fromCode("apple"));
        assertEquals(User.Provider.KAKAO, User.Provider.fromCode("kakao"));
        assertNull(User.Provider.fromCode("invalid"));
    }

    @Test
    @DisplayName("User 비즈니스 로직 메서드 테스트")
    void testUserBusinessMethods() {
        // Given
        User user = User.builder()
                .userName("홍길동")
                .userDob("19900101")
                .phone("01012345678")
                .password("encrypted_password")
                .role(User.Role.USER)
                .isActive(true)
                .lastLoginTime(LocalDateTime.now().minusDays(1))
                .build();

        // When & Then - 활성 상태 확인
        assertTrue(user.isActive());

        // 관리자 권한 확인
        assertFalse(user.isAdmin());

        // 의사 권한 확인
        assertFalse(user.isDoctor());

        // SNS 로그인 사용자 확인 (provider가 null이므로 false)
        assertFalse(user.isSnsUser());

        // 로그인 이력 확인
        assertTrue(user.hasLoginHistory());
    }

    @Test
    @DisplayName("Admin 사용자 테스트")
    void testAdminUser() {
        // Given
        User admin = User.builder()
                .userName("관리자")
                .userDob("19800101")
                .phone("01000000000")
                .password("admin_password")
                .role(User.Role.ADMIN)
                .isActive(true)
                .build();

        // When & Then
        assertTrue(admin.isAdmin());
        assertFalse(admin.isDoctor());
        assertTrue(admin.isActive());
    }

    @Test
    @DisplayName("SNS 로그인 사용자 테스트")
    void testSnsUser() {
        // Given
        User snsUser = User.builder()
                .userName("구글사용자")
                .userDob("19950101")
                .phone("01011112222")
                .provider("google")
                .providerUid("google_123456")
                .role(User.Role.USER)
                .isActive(true)
                .build();

        // When & Then
        assertTrue(snsUser.isSnsUser());
        assertEquals(User.Provider.GOOGLE, snsUser.getProviderEnum());
    }

    @Test
    @DisplayName("User 상태 변경 메서드 테스트")
    void testUserStatusMethods() {
        // Given
        User user = User.builder()
                .userName("테스트사용자")
                .userDob("19900101")
                .phone("01012345678")
                .password("password")
                .role(User.Role.USER)
                .isActive(true)
                .build();

        // When & Then - 비활성화
        user.deactivate();
        assertFalse(user.getIsActive());

        // 활성화
        user.activate();
        assertTrue(user.getIsActive());

        // 로그인 시간 업데이트
        assertNull(user.getLastLoginTime());
        user.updateLastLoginTime();
        assertNotNull(user.getLastLoginTime());
    }

    @Test
    @DisplayName("User 관계 매핑 초기화 테스트")
    void testUserRelationships() {
        // Given
        User user = User.builder()
                .userName("관계테스트")
                .userDob("19900101")
                .phone("01012345678")
                .password("password")
                .role(User.Role.USER)
                .isActive(true)
                .build();

        // When & Then - 관계 컬렉션들이 초기화되어야 함
        assertNotNull(user.getChecks());
        assertNotNull(user.getPredictions());
        assertNotNull(user.getSubscriptions());
        assertNotNull(user.getPayments());
        assertNotNull(user.getDailyUsageQuotas());
        assertNotNull(user.getNotifications());

        // 빈 컬렉션이어야 함
        assertTrue(user.getChecks().isEmpty());
        assertTrue(user.getPredictions().isEmpty());
        assertTrue(user.getSubscriptions().isEmpty());
        assertTrue(user.getPayments().isEmpty());
        assertTrue(user.getDailyUsageQuotas().isEmpty());
        assertTrue(user.getNotifications().isEmpty());
    }

    @Test
    @DisplayName("생년월일 파싱 테스트")
    void testUserDobParsing() {
        // Given
        User user = User.builder()
                .userName("생년월일테스트")
                .userDob("19900815")
                .phone("01012345678")
                .password("password")
                .role(User.Role.USER)
                .isActive(true)
                .build();

        // When & Then
        assertEquals("19900815", user.getUserDob());

        // 생년월일 형식 검증 (YYYYMMDD)
        assertTrue(user.getUserDob().matches("\\d{8}"));
        assertEquals(8, user.getUserDob().length());
    }

    @Test
    @DisplayName("전화번호 형식 테스트")
    void testPhoneFormat() {
        // Given
        User user = User.builder()
                .userName("전화번호테스트")
                .userDob("19900101")
                .phone("01087654321")
                .password("password")
                .role(User.Role.USER)
                .isActive(true)
                .build();

        // When & Then
        assertEquals("01087654321", user.getPhone());

        // 전화번호 형식 검증 (11자리 숫자)
        assertTrue(user.getPhone().matches("\\d{11}"));
        assertEquals(11, user.getPhone().length());
        assertTrue(user.getPhone().startsWith("010"));
    }
}