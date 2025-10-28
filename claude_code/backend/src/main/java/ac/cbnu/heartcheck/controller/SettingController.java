package ac.cbnu.heartcheck.controller;

import ac.cbnu.heartcheck.dto.response.ApiResponse;
import ac.cbnu.heartcheck.entity.Setting;
import ac.cbnu.heartcheck.service.SettingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * SettingController for Heart Doctor system
 * 사용자 설정 관리 REST API 엔드포인트
 *
 * @author CBNU Development Team
 * @version 1.0.0
 * @since 2024
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/settings")
@RequiredArgsConstructor
public class SettingController {

    private final SettingService settingService;

    /**
     * 사용자 설정 조회
     * GET /api/v1/settings/{userId}
     *
     * @param userId 사용자 ID
     * @return 사용자 설정
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<Setting>> getSettings(@PathVariable Long userId) {
        log.info("사용자 설정 조회 요청: userId={}", userId);

        try {
            Setting setting = settingService.getSettingByUserId(userId);
            return ResponseEntity.ok(ApiResponse.success(setting));
        } catch (Exception e) {
            log.error("사용자 설정 조회 실패: userId={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("설정 조회 실패: " + e.getMessage()));
        }
    }

    /**
     * 사용자 설정 업데이트
     * PUT /api/v1/settings/{userId}
     *
     * @param userId 사용자 ID
     * @param setting 업데이트할 설정
     * @return 업데이트된 설정
     */
    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse<Setting>> updateSettings(
            @PathVariable Long userId,
            @RequestBody Setting setting) {
        log.info("사용자 설정 업데이트 요청: userId={}", userId);

        try {
            Setting updatedSetting = settingService.updateSetting(userId, setting);
            return ResponseEntity.ok(ApiResponse.success(updatedSetting));
        } catch (IllegalArgumentException e) {
            log.error("잘못된 설정 값: userId={}", userId, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("사용자 설정 업데이트 실패: userId={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("설정 업데이트 실패: " + e.getMessage()));
        }
    }

    /**
     * 푸시 알림 토글
     * POST /api/v1/settings/{userId}/push-notification/toggle
     *
     * @param userId 사용자 ID
     * @return 업데이트된 설정
     */
    @PostMapping("/{userId}/push-notification/toggle")
    public ResponseEntity<ApiResponse<Setting>> togglePushNotification(@PathVariable Long userId) {
        log.info("푸시 알림 토글 요청: userId={}", userId);

        try {
            Setting setting = settingService.togglePushNotification(userId);
            return ResponseEntity.ok(ApiResponse.success(setting));
        } catch (Exception e) {
            log.error("푸시 알림 토글 실패: userId={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("푸시 알림 설정 실패: " + e.getMessage()));
        }
    }

    /**
     * 다크모드 토글
     * POST /api/v1/settings/{userId}/dark-mode/toggle
     *
     * @param userId 사용자 ID
     * @return 업데이트된 설정
     */
    @PostMapping("/{userId}/dark-mode/toggle")
    public ResponseEntity<ApiResponse<Setting>> toggleDarkMode(@PathVariable Long userId) {
        log.info("다크모드 토글 요청: userId={}", userId);

        try {
            Setting setting = settingService.toggleDarkMode(userId);
            return ResponseEntity.ok(ApiResponse.success(setting));
        } catch (Exception e) {
            log.error("다크모드 토글 실패: userId={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("다크모드 설정 실패: " + e.getMessage()));
        }
    }

    /**
     * 자동 백업 토글
     * POST /api/v1/settings/{userId}/auto-backup/toggle
     *
     * @param userId 사용자 ID
     * @return 업데이트된 설정
     */
    @PostMapping("/{userId}/auto-backup/toggle")
    public ResponseEntity<ApiResponse<Setting>> toggleAutoBackup(@PathVariable Long userId) {
        log.info("자동 백업 토글 요청: userId={}", userId);

        try {
            Setting setting = settingService.toggleAutoBackup(userId);
            return ResponseEntity.ok(ApiResponse.success(setting));
        } catch (Exception e) {
            log.error("자동 백업 토글 실패: userId={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("자동 백업 설정 실패: " + e.getMessage()));
        }
    }

    /**
     * 설정 초기화 (기본값으로)
     * POST /api/v1/settings/{userId}/reset
     *
     * @param userId 사용자 ID
     * @return 초기화된 설정
     */
    @PostMapping("/{userId}/reset")
    public ResponseEntity<ApiResponse<Setting>> resetSettings(@PathVariable Long userId) {
        log.info("설정 초기화 요청: userId={}", userId);

        try {
            Setting setting = settingService.resetToDefaults(userId);
            return ResponseEntity.ok(ApiResponse.success(setting));
        } catch (Exception e) {
            log.error("설정 초기화 실패: userId={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("설정 초기화 실패: " + e.getMessage()));
        }
    }

    /**
     * 보안 모드 활성화
     * POST /api/v1/settings/{userId}/security-mode
     *
     * @param userId 사용자 ID
     * @return 업데이트된 설정
     */
    @PostMapping("/{userId}/security-mode")
    public ResponseEntity<ApiResponse<Setting>> enableSecurityMode(@PathVariable Long userId) {
        log.info("보안 모드 활성화 요청: userId={}", userId);

        try {
            Setting setting = settingService.enableSecurityMode(userId);
            return ResponseEntity.ok(ApiResponse.success(setting));
        } catch (Exception e) {
            log.error("보안 모드 활성화 실패: userId={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("보안 모드 설정 실패: " + e.getMessage()));
        }
    }

    /**
     * 절약 모드 활성화
     * POST /api/v1/settings/{userId}/saving-mode
     *
     * @param userId 사용자 ID
     * @return 업데이트된 설정
     */
    @PostMapping("/{userId}/saving-mode")
    public ResponseEntity<ApiResponse<Setting>> enableSavingMode(@PathVariable Long userId) {
        log.info("절약 모드 활성화 요청: userId={}", userId);

        try {
            Setting setting = settingService.enableSavingMode(userId);
            return ResponseEntity.ok(ApiResponse.success(setting));
        } catch (Exception e) {
            log.error("절약 모드 활성화 실패: userId={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("절약 모드 설정 실패: " + e.getMessage()));
        }
    }

    /**
     * 언어 설정 변경
     * PUT /api/v1/settings/{userId}/language
     *
     * @param userId 사용자 ID
     * @param languageCode 언어 코드 (ko/en)
     * @return 업데이트된 설정
     */
    @PutMapping("/{userId}/language")
    public ResponseEntity<ApiResponse<Setting>> updateLanguage(
            @PathVariable Long userId,
            @RequestParam String languageCode) {
        log.info("언어 설정 변경 요청: userId={}, languageCode={}", userId, languageCode);

        try {
            Setting setting = settingService.updateLanguage(userId, languageCode);
            return ResponseEntity.ok(ApiResponse.success(setting));
        } catch (Exception e) {
            log.error("언어 설정 변경 실패: userId={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("언어 설정 실패: " + e.getMessage()));
        }
    }

    /**
     * 개인정보 보호 수준 변경
     * PUT /api/v1/settings/{userId}/privacy-level
     *
     * @param userId 사용자 ID
     * @param privacyLevel 보호 수준 (1-3)
     * @return 업데이트된 설정
     */
    @PutMapping("/{userId}/privacy-level")
    public ResponseEntity<ApiResponse<Setting>> updatePrivacyLevel(
            @PathVariable Long userId,
            @RequestParam int privacyLevel) {
        log.info("개인정보 보호 수준 변경 요청: userId={}, privacyLevel={}", userId, privacyLevel);

        try {
            Setting setting = settingService.updatePrivacyLevel(userId, privacyLevel);
            return ResponseEntity.ok(ApiResponse.success(setting));
        } catch (IllegalArgumentException e) {
            log.error("잘못된 보호 수준 값: userId={}, privacyLevel={}", userId, privacyLevel, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("개인정보 보호 수준 변경 실패: userId={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("보호 수준 설정 실패: " + e.getMessage()));
        }
    }

    /**
     * 세션 타임아웃 설정 변경
     * PUT /api/v1/settings/{userId}/session-timeout
     *
     * @param userId 사용자 ID
     * @param timeout 타임아웃 (분, 5-120)
     * @return 업데이트된 설정
     */
    @PutMapping("/{userId}/session-timeout")
    public ResponseEntity<ApiResponse<Setting>> updateSessionTimeout(
            @PathVariable Long userId,
            @RequestParam Integer timeout) {
        log.info("세션 타임아웃 변경 요청: userId={}, timeout={}분", userId, timeout);

        try {
            Setting setting = settingService.updateSessionTimeout(userId, timeout);
            return ResponseEntity.ok(ApiResponse.success(setting));
        } catch (IllegalArgumentException e) {
            log.error("잘못된 타임아웃 값: userId={}, timeout={}", userId, timeout, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("세션 타임아웃 변경 실패: userId={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("세션 타임아웃 설정 실패: " + e.getMessage()));
        }
    }
}
