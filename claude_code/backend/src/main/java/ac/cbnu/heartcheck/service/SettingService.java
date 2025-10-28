package ac.cbnu.heartcheck.service;

import ac.cbnu.heartcheck.entity.Setting;
import ac.cbnu.heartcheck.entity.User;
import ac.cbnu.heartcheck.exception.ResourceNotFoundException;
import ac.cbnu.heartcheck.repository.SettingRepository;
import ac.cbnu.heartcheck.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Setting Service
 * 사용자 설정 관리 비즈니스 로직 처리
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SettingService {

    private final SettingRepository settingRepository;
    private final UserRepository userRepository;

    /**
     * 사용자 ID로 설정 조회
     * 설정이 없으면 기본 설정 생성
     * @param userId 사용자 ID
     * @return 사용자 설정
     */
    @Transactional(readOnly = true)
    public Setting getSettingByUserId(Long userId) {
        log.info("사용자 설정 조회: userId={}", userId);
        return settingRepository.findByUserId(userId)
            .orElseGet(() -> createDefaultSetting(userId));
    }

    /**
     * 사용자 설정 업데이트
     * @param userId 사용자 ID
     * @param updatedSetting 업데이트할 설정
     * @return 업데이트된 설정
     */
    public Setting updateSetting(Long userId, Setting updatedSetting) {
        log.info("사용자 설정 업데이트: userId={}", userId);

        Setting setting = settingRepository.findByUserId(userId)
            .orElseGet(() -> createDefaultSetting(userId));

        // 알림 설정 업데이트
        if (updatedSetting.getPushNotification() != null) {
            setting.setPushNotification(updatedSetting.getPushNotification());
        }
        if (updatedSetting.getEmailNotification() != null) {
            setting.setEmailNotification(updatedSetting.getEmailNotification());
        }
        if (updatedSetting.getMarketingNotification() != null) {
            setting.setMarketingNotification(updatedSetting.getMarketingNotification());
        }

        // UI 설정 업데이트
        if (updatedSetting.getDarkMode() != null) {
            setting.setDarkMode(updatedSetting.getDarkMode());
        }
        if (updatedSetting.getLanguage() != null) {
            setting.setLanguage(updatedSetting.getLanguage());
        }

        // 보안 설정 업데이트
        if (updatedSetting.getBiometricAuth() != null) {
            setting.setBiometricAuth(updatedSetting.getBiometricAuth());
        }
        if (updatedSetting.getPrivacyLevel() != null) {
            validatePrivacyLevel(updatedSetting.getPrivacyLevel());
            setting.setPrivacyLevel(updatedSetting.getPrivacyLevel());
        }
        if (updatedSetting.getSessionTimeout() != null) {
            validateSessionTimeout(updatedSetting.getSessionTimeout());
            setting.setSessionTimeout(updatedSetting.getSessionTimeout());
        }

        // 데이터 설정 업데이트
        if (updatedSetting.getAutoBackup() != null) {
            setting.setAutoBackup(updatedSetting.getAutoBackup());
        }
        if (updatedSetting.getDataSaveMode() != null) {
            setting.setDataSaveMode(updatedSetting.getDataSaveMode());
        }

        Setting savedSetting = settingRepository.save(setting);
        log.info("사용자 설정 업데이트 완료: settingId={}", savedSetting.getId());
        return savedSetting;
    }

    /**
     * 푸시 알림 토글
     * @param userId 사용자 ID
     * @return 업데이트된 설정
     */
    public Setting togglePushNotification(Long userId) {
        log.info("푸시 알림 토글: userId={}", userId);
        Setting setting = getSettingByUserId(userId);
        setting.togglePushNotification();
        return settingRepository.save(setting);
    }

    /**
     * 다크모드 토글
     * @param userId 사용자 ID
     * @return 업데이트된 설정
     */
    public Setting toggleDarkMode(Long userId) {
        log.info("다크모드 토글: userId={}", userId);
        Setting setting = getSettingByUserId(userId);
        setting.toggleDarkMode();
        return settingRepository.save(setting);
    }

    /**
     * 생체인증 토글
     * @param userId 사용자 ID
     * @return 업데이트된 설정
     */
    public Setting toggleBiometricAuth(Long userId) {
        log.info("생체인증 토글: userId={}", userId);
        Setting setting = getSettingByUserId(userId);
        setting.toggleBiometricAuth();
        return settingRepository.save(setting);
    }

    /**
     * 자동 백업 토글
     * @param userId 사용자 ID
     * @return 업데이트된 설정
     */
    public Setting toggleAutoBackup(Long userId) {
        log.info("자동 백업 토글: userId={}", userId);
        Setting setting = getSettingByUserId(userId);
        setting.setAutoBackup(!setting.getAutoBackup());
        return settingRepository.save(setting);
    }

    /**
     * 설정 초기화 (기본값으로)
     * @param userId 사용자 ID
     * @return 초기화된 설정
     */
    public Setting resetToDefaults(Long userId) {
        log.info("설정 초기화: userId={}", userId);
        Setting setting = getSettingByUserId(userId);
        setting.resetToDefaults();
        return settingRepository.save(setting);
    }

    /**
     * 보안 모드 활성화
     * @param userId 사용자 ID
     * @return 업데이트된 설정
     */
    public Setting enableSecurityMode(Long userId) {
        log.info("보안 모드 활성화: userId={}", userId);
        Setting setting = getSettingByUserId(userId);
        setting.enableSecurityMode();
        return settingRepository.save(setting);
    }

    /**
     * 절약 모드 활성화
     * @param userId 사용자 ID
     * @return 업데이트된 설정
     */
    public Setting enableSavingMode(Long userId) {
        log.info("절약 모드 활성화: userId={}", userId);
        Setting setting = getSettingByUserId(userId);
        setting.enableSavingMode();
        return settingRepository.save(setting);
    }

    /**
     * 언어 설정 변경
     * @param userId 사용자 ID
     * @param languageCode 언어 코드
     * @return 업데이트된 설정
     */
    public Setting updateLanguage(Long userId, String languageCode) {
        log.info("언어 설정 변경: userId={}, languageCode={}", userId, languageCode);
        Setting setting = getSettingByUserId(userId);
        setting.setLanguage(languageCode);
        return settingRepository.save(setting);
    }

    /**
     * 개인정보 보호 수준 변경
     * @param userId 사용자 ID
     * @param privacyLevel 보호 수준 (1-3)
     * @return 업데이트된 설정
     */
    public Setting updatePrivacyLevel(Long userId, int privacyLevel) {
        log.info("개인정보 보호 수준 변경: userId={}, privacyLevel={}", userId, privacyLevel);
        validatePrivacyLevel(privacyLevel);
        Setting setting = getSettingByUserId(userId);
        setting.setPrivacyLevel(privacyLevel);
        return settingRepository.save(setting);
    }

    /**
     * 세션 타임아웃 설정 변경
     * @param userId 사용자 ID
     * @param timeout 타임아웃 (분)
     * @return 업데이트된 설정
     */
    public Setting updateSessionTimeout(Long userId, Integer timeout) {
        log.info("세션 타임아웃 변경: userId={}, timeout={}분", userId, timeout);
        validateSessionTimeout(timeout);
        Setting setting = getSettingByUserId(userId);
        setting.setSessionTimeout(timeout);
        return settingRepository.save(setting);
    }

    /**
     * 푸시 알림 활성화된 설정 목록 조회
     * @return 푸시 알림 활성화 설정 목록
     */
    @Transactional(readOnly = true)
    public List<Setting> getPushNotificationEnabledSettings() {
        log.info("푸시 알림 활성화 설정 조회");
        return settingRepository.findByPushNotificationEnabled();
    }

    /**
     * 이메일 알림 활성화된 설정 목록 조회
     * @return 이메일 알림 활성화 설정 목록
     */
    @Transactional(readOnly = true)
    public List<Setting> getEmailNotificationEnabledSettings() {
        log.info("이메일 알림 활성화 설정 조회");
        return settingRepository.findByEmailNotificationEnabled();
    }

    /**
     * 마케팅 수신 동의 설정 목록 조회
     * @return 마케팅 수신 동의 설정 목록
     */
    @Transactional(readOnly = true)
    public List<Setting> getMarketingEnabledSettings() {
        log.info("마케팅 수신 동의 설정 조회");
        return settingRepository.findByMarketingEnabled();
    }

    /**
     * 기본 설정 생성
     * @param userId 사용자 ID
     * @return 생성된 설정
     */
    private Setting createDefaultSetting(Long userId) {
        log.info("기본 설정 생성: userId={}", userId);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다: " + userId));

        Setting setting = Setting.builder()
            .user(user)
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

        return settingRepository.save(setting);
    }

    /**
     * 개인정보 보호 수준 유효성 검사
     * @param privacyLevel 보호 수준 (1-3)
     */
    private void validatePrivacyLevel(Integer privacyLevel) {
        if (privacyLevel == null || privacyLevel < 1 || privacyLevel > 3) {
            throw new IllegalArgumentException("개인정보 보호 수준은 1에서 3 사이여야 합니다");
        }
    }

    /**
     * 세션 타임아웃 유효성 검사
     * @param timeout 타임아웃 (분)
     */
    private void validateSessionTimeout(Integer timeout) {
        if (timeout == null || timeout < 5 || timeout > 120) {
            throw new IllegalArgumentException("세션 타임아웃은 5분에서 120분 사이여야 합니다");
        }
    }
}
