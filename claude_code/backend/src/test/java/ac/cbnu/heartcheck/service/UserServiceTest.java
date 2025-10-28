package ac.cbnu.heartcheck.service;

import ac.cbnu.heartcheck.entity.User;
import ac.cbnu.heartcheck.exception.UserNotFoundException;
import ac.cbnu.heartcheck.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * UserService 유닛 테스트
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UserService 유닛 테스트")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .userId(1L)
                .userName("홍길동")
                .phone("01012345678")
                .password("encoded_password")
                .userDob("19900101")
                .role(User.Role.USER)
                .isActive(true)
                .build();
    }

    @Test
    @DisplayName("사용자 ID로 조회 성공")
    void findById_Success() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // When
        User result = userService.findById(1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getUserId()).isEqualTo(1L);
        assertThat(result.getUserName()).isEqualTo("홍길동");
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("사용자 ID로 조회 실패 - 사용자 없음")
    void findById_NotFound() {
        // Given
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userService.findById(99L))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("사용자 ID: 99");

        verify(userRepository, times(1)).findById(99L);
    }

    @Test
    @DisplayName("전화번호로 조회 성공")
    void findByPhone_Success() {
        // Given
        when(userRepository.findByPhone("01012345678"))
                .thenReturn(Optional.of(testUser));

        // When
        Optional<User> result = userRepository.findByPhone("01012345678");

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getPhone()).isEqualTo("01012345678");
    }

    @Test
    @DisplayName("전화번호로 조회 - 결과 없음")
    void findByPhone_NotFound() {
        // Given
        when(userRepository.findByPhone("01099999999"))
                .thenReturn(Optional.empty());

        // When
        Optional<User> result = userRepository.findByPhone("01099999999");

        // Then
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("전화번호 존재 여부 확인 - 존재함")
    void existsByPhoneNumber_True() {
        // Given
        when(userRepository.existsByPhoneNumber("01012345678")).thenReturn(true);

        // When
        boolean result = userService.existsByPhoneNumber("01012345678");

        // Then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("전화번호 존재 여부 확인 - 존재하지 않음")
    void existsByPhoneNumber_False() {
        // Given
        when(userRepository.existsByPhoneNumber("01099999999")).thenReturn(false);

        // When
        boolean result = userService.existsByPhoneNumber("01099999999");

        // Then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("활성 사용자 수 조회")
    void countActiveUsers_Success() {
        // Given
        when(userRepository.countActiveUsers()).thenReturn(100L);

        // When
        long result = userService.countActiveUsers();

        // Then
        assertThat(result).isEqualTo(100L);
    }

    @Test
    @DisplayName("사용자 저장 성공")
    void save_Success() {
        // Given
        User newUser = User.builder()
                .userName("김철수")
                .phone("01087654321")
                .password("password")
                .userDob("19950101")
                .role(User.Role.USER)
                .build();

        when(userRepository.save(any(User.class))).thenReturn(newUser);

        // When
        User result = userService.save(newUser);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getUserName()).isEqualTo("김철수");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("사용자 활성화 상태 변경 - 활성화")
    void updateEnabled_Activate() {
        // Given
        testUser.deactivate(); // 먼저 비활성화
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        userService.updateEnabled(1L, true);

        // Then
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("사용자 활성화 상태 변경 - 비활성화")
    void updateEnabled_Deactivate() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        userService.updateEnabled(1L, false);

        // Then
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("사용자 활성화 상태 변경 실패 - 사용자 없음")
    void updateEnabled_UserNotFound() {
        // Given
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userService.updateEnabled(99L, true))
                .isInstanceOf(UserNotFoundException.class);

        verify(userRepository, never()).save(any());
    }
}
