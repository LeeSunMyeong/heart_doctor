package ac.cbnu.heartcheck.service;

import ac.cbnu.heartcheck.entity.Setting;
import ac.cbnu.heartcheck.entity.User;
import ac.cbnu.heartcheck.exception.ResourceNotFoundException;
import ac.cbnu.heartcheck.repository.SettingRepository;
import ac.cbnu.heartcheck.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * SettingService 테스트
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("SettingService 테스트")
class SettingServiceTest {

    @Mock
    private SettingRepository settingRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SettingService settingService;

    private User testUser;
    private Setting testSetting;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .userId(1L)
                .userName("홍길동")
                .phone("01012345678")
                .password("password")
                .userDob("19900101")
                .role(User.Role.USER)
                .build();

        testSetting = Setting.builder()
                .id(1L)
                .user(testUser)
                .pushNotification(true)
                .emailNotification(false)
                .marketingNotification(false)
                .darkMode(false)
                .language("ko")
                .biometricAuth(false)
                .privacyLevel(2)
                .sessionTimeout(30)
                .autoBackup(true)
                .dataSaveMode(false)
                .build();
    }

    @Test
    @DisplayName("사용자 ID로 설정 조회 - 설정 존재")
    void getSettingByUserId_ExistingSetting() {
        // Given
        when(settingRepository.findByUserId(1L)).thenReturn(Optional.of(testSetting));

        // When
        Setting result = settingService.getSettingByUserId(1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getUser().getUserId()).isEqualTo(1L);
        verify(settingRepository, times(1)).findByUserId(1L);
    }

    @Test
    @DisplayName("사용자 ID로 설정 조회 - 설정 없으면 기본 설정 생성")
    void getSettingByUserId_CreateDefault() {
        // Given
        when(settingRepository.findByUserId(1L)).thenReturn(Optional.empty());
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(settingRepository.save(any(Setting.class))).thenReturn(testSetting);

        // When
        Setting result = settingService.getSettingByUserId(1L);

        // Then
        assertThat(result).isNotNull();
        verify(userRepository, times(1)).findById(1L);
        verify(settingRepository, times(1)).save(any(Setting.class));
    }

    @Test
    @DisplayName("사용자 설정 업데이트")
    void updateSetting_Success() {
        // Given
        Setting updatedSetting = Setting.builder()
                .pushNotification(false)
                .darkMode(true)
                .language("en")
                .build();

        when(settingRepository.findByUserId(1L)).thenReturn(Optional.of(testSetting));
        when(settingRepository.save(any(Setting.class))).thenReturn(testSetting);

        // When
        Setting result = settingService.updateSetting(1L, updatedSetting);

        // Then
        assertThat(result).isNotNull();
        verify(settingRepository, times(1)).findByUserId(1L);
        verify(settingRepository, times(1)).save(any(Setting.class));
    }

    @Test
    @DisplayName("푸시 알림 토글")
    void togglePushNotification_Success() {
        // Given
        when(settingRepository.findByUserId(1L)).thenReturn(Optional.of(testSetting));
        when(settingRepository.save(any(Setting.class))).thenReturn(testSetting);

        // When
        Setting result = settingService.togglePushNotification(1L);

        // Then
        assertThat(result).isNotNull();
        verify(settingRepository, times(1)).findByUserId(1L);
        verify(settingRepository, times(1)).save(any(Setting.class));
    }

    @Test
    @DisplayName("다크모드 토글")
    void toggleDarkMode_Success() {
        // Given
        when(settingRepository.findByUserId(1L)).thenReturn(Optional.of(testSetting));
        when(settingRepository.save(any(Setting.class))).thenReturn(testSetting);

        // When
        Setting result = settingService.toggleDarkMode(1L);

        // Then
        assertThat(result).isNotNull();
        verify(settingRepository, times(1)).findByUserId(1L);
        verify(settingRepository, times(1)).save(any(Setting.class));
    }

    @Test
    @DisplayName("생체인증 토글")
    void toggleBiometricAuth_Success() {
        // Given
        when(settingRepository.findByUserId(1L)).thenReturn(Optional.of(testSetting));
        when(settingRepository.save(any(Setting.class))).thenReturn(testSetting);

        // When
        Setting result = settingService.toggleBiometricAuth(1L);

        // Then
        assertThat(result).isNotNull();
        verify(settingRepository, times(1)).findByUserId(1L);
        verify(settingRepository, times(1)).save(any(Setting.class));
    }

    @Test
    @DisplayName("자동 백업 토글")
    void toggleAutoBackup_Success() {
        // Given
        when(settingRepository.findByUserId(1L)).thenReturn(Optional.of(testSetting));
        when(settingRepository.save(any(Setting.class))).thenReturn(testSetting);

        // When
        Setting result = settingService.toggleAutoBackup(1L);

        // Then
        assertThat(result).isNotNull();
        verify(settingRepository, times(1)).findByUserId(1L);
        verify(settingRepository, times(1)).save(any(Setting.class));
    }

    @Test
    @DisplayName("설정 초기화")
    void resetToDefaults_Success() {
        // Given
        when(settingRepository.findByUserId(1L)).thenReturn(Optional.of(testSetting));
        when(settingRepository.save(any(Setting.class))).thenReturn(testSetting);

        // When
        Setting result = settingService.resetToDefaults(1L);

        // Then
        assertThat(result).isNotNull();
        verify(settingRepository, times(1)).findByUserId(1L);
        verify(settingRepository, times(1)).save(any(Setting.class));
    }

    @Test
    @DisplayName("보안 모드 활성화")
    void enableSecurityMode_Success() {
        // Given
        when(settingRepository.findByUserId(1L)).thenReturn(Optional.of(testSetting));
        when(settingRepository.save(any(Setting.class))).thenReturn(testSetting);

        // When
        Setting result = settingService.enableSecurityMode(1L);

        // Then
        assertThat(result).isNotNull();
        verify(settingRepository, times(1)).findByUserId(1L);
        verify(settingRepository, times(1)).save(any(Setting.class));
    }

    @Test
    @DisplayName("절약 모드 활성화")
    void enableSavingMode_Success() {
        // Given
        when(settingRepository.findByUserId(1L)).thenReturn(Optional.of(testSetting));
        when(settingRepository.save(any(Setting.class))).thenReturn(testSetting);

        // When
        Setting result = settingService.enableSavingMode(1L);

        // Then
        assertThat(result).isNotNull();
        verify(settingRepository, times(1)).findByUserId(1L);
        verify(settingRepository, times(1)).save(any(Setting.class));
    }

    @Test
    @DisplayName("언어 설정 변경")
    void updateLanguage_Success() {
        // Given
        when(settingRepository.findByUserId(1L)).thenReturn(Optional.of(testSetting));
        when(settingRepository.save(any(Setting.class))).thenReturn(testSetting);

        // When
        Setting result = settingService.updateLanguage(1L, "en");

        // Then
        assertThat(result).isNotNull();
        verify(settingRepository, times(1)).findByUserId(1L);
        verify(settingRepository, times(1)).save(any(Setting.class));
    }

    @Test
    @DisplayName("개인정보 보호 수준 변경")
    void updatePrivacyLevel_Success() {
        // Given
        when(settingRepository.findByUserId(1L)).thenReturn(Optional.of(testSetting));
        when(settingRepository.save(any(Setting.class))).thenReturn(testSetting);

        // When
        Setting result = settingService.updatePrivacyLevel(1L, 3);

        // Then
        assertThat(result).isNotNull();
        verify(settingRepository, times(1)).findByUserId(1L);
        verify(settingRepository, times(1)).save(any(Setting.class));
    }

    @Test
    @DisplayName("세션 타임아웃 변경 - 성공")
    void updateSessionTimeout_Success() {
        // Given
        when(settingRepository.findByUserId(1L)).thenReturn(Optional.of(testSetting));
        when(settingRepository.save(any(Setting.class))).thenReturn(testSetting);

        // When
        Setting result = settingService.updateSessionTimeout(1L, 60);

        // Then
        assertThat(result).isNotNull();
        verify(settingRepository, times(1)).findByUserId(1L);
        verify(settingRepository, times(1)).save(any(Setting.class));
    }

    @Test
    @DisplayName("세션 타임아웃 변경 - 범위 초과 (작음)")
    void updateSessionTimeout_TooSmall() {
        // When & Then
        assertThatThrownBy(() -> settingService.updateSessionTimeout(1L, 3))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("5분에서 120분 사이여야 합니다");
    }

    @Test
    @DisplayName("세션 타임아웃 변경 - 범위 초과 (큼)")
    void updateSessionTimeout_TooLarge() {
        // When & Then
        assertThatThrownBy(() -> settingService.updateSessionTimeout(1L, 150))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("5분에서 120분 사이여야 합니다");
    }

    @Test
    @DisplayName("푸시 알림 활성화 설정 목록 조회")
    void getPushNotificationEnabledSettings_Success() {
        // Given
        List<Setting> settings = Arrays.asList(testSetting);
        when(settingRepository.findByPushNotificationEnabled()).thenReturn(settings);

        // When
        List<Setting> result = settingService.getPushNotificationEnabledSettings();

        // Then
        assertThat(result).isNotEmpty();
        assertThat(result).hasSize(1);
        verify(settingRepository, times(1)).findByPushNotificationEnabled();
    }

    @Test
    @DisplayName("이메일 알림 활성화 설정 목록 조회")
    void getEmailNotificationEnabledSettings_Success() {
        // Given
        List<Setting> settings = Arrays.asList(testSetting);
        when(settingRepository.findByEmailNotificationEnabled()).thenReturn(settings);

        // When
        List<Setting> result = settingService.getEmailNotificationEnabledSettings();

        // Then
        assertThat(result).isNotEmpty();
        assertThat(result).hasSize(1);
        verify(settingRepository, times(1)).findByEmailNotificationEnabled();
    }

    @Test
    @DisplayName("마케팅 수신 동의 설정 목록 조회")
    void getMarketingEnabledSettings_Success() {
        // Given
        List<Setting> settings = Arrays.asList(testSetting);
        when(settingRepository.findByMarketingEnabled()).thenReturn(settings);

        // When
        List<Setting> result = settingService.getMarketingEnabledSettings();

        // Then
        assertThat(result).isNotEmpty();
        assertThat(result).hasSize(1);
        verify(settingRepository, times(1)).findByMarketingEnabled();
    }

    @Test
    @DisplayName("사용자 없음 - 기본 설정 생성 실패")
    void createDefaultSetting_UserNotFound() {
        // Given
        when(settingRepository.findByUserId(1L)).thenReturn(Optional.empty());
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> settingService.getSettingByUserId(1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("사용자를 찾을 수 없습니다");
    }
}
