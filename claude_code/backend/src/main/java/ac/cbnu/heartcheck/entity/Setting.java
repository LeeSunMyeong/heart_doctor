package ac.cbnu.heartcheck.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Setting entity for Heart Doctor system
 * 사용자 환경설정 관리
 *
 * @author CBNU Development Team
 * @version 1.4
 * @since 2024
 */
@Entity
@Table(name = "settings", indexes = {
    @Index(name = "idx_setting_user", columnList = "user_id", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Setting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "사용자는 필수입니다")
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Builder.Default
    @Column(name = "push_notification", nullable = false)
    private Boolean pushNotification = true; // 푸시 알림 허용

    @Builder.Default
    @Column(name = "email_notification", nullable = false)
    private Boolean emailNotification = true; // 이메일 알림 허용

    @Builder.Default
    @Column(name = "marketing_notification", nullable = false)
    private Boolean marketingNotification = false; // 마케팅 알림 허용

    @Builder.Default
    @Column(name = "dark_mode", nullable = false)
    private Boolean darkMode = false; // 다크모드 설정

    @Builder.Default
    @Column(name = "language", length = 5, nullable = false)
    private String language = "ko"; // 언어 설정 (ko, en)

    @Builder.Default
    @Column(name = "data_save_mode", nullable = false)
    private Boolean dataSaveMode = false; // 데이터 절약 모드

    @Builder.Default
    @Column(name = "auto_backup", nullable = false)
    private Boolean autoBackup = true; // 자동 백업 설정

    @Builder.Default
    @Column(name = "session_timeout", nullable = false)
    private Integer sessionTimeout = 30; // 세션 타임아웃 (분)

    @Builder.Default
    @Column(name = "privacy_level", nullable = false)
    private Integer privacyLevel = 2; // 개인정보 보호 수준 (1: 낮음, 2: 보통, 3: 높음)

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * 개인정보 보호 수준 ENUM
     */
    public enum PrivacyLevel {
        LOW(1, "낮음"),
        MEDIUM(2, "보통"),
        HIGH(3, "높음");

        private final int level;
        private final String description;

        PrivacyLevel(int level, String description) {
            this.level = level;
            this.description = description;
        }

        public int getLevel() {
            return level;
        }

        public String getDescription() {
            return description;
        }

        public static PrivacyLevel fromLevel(int level) {
            for (PrivacyLevel privacyLevel : values()) {
                if (privacyLevel.level == level) {
                    return privacyLevel;
                }
            }
            return MEDIUM; // 기본값
        }
    }

    /**
     * 언어 설정 ENUM
     */
    public enum Language {
        KOREAN("ko", "한국어"),
        ENGLISH("en", "English");

        private final String code;
        private final String name;

        Language(String code, String name) {
            this.code = code;
            this.name = name;
        }

        public String getCode() {
            return code;
        }

        public String getName() {
            return name;
        }

        public static Language fromCode(String code) {
            for (Language lang : values()) {
                if (lang.code.equals(code)) {
                    return lang;
                }
            }
            return KOREAN; // 기본값
        }
    }

    /**
     * 알림 설정이 모두 비활성화되었는지 확인
     * @return 모든 알림 비활성화 여부
     */
    public boolean isAllNotificationsDisabled() {
        return !pushNotification && !emailNotification && !marketingNotification;
    }

    /**
     * 필수 알림만 활성화되었는지 확인
     * @return 필수 알림만 활성화 여부
     */
    public boolean isEssentialNotificationsOnly() {
        return (pushNotification || emailNotification) && !marketingNotification;
    }

    /**
     * 개인정보 보호 수준 반환
     * @return 개인정보 보호 수준 ENUM
     */
    public PrivacyLevel getPrivacyLevelEnum() {
        return PrivacyLevel.fromLevel(privacyLevel);
    }

    /**
     * 언어 설정 반환
     * @return 언어 설정 ENUM
     */
    public Language getLanguageEnum() {
        return Language.fromCode(language);
    }

    /**
     * 보안 설정이 강화되었는지 확인
     * @return 보안 강화 여부
     */
    public boolean isSecurityEnhanced() {
        return privacyLevel >= PrivacyLevel.HIGH.getLevel() && sessionTimeout <= 15;
    }

    /**
     * 데이터 사용량 최적화 설정 확인
     * @return 최적화 설정 여부
     */
    public boolean isDataOptimized() {
        return dataSaveMode && !autoBackup;
    }

    /**
     * 푸시 알림 토글
     */
    public void togglePushNotification() {
        this.pushNotification = !this.pushNotification;
    }

    /**
     * 다크모드 토글
     */
    public void toggleDarkMode() {
        this.darkMode = !this.darkMode;
    }

    /**
     * 개인정보 보호 수준 설정
     * @param level 보호 수준 (1-3)
     */
    public void setPrivacyLevel(int level) {
        if (level >= 1 && level <= 3) {
            this.privacyLevel = level;
        }
    }

    /**
     * 세션 타임아웃 설정 (분)
     * @param minutes 타임아웃 시간 (5-120분)
     */
    public void setSessionTimeout(int minutes) {
        if (minutes >= 5 && minutes <= 120) {
            this.sessionTimeout = minutes;
        }
    }

    /**
     * 언어 설정 변경
     * @param languageCode 언어 코드 (ko, en)
     */
    public void setLanguage(String languageCode) {
        Language lang = Language.fromCode(languageCode);
        this.language = lang.getCode();
    }

    /**
     * 기본 설정으로 리셋
     */
    public void resetToDefaults() {
        this.pushNotification = true;
        this.emailNotification = true;
        this.marketingNotification = false;
        this.darkMode = false;
        this.language = "ko";
        this.dataSaveMode = false;
        this.autoBackup = true;
        this.sessionTimeout = 30;
        this.privacyLevel = 2;
    }

    /**
     * 보안 강화 모드 활성화
     */
    public void enableSecurityMode() {
        this.privacyLevel = PrivacyLevel.HIGH.getLevel();
        this.sessionTimeout = 15;
        this.autoBackup = true;
    }

    /**
     * 절약 모드 활성화
     */
    public void enableSavingMode() {
        this.dataSaveMode = true;
        this.autoBackup = false;
        this.marketingNotification = false;
        this.sessionTimeout = 60;
    }
}