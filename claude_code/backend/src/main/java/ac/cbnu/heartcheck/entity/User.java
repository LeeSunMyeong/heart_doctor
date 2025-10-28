package ac.cbnu.heartcheck.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * User entity for Heart Doctor system
 * 사용자 계정 및 기본 정보 관리 테이블
 *
 * @author CBNU Development Team
 * @version 1.4
 * @since 2024
 */
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_phone", columnList = "phone"),
    @Index(name = "idx_user_login_id", columnList = "login_id"),
    @Index(name = "idx_user_provider", columnList = "provider, provider_uid")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @NotBlank(message = "사용자 이름은 필수입니다")
    @Size(max = 30, message = "사용자 이름은 30자를 초과할 수 없습니다")
    @Column(name = "user_name", length = 30, nullable = false)
    private String userName;

    @NotBlank(message = "생년월일은 필수입니다")
    @Size(min = 8, max = 8, message = "생년월일은 YYYYMMDD 형식으로 8자여야 합니다")
    @Column(name = "user_dob", length = 8, nullable = false)
    private String userDob; // YYYYMMDD 형식

    @Size(max = 20, message = "로그인 아이디는 20자를 초과할 수 없습니다")
    @Column(name = "login_id", length = 20, unique = true)
    private String loginId; // 사용자가 입력한 로그인 아이디 (선택사항)

    @NotBlank(message = "휴대폰 번호는 필수입니다")
    @Size(max = 11, message = "휴대폰 번호는 11자를 초과할 수 없습니다")
    @Column(name = "phone", length = 11, nullable = false, unique = true)
    private String phone;

    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(max = 64, message = "비밀번호는 64자를 초과할 수 없습니다")
    @Column(name = "password", length = 64, nullable = false)
    private String password; // 암호화된 비밀번호

    @Size(max = 20, message = "SNS 제공자는 20자를 초과할 수 없습니다")
    @Column(name = "provider", length = 20)
    private String provider; // kakao, google, apple

    @Size(max = 100, message = "SNS 고유 식별자는 100자를 초과할 수 없습니다")
    @Column(name = "provider_uid", length = 100)
    private String providerUid; // SNS 고유 식별자

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role = Role.USER; // 사용자 역할

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true; // 활성 상태

    @Column(name = "last_login_time")
    private LocalDateTime lastLoginTime; // 마지막 로그인 시간

    @CreationTimestamp
    @Column(name = "create_time")
    private LocalDateTime createTime;

    // 관계 매핑 - Heart Doctor 명세서 기준
    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Check> checks = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Prediction> predictions = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Payment> payments = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Subscription> subscriptions = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Notification> notifications = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Setting> settings = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DailyUsageQuota> dailyUsageQuotas = new ArrayList<>();

    /**
     * 생년월일을 기반으로 나이 계산
     * @return 계산된 나이
     */
    public int calculateAge() {
        if (userDob == null || userDob.length() != 8) {
            return 0;
        }

        try {
            int birthYear = Integer.parseInt(userDob.substring(0, 4));
            int currentYear = LocalDateTime.now().getYear();
            return currentYear - birthYear;
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    /**
     * SNS 로그인 사용자인지 확인
     * @return SNS 로그인 여부
     */
    public boolean isSocialUser() {
        return provider != null && providerUid != null;
    }

    /**
     * 사용자 식별을 위한 고유 키 생성 (phone 기반)
     * @return 고유 키
     */
    public String getUniqueKey() {
        return phone;
    }

    /**
     * 사용자 역할 ENUM
     */
    public enum Role {
        USER("사용자"),
        ADMIN("관리자"),
        DOCTOR("의사");

        private final String description;

        Role(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    /**
     * SNS 제공자 ENUM
     */
    public enum Provider {
        GOOGLE("google", "구글"),
        APPLE("apple", "애플"),
        KAKAO("kakao", "카카오");

        private final String code;
        private final String displayName;

        Provider(String code, String displayName) {
            this.code = code;
            this.displayName = displayName;
        }

        public String getCode() {
            return code;
        }

        public String getDisplayName() {
            return displayName;
        }

        public static Provider fromCode(String code) {
            if (code == null) return null;
            for (Provider provider : values()) {
                if (provider.code.equals(code.toLowerCase())) {
                    return provider;
                }
            }
            return null;
        }
    }

    // 비즈니스 로직 메서드들

    /**
     * 활성 상태 확인
     * @return 활성 상태
     */
    public boolean isActive() {
        return Boolean.TRUE.equals(isActive);
    }

    /**
     * 관리자 권한 확인
     * @return 관리자 여부
     */
    public boolean isAdmin() {
        return Role.ADMIN.equals(role);
    }

    /**
     * 의사 권한 확인
     * @return 의사 여부
     */
    public boolean isDoctor() {
        return Role.DOCTOR.equals(role);
    }

    /**
     * SNS 로그인 사용자 확인
     * @return SNS 사용자 여부
     */
    public boolean isSnsUser() {
        return provider != null && providerUid != null;
    }

    /**
     * 로그인 이력 확인
     * @return 로그인 이력 존재 여부
     */
    public boolean hasLoginHistory() {
        return lastLoginTime != null;
    }

    /**
     * 계정 비활성화
     */
    public void deactivate() {
        this.isActive = false;
    }

    /**
     * 계정 활성화
     */
    public void activate() {
        this.isActive = true;
    }

    /**
     * 마지막 로그인 시간 업데이트
     */
    public void updateLastLoginTime() {
        this.lastLoginTime = LocalDateTime.now();
    }

    /**
     * SNS 제공자 ENUM 반환
     * @return 제공자 ENUM
     */
    public Provider getProviderEnum() {
        return Provider.fromCode(provider);
    }
}