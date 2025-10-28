package ac.cbnu.heartcheck.entity;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

/**
 * User 엔티티 유닛 테스트
 */
@DisplayName("User 엔티티 테스트")
class UserTest {

    @Test
    @DisplayName("User 빌더 생성 테스트")
    void buildUser_Success() {
        // When
        User user = User.builder()
                .userName("홍길동")
                .phone("01012345678")
                .password("encoded_password")
                .userDob("19900101")
                .role(User.Role.USER)
                .build();

        // Then
        assertThat(user).isNotNull();
        assertThat(user.getUserName()).isEqualTo("홍길동");
        assertThat(user.getPhone()).isEqualTo("01012345678");
        assertThat(user.getUserDob()).isEqualTo("19900101");
        assertThat(user.getRole()).isEqualTo(User.Role.USER);
        assertThat(user.isActive()).isTrue(); // Default value
    }

    @Test
    @DisplayName("사용자 활성화 테스트")
    void activateUser_Success() {
        // Given
        User user = User.builder()
                .userName("홍길동")
                .phone("01012345678")
                .password("password")
                .userDob("19900101")
                .build();
        user.deactivate();

        // When
        user.activate();

        // Then
        assertThat(user.isActive()).isTrue();
    }

    @Test
    @DisplayName("사용자 비활성화 테스트")
    void deactivateUser_Success() {
        // Given
        User user = User.builder()
                .userName("홍길동")
                .phone("01012345678")
                .password("password")
                .userDob("19900101")
                .build();

        // When
        user.deactivate();

        // Then
        assertThat(user.isActive()).isFalse();
    }

    @Test
    @DisplayName("OAuth 제공자 설정 테스트")
    void setOAuthProvider_Success() {
        // Given
        User user = User.builder()
                .userName("홍길동")
                .phone("01012345678")
                .password("password")
                .userDob("19900101")
                .build();

        // When
        user.setProvider("kakao");
        user.setProviderUid("kakao_12345");

        // Then
        assertThat(user.getProvider()).isEqualTo("kakao");
        assertThat(user.getProviderUid()).isEqualTo("kakao_12345");
    }

    @Test
    @DisplayName("관리자 역할 테스트")
    void adminRole_Success() {
        // When
        User admin = User.builder()
                .userName("관리자")
                .phone("01099999999")
                .password("admin_password")
                .userDob("19800101")
                .role(User.Role.ADMIN)
                .build();

        // Then
        assertThat(admin.getRole()).isEqualTo(User.Role.ADMIN);
    }

    @Test
    @DisplayName("기본 역할은 USER")
    void defaultRole_IsUser() {
        // When
        User user = User.builder()
                .userName("홍길동")
                .phone("01012345678")
                .password("password")
                .userDob("19900101")
                .build();

        // Then
        assertThat(user.getRole()).isEqualTo(User.Role.USER);
    }

    @Test
    @DisplayName("기본 활성 상태는 true")
    void defaultIsActive_IsTrue() {
        // When
        User user = User.builder()
                .userName("홍길동")
                .phone("01012345678")
                .password("password")
                .userDob("19900101")
                .build();

        // Then
        assertThat(user.isActive()).isTrue();
    }
}
