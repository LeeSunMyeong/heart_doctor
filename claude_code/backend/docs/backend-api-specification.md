# 심장질환 검사 시스템 - 백엔드 설계 명세서

## 📋 목차

1. [개요](#개요)
2. [데이터베이스 스키마 설계](#데이터베이스-스키마-설계)
3. [클래스 아키텍처 설계](#클래스-아키텍처-설계)
4. [메소드 알고리즘 설계](#메소드-알고리즘-설계)
5. [API 설계](#api-설계)
6. [보안 설계](#보안-설계)
7. [확장성 고려사항](#확장성-고려사항)

## 개요

### 시스템 목적
CBNU 심장질환 검사 시스템의 백엔드는 의료 데이터 처리, 사용자 관리, 결제 시스템, 관리자 대시보드를 제공하는 종합적인 헬스케어 플랫폼입니다.

### 기술 스택
- **Backend**: Spring Boot 3.5.6 + Java 17
- **Database**: MySQL 8.0 + Redis (Session)
- **Security**: Spring Security + JWT
- **Build**: Gradle
- **Deployment**: Docker + Cloud Platform

## 데이터베이스 스키마 설계

### 1. 사용자 관리 테이블

#### users (사용자)
```sql
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    full_name VARCHAR(100) NOT NULL,
    birth_date DATE,
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED') DEFAULT 'ACTIVE',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP NULL,
    failed_login_attempts INT DEFAULT 0,
    account_locked_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email (email),
    INDEX idx_phone_number (phone_number),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);
```

#### user_profiles (사용자 프로필)
```sql
CREATE TABLE user_profiles (
    profile_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    medical_history TEXT,
    current_medications TEXT,
    allergies TEXT,
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_profile (user_id)
);
```

#### user_settings (사용자 환경설정)
```sql
CREATE TABLE user_settings (
    setting_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    language_code VARCHAR(10) DEFAULT 'ko',
    timezone VARCHAR(50) DEFAULT 'Asia/Seoul',
    notification_enabled BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    preferred_input_method ENUM('TOUCH', 'VOICE', 'TEXT') DEFAULT 'TOUCH',
    usage_time_limit_minutes INT DEFAULT 0,
    auto_logout_minutes INT DEFAULT 30,
    theme_preference ENUM('LIGHT', 'DARK', 'AUTO') DEFAULT 'LIGHT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_settings (user_id)
);
```

### 2. 검사 및 진단 테이블

#### test_categories (검사 카테고리)
```sql
CREATE TABLE test_categories (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    category_code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_category_code (category_code),
    INDEX idx_is_active (is_active)
);
```

#### test_types (검사 유형)
```sql
CREATE TABLE test_types (
    test_type_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    test_code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    duration_minutes INT,
    preparation_instructions TEXT,
    normal_range_min DECIMAL(10,4),
    normal_range_max DECIMAL(10,4),
    unit VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    requires_fasting BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES test_categories(category_id),
    INDEX idx_test_code (test_code),
    INDEX idx_category_id (category_id),
    INDEX idx_is_active (is_active)
);
```

#### test_sessions (검사 세션)
```sql
CREATE TABLE test_sessions (
    session_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    test_type_id BIGINT NOT NULL,
    session_status ENUM('STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'FAILED') DEFAULT 'STARTED',
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    device_info JSON,
    environment_data JSON,
    session_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (test_type_id) REFERENCES test_types(test_type_id),
    INDEX idx_user_id (user_id),
    INDEX idx_test_type_id (test_type_id),
    INDEX idx_session_status (session_status),
    INDEX idx_start_time (start_time)
);
```

#### test_results (검사 결과)
```sql
CREATE TABLE test_results (
    result_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    test_type_id BIGINT NOT NULL,
    raw_data JSON NOT NULL,
    processed_data JSON,
    heart_rate_bpm INT,
    blood_pressure_systolic INT,
    blood_pressure_diastolic INT,
    ecg_data LONGTEXT,
    measurement_values JSON,
    analysis_result JSON,
    risk_level ENUM('LOW', 'MODERATE', 'HIGH', 'CRITICAL') DEFAULT 'LOW',
    confidence_score DECIMAL(5,4),
    abnormal_indicators JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (session_id) REFERENCES test_sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (test_type_id) REFERENCES test_types(test_type_id),
    INDEX idx_session_id (session_id),
    INDEX idx_user_id (user_id),
    INDEX idx_test_type_id (test_type_id),
    INDEX idx_risk_level (risk_level),
    INDEX idx_created_at (created_at)
);
```

#### test_images (검사 이미지)
```sql
CREATE TABLE test_images (
    image_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    result_id BIGINT NOT NULL,
    image_type ENUM('ECG', 'CHART', 'REPORT', 'ORIGINAL') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    image_metadata JSON,
    is_encrypted BOOLEAN DEFAULT TRUE,
    encryption_key_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (result_id) REFERENCES test_results(result_id) ON DELETE CASCADE,
    INDEX idx_result_id (result_id),
    INDEX idx_image_type (image_type)
);
```

#### diagnoses (진단)
```sql
CREATE TABLE diagnoses (
    diagnosis_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    result_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    diagnosis_code VARCHAR(20),
    diagnosis_name VARCHAR(200) NOT NULL,
    diagnosis_description TEXT,
    severity ENUM('MILD', 'MODERATE', 'SEVERE', 'CRITICAL') DEFAULT 'MILD',
    confidence_level DECIMAL(5,4),
    recommended_actions TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_days INT,
    created_by VARCHAR(100),
    reviewed_by VARCHAR(100),
    reviewed_at TIMESTAMP NULL,
    is_ai_generated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (result_id) REFERENCES test_results(result_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_result_id (result_id),
    INDEX idx_user_id (user_id),
    INDEX idx_diagnosis_code (diagnosis_code),
    INDEX idx_severity (severity)
);
```

### 3. 결제 관리 테이블

#### payment_plans (결제 플랜)
```sql
CREATE TABLE payment_plans (
    plan_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(100) NOT NULL,
    plan_code VARCHAR(50) NOT NULL UNIQUE,
    plan_type ENUM('FREE', 'BASIC', 'PREMIUM', 'PROFESSIONAL') NOT NULL,
    price_amount DECIMAL(10,2) NOT NULL,
    currency_code VARCHAR(3) DEFAULT 'KRW',
    billing_cycle ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY') NOT NULL,
    test_limit_per_cycle INT DEFAULT -1,
    features JSON,
    is_active BOOLEAN DEFAULT TRUE,
    trial_days INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_plan_code (plan_code),
    INDEX idx_plan_type (plan_type),
    INDEX idx_is_active (is_active)
);
```

#### user_subscriptions (사용자 구독)
```sql
CREATE TABLE user_subscriptions (
    subscription_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    plan_id BIGINT NOT NULL,
    status ENUM('ACTIVE', 'CANCELLED', 'EXPIRED', 'SUSPENDED') DEFAULT 'ACTIVE',
    start_date DATE NOT NULL,
    end_date DATE,
    auto_renewal BOOLEAN DEFAULT TRUE,
    trial_end_date DATE,
    tests_used_this_cycle INT DEFAULT 0,
    cycle_start_date DATE NOT NULL,
    cycle_end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (plan_id) REFERENCES payment_plans(plan_id),
    INDEX idx_user_id (user_id),
    INDEX idx_plan_id (plan_id),
    INDEX idx_status (status),
    INDEX idx_end_date (end_date)
);
```

#### payments (결제)
```sql
CREATE TABLE payments (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    subscription_id BIGINT,
    payment_method ENUM('CREDIT_CARD', 'BANK_TRANSFER', 'MOBILE_PAY', 'APPLE_PAY', 'GOOGLE_PAY') NOT NULL,
    payment_provider VARCHAR(100),
    external_payment_id VARCHAR(200),
    amount DECIMAL(10,2) NOT NULL,
    currency_code VARCHAR(3) DEFAULT 'KRW',
    payment_status ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED') DEFAULT 'PENDING',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    invoice_number VARCHAR(100),
    receipt_url VARCHAR(500),
    failure_reason TEXT,
    refund_amount DECIMAL(10,2) DEFAULT 0,
    refund_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (subscription_id) REFERENCES user_subscriptions(subscription_id),
    INDEX idx_user_id (user_id),
    INDEX idx_subscription_id (subscription_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_payment_date (payment_date),
    INDEX idx_external_payment_id (external_payment_id)
);
```

### 4. 관리자 및 시스템 테이블

#### admin_users (관리자)
```sql
CREATE TABLE admin_users (
    admin_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'VIEWER') NOT NULL,
    permissions JSON,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP NULL,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by) REFERENCES admin_users(admin_id),
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active)
);
```

#### system_notifications (시스템 알림)
```sql
CREATE TABLE system_notifications (
    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    target_type ENUM('USER', 'ADMIN', 'ALL') NOT NULL,
    target_id BIGINT,
    notification_type ENUM('INFO', 'WARNING', 'ERROR', 'SUCCESS') DEFAULT 'INFO',
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    action_url VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_target_type_id (target_type, target_id),
    INDEX idx_notification_type (notification_type),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);
```

#### audit_logs (감사 로그)
```sql
CREATE TABLE audit_logs (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_type ENUM('USER', 'ADMIN', 'SYSTEM') NOT NULL,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id BIGINT,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(100),
    status ENUM('SUCCESS', 'FAILURE', 'ERROR') DEFAULT 'SUCCESS',
    error_message TEXT,
    execution_time_ms INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_user_type_id (user_type, user_id),
    INDEX idx_action (action),
    INDEX idx_resource_type (resource_type),
    INDEX idx_created_at (created_at),
    INDEX idx_status (status)
);
```

### 5. 앱 배포 및 운영 테이블

#### app_versions (앱 버전)
```sql
CREATE TABLE app_versions (
    version_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    platform ENUM('ANDROID', 'IOS') NOT NULL,
    version_name VARCHAR(20) NOT NULL,
    version_code INT NOT NULL,
    build_number VARCHAR(50),
    release_notes TEXT,
    min_supported_os VARCHAR(20),
    download_url VARCHAR(500),
    file_size_bytes BIGINT,
    checksum VARCHAR(64),
    status ENUM('DEVELOPMENT', 'TESTING', 'APPROVED', 'RELEASED', 'DEPRECATED') DEFAULT 'DEVELOPMENT',
    is_force_update BOOLEAN DEFAULT FALSE,
    rollout_percentage INT DEFAULT 0,
    release_date TIMESTAMP NULL,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by) REFERENCES admin_users(admin_id),
    UNIQUE KEY uk_platform_version (platform, version_name),
    INDEX idx_platform (platform),
    INDEX idx_status (status),
    INDEX idx_release_date (release_date)
);
```

## 클래스 아키텍처 설계

### 1. Entity Classes (JPA Entities)

#### User Entity
```java
@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@ToString(exclude = {"passwordHash", "testSessions", "subscriptions"})
@EqualsAndHashCode(of = "id")
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private UserStatus status;

    @Column(name = "email_verified")
    private Boolean emailVerified = false;

    @Column(name = "phone_verified")
    private Boolean phoneVerified = false;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "failed_login_attempts")
    private Integer failedLoginAttempts = 0;

    @Column(name = "account_locked_until")
    private LocalDateTime accountLockedUntil;

    // Relationships
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private UserProfile profile;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private UserSettings settings;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestSession> testSessions = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserSubscription> subscriptions = new ArrayList<>();

    // Business Methods
    public boolean isActive() {
        return UserStatus.ACTIVE.equals(this.status);
    }

    public boolean isAccountLocked() {
        return accountLockedUntil != null && accountLockedUntil.isAfter(LocalDateTime.now());
    }

    public void lockAccount(Duration duration) {
        this.accountLockedUntil = LocalDateTime.now().plus(duration);
    }

    public void unlockAccount() {
        this.accountLockedUntil = null;
        this.failedLoginAttempts = 0;
    }

    public void incrementFailedLoginAttempts() {
        this.failedLoginAttempts++;
    }

    public void updateLastLogin() {
        this.lastLoginAt = LocalDateTime.now();
        this.failedLoginAttempts = 0;
    }

    public int getAge() {
        if (birthDate == null) return 0;
        return Period.between(birthDate, LocalDate.now()).getYears();
    }
}
```

#### TestResult Entity
```java
@Entity
@Table(name = "test_results")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@ToString(exclude = {"rawData", "processedData", "ecgData"})
public class TestResult extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private TestSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_type_id", nullable = false)
    private TestType testType;

    @Column(name = "raw_data", columnDefinition = "JSON")
    @Convert(converter = JsonConverter.class)
    private Map<String, Object> rawData;

    @Column(name = "processed_data", columnDefinition = "JSON")
    @Convert(converter = JsonConverter.class)
    private Map<String, Object> processedData;

    @Column(name = "heart_rate_bpm")
    private Integer heartRateBpm;

    @Column(name = "blood_pressure_systolic")
    private Integer bloodPressureSystolic;

    @Column(name = "blood_pressure_diastolic")
    private Integer bloodPressureDiastolic;

    @Lob
    @Column(name = "ecg_data")
    private String ecgData;

    @Column(name = "measurement_values", columnDefinition = "JSON")
    @Convert(converter = JsonConverter.class)
    private Map<String, Double> measurementValues;

    @Column(name = "analysis_result", columnDefinition = "JSON")
    @Convert(converter = JsonConverter.class)
    private AnalysisResult analysisResult;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level")
    private RiskLevel riskLevel = RiskLevel.LOW;

    @Column(name = "confidence_score", precision = 5, scale = 4)
    private BigDecimal confidenceScore;

    @Column(name = "abnormal_indicators", columnDefinition = "JSON")
    @Convert(converter = JsonConverter.class)
    private List<String> abnormalIndicators;

    // Relationships
    @OneToMany(mappedBy = "testResult", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "testResult", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Diagnosis> diagnoses = new ArrayList<>();

    // Business Methods
    public boolean isAbnormal() {
        return !RiskLevel.LOW.equals(riskLevel) ||
               (abnormalIndicators != null && !abnormalIndicators.isEmpty());
    }

    public boolean requiresImmediateAttention() {
        return RiskLevel.CRITICAL.equals(riskLevel);
    }

    public void addAbnormalIndicator(String indicator) {
        if (abnormalIndicators == null) {
            abnormalIndicators = new ArrayList<>();
        }
        abnormalIndicators.add(indicator);
    }

    public double getConfidencePercentage() {
        return confidenceScore != null ? confidenceScore.doubleValue() * 100 : 0.0;
    }
}
```

### 2. Service Classes

#### UserService
```java
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserProfileService userProfileService;
    private final UserSettingsService userSettingsService;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    @Transactional
    public UserResponseDto createUser(UserCreateDto userCreateDto) {
        validateUserCreation(userCreateDto);

        User user = User.builder()
                .email(userCreateDto.getEmail())
                .passwordHash(passwordEncoder.encode(userCreateDto.getPassword()))
                .fullName(userCreateDto.getFullName())
                .phoneNumber(userCreateDto.getPhoneNumber())
                .birthDate(userCreateDto.getBirthDate())
                .gender(userCreateDto.getGender())
                .status(UserStatus.ACTIVE)
                .emailVerified(false)
                .phoneVerified(false)
                .failedLoginAttempts(0)
                .build();

        User savedUser = userRepository.save(user);

        // Create default profile and settings
        userProfileService.createDefaultProfile(savedUser);
        userSettingsService.createDefaultSettings(savedUser);

        // Send verification email
        notificationService.sendEmailVerification(savedUser);

        // Log user creation
        auditLogService.logUserAction(savedUser.getId(), "USER_CREATED",
                Map.of("email", savedUser.getEmail()));

        log.info("Created new user with ID: {}", savedUser.getId());

        return UserResponseDto.from(savedUser);
    }

    @Transactional
    public UserResponseDto authenticateUser(UserLoginDto loginDto) {
        User user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + loginDto.getEmail()));

        // Check if account is locked
        if (user.isAccountLocked()) {
            throw new AccountLockedException("Account is temporarily locked");
        }

        // Verify password
        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPasswordHash())) {
            handleFailedLogin(user);
            throw new InvalidCredentialsException("Invalid email or password");
        }

        // Check if account is active
        if (!user.isActive()) {
            throw new InactiveAccountException("Account is not active");
        }

        // Update last login
        user.updateLastLogin();
        userRepository.save(user);

        // Log successful login
        auditLogService.logUserAction(user.getId(), "USER_LOGIN",
                Map.of("email", user.getEmail(), "loginTime", LocalDateTime.now()));

        log.info("User authenticated successfully: {}", user.getId());

        return UserResponseDto.from(user);
    }

    private void handleFailedLogin(User user) {
        user.incrementFailedLoginAttempts();

        // Lock account after 5 failed attempts
        if (user.getFailedLoginAttempts() >= 5) {
            user.lockAccount(Duration.ofMinutes(30));
            notificationService.sendAccountLockNotification(user);
            log.warn("Account locked due to failed login attempts: {}", user.getEmail());
        }

        userRepository.save(user);

        auditLogService.logUserAction(user.getId(), "FAILED_LOGIN",
                Map.of("email", user.getEmail(), "attempts", user.getFailedLoginAttempts()));
    }

    private void validateUserCreation(UserCreateDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new UserAlreadyExistsException("User already exists with email: " + dto.getEmail());
        }

        if (dto.getPhoneNumber() != null && userRepository.existsByPhoneNumber(dto.getPhoneNumber())) {
            throw new UserAlreadyExistsException("User already exists with phone number: " + dto.getPhoneNumber());
        }
    }
}
```

#### TestResultService
```java
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class TestResultService {

    private final TestResultRepository testResultRepository;
    private final TestSessionRepository testSessionRepository;
    private final HeartDiseaseAnalysisEngine analysisEngine;
    private final TestImageService testImageService;
    private final DiagnosisService diagnosisService;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Transactional
    public TestResultResponseDto processTestResult(Long sessionId, TestResultCreateDto createDto) {
        TestSession session = testSessionRepository.findById(sessionId)
                .orElseThrow(() -> new TestSessionNotFoundException("Test session not found: " + sessionId));

        // Validate test data
        validateTestData(createDto);

        // Process raw data through AI analysis engine
        AnalysisResult analysisResult = analysisEngine.analyzeHeartData(createDto.getRawData());

        // Create test result
        TestResult testResult = TestResult.builder()
                .session(session)
                .user(session.getUser())
                .testType(session.getTestType())
                .rawData(createDto.getRawData())
                .processedData(analysisResult.getProcessedData())
                .heartRateBpm(extractHeartRate(createDto.getRawData()))
                .bloodPressureSystolic(extractSystolic(createDto.getRawData()))
                .bloodPressureDiastolic(extractDiastolic(createDto.getRawData()))
                .ecgData(createDto.getEcgData())
                .measurementValues(analysisResult.getMeasurementValues())
                .analysisResult(analysisResult)
                .riskLevel(analysisResult.getRiskLevel())
                .confidenceScore(analysisResult.getConfidenceScore())
                .abnormalIndicators(analysisResult.getAbnormalIndicators())
                .build();

        TestResult savedResult = testResultRepository.save(testResult);

        // Process images if provided
        if (createDto.getImages() != null && !createDto.getImages().isEmpty()) {
            testImageService.processTestImages(savedResult, createDto.getImages());
        }

        // Generate AI diagnosis
        diagnosisService.generateAIDiagnosis(savedResult);

        // Send notifications for abnormal results
        if (savedResult.isAbnormal()) {
            notificationService.sendAbnormalResultNotification(savedResult);
        }

        // Log test result processing
        auditLogService.logUserAction(session.getUser().getId(), "TEST_RESULT_PROCESSED",
                Map.of("resultId", savedResult.getId(), "riskLevel", savedResult.getRiskLevel()));

        log.info("Processed test result for session: {}, risk level: {}",
                sessionId, savedResult.getRiskLevel());

        return TestResultResponseDto.from(savedResult);
    }

    public List<TestResultResponseDto> getUserTestHistory(Long userId, LocalDateTime fromDate, LocalDateTime toDate) {
        List<TestResult> results = testResultRepository.findByUserIdAndCreatedAtBetween(
                userId, fromDate, toDate);

        return results.stream()
                .map(TestResultResponseDto::from)
                .collect(Collectors.toList());
    }

    private void validateTestData(TestResultCreateDto dto) {
        if (dto.getRawData() == null || dto.getRawData().isEmpty()) {
            throw new InvalidTestDataException("Raw test data is required");
        }

        // Validate heart rate data
        if (dto.getRawData().containsKey("heartRate")) {
            Integer heartRate = (Integer) dto.getRawData().get("heartRate");
            if (heartRate < 30 || heartRate > 250) {
                throw new InvalidTestDataException("Heart rate out of valid range: " + heartRate);
            }
        }

        // Validate blood pressure data
        if (dto.getRawData().containsKey("bloodPressure")) {
            Map<String, Integer> bp = (Map<String, Integer>) dto.getRawData().get("bloodPressure");
            if (bp.get("systolic") < 70 || bp.get("systolic") > 200) {
                throw new InvalidTestDataException("Systolic blood pressure out of valid range");
            }
            if (bp.get("diastolic") < 40 || bp.get("diastolic") > 120) {
                throw new InvalidTestDataException("Diastolic blood pressure out of valid range");
            }
        }
    }

    private Integer extractHeartRate(Map<String, Object> rawData) {
        return rawData.containsKey("heartRate") ? (Integer) rawData.get("heartRate") : null;
    }

    private Integer extractSystolic(Map<String, Object> rawData) {
        if (rawData.containsKey("bloodPressure")) {
            Map<String, Integer> bp = (Map<String, Integer>) rawData.get("bloodPressure");
            return bp.get("systolic");
        }
        return null;
    }

    private Integer extractDiastolic(Map<String, Object> rawData) {
        if (rawData.containsKey("bloodPressure")) {
            Map<String, Integer> bp = (Map<String, Integer>) rawData.get("bloodPressure");
            return bp.get("diastolic");
        }
        return null;
    }
}
```

#### PaymentService
```java
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserSubscriptionRepository subscriptionRepository;
    private final PaymentPlanRepository planRepository;
    private final PaymentGatewayService paymentGatewayService;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Transactional
    public PaymentResponseDto processPayment(Long userId, PaymentCreateDto paymentDto) {
        User user = getUserById(userId);
        PaymentPlan plan = planRepository.findById(paymentDto.getPlanId())
                .orElseThrow(() -> new PaymentPlanNotFoundException("Payment plan not found: " + paymentDto.getPlanId()));

        // Create payment record
        Payment payment = Payment.builder()
                .user(user)
                .paymentMethod(paymentDto.getPaymentMethod())
                .paymentProvider(paymentDto.getPaymentProvider())
                .amount(plan.getPriceAmount())
                .currencyCode(plan.getCurrencyCode())
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        try {
            // Process payment through external gateway
            PaymentGatewayResponse gatewayResponse = paymentGatewayService.processPayment(
                    PaymentGatewayRequest.builder()
                            .amount(plan.getPriceAmount())
                            .currency(plan.getCurrencyCode())
                            .paymentMethod(paymentDto.getPaymentMethod())
                            .customerInfo(buildCustomerInfo(user))
                            .build()
            );

            // Update payment with gateway response
            savedPayment.setExternalPaymentId(gatewayResponse.getTransactionId());
            savedPayment.setPaymentStatus(gatewayResponse.isSuccessful() ?
                    PaymentStatus.COMPLETED : PaymentStatus.FAILED);
            savedPayment.setReceiptUrl(gatewayResponse.getReceiptUrl());

            if (!gatewayResponse.isSuccessful()) {
                savedPayment.setFailureReason(gatewayResponse.getErrorMessage());
                paymentRepository.save(savedPayment);
                throw new PaymentProcessingException("Payment failed: " + gatewayResponse.getErrorMessage());
            }

            // Create or update subscription
            UserSubscription subscription = createOrUpdateSubscription(user, plan, savedPayment);
            savedPayment.setSubscription(subscription);

            paymentRepository.save(savedPayment);

            // Send confirmation notifications
            notificationService.sendPaymentConfirmation(user, savedPayment);

            // Log successful payment
            auditLogService.logUserAction(userId, "PAYMENT_COMPLETED",
                    Map.of("paymentId", savedPayment.getId(), "amount", savedPayment.getAmount()));

            log.info("Payment processed successfully for user: {}, amount: {}",
                    userId, savedPayment.getAmount());

            return PaymentResponseDto.from(savedPayment);

        } catch (Exception e) {
            // Update payment status to failed
            savedPayment.setPaymentStatus(PaymentStatus.FAILED);
            savedPayment.setFailureReason(e.getMessage());
            paymentRepository.save(savedPayment);

            // Log failed payment
            auditLogService.logUserAction(userId, "PAYMENT_FAILED",
                    Map.of("paymentId", savedPayment.getId(), "error", e.getMessage()));

            log.error("Payment processing failed for user: {}", userId, e);
            throw new PaymentProcessingException("Payment processing failed", e);
        }
    }

    private UserSubscription createOrUpdateSubscription(User user, PaymentPlan plan, Payment payment) {
        Optional<UserSubscription> existingSubscription =
                subscriptionRepository.findActiveSubscriptionByUserId(user.getId());

        UserSubscription subscription;

        if (existingSubscription.isPresent()) {
            // Extend existing subscription
            subscription = existingSubscription.get();
            subscription.extendSubscription(plan);
        } else {
            // Create new subscription
            LocalDate startDate = LocalDate.now();
            LocalDate endDate = calculateEndDate(startDate, plan.getBillingCycle());

            subscription = UserSubscription.builder()
                    .user(user)
                    .plan(plan)
                    .status(SubscriptionStatus.ACTIVE)
                    .startDate(startDate)
                    .endDate(endDate)
                    .autoRenewal(true)
                    .testsUsedThisCycle(0)
                    .cycleStartDate(startDate)
                    .cycleEndDate(endDate)
                    .build();
        }

        return subscriptionRepository.save(subscription);
    }

    private LocalDate calculateEndDate(LocalDate startDate, BillingCycle billingCycle) {
        return switch (billingCycle) {
            case DAILY -> startDate.plusDays(1);
            case WEEKLY -> startDate.plusWeeks(1);
            case MONTHLY -> startDate.plusMonths(1);
            case YEARLY -> startDate.plusYears(1);
        };
    }
}
```

### 3. Controller Classes

#### UserController
```java
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Validated
@Slf4j
@Api(tags = "User Management")
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    @ApiOperation(value = "사용자 등록", notes = "새로운 사용자를 등록합니다.")
    public ResponseEntity<ApiResponse<UserResponseDto>> registerUser(
            @Valid @RequestBody UserCreateDto userCreateDto) {

        UserResponseDto userResponse = userService.createUser(userCreateDto);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(userResponse, "사용자가 성공적으로 등록되었습니다."));
    }

    @PostMapping("/login")
    @ApiOperation(value = "사용자 로그인", notes = "사용자 인증을 수행합니다.")
    public ResponseEntity<ApiResponse<LoginResponseDto>> login(
            @Valid @RequestBody UserLoginDto loginDto,
            HttpServletRequest request) {

        UserResponseDto userResponse = userService.authenticateUser(loginDto);

        // Generate JWT token
        String accessToken = jwtTokenProvider.generateAccessToken(userResponse.getId());
        String refreshToken = jwtTokenProvider.generateRefreshToken(userResponse.getId());

        LoginResponseDto loginResponse = LoginResponseDto.builder()
                .user(userResponse)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getAccessTokenExpiration())
                .build();

        return ResponseEntity.ok(ApiResponse.success(loginResponse, "로그인되었습니다."));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    @ApiOperation(value = "내 정보 조회", notes = "현재 사용자의 정보를 조회합니다.")
    public ResponseEntity<ApiResponse<UserResponseDto>> getCurrentUser(
            Authentication authentication) {

        Long userId = getUserIdFromAuthentication(authentication);
        UserResponseDto userResponse = userService.getUserById(userId);

        return ResponseEntity.ok(ApiResponse.success(userResponse));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('USER')")
    @ApiOperation(value = "내 정보 수정", notes = "현재 사용자의 정보를 수정합니다.")
    public ResponseEntity<ApiResponse<UserResponseDto>> updateCurrentUser(
            @Valid @RequestBody UserUpdateDto updateDto,
            Authentication authentication) {

        Long userId = getUserIdFromAuthentication(authentication);
        UserResponseDto userResponse = userService.updateUser(userId, updateDto);

        return ResponseEntity.ok(ApiResponse.success(userResponse, "사용자 정보가 수정되었습니다."));
    }

    @PutMapping("/me/password")
    @PreAuthorize("hasRole('USER')")
    @ApiOperation(value = "비밀번호 변경", notes = "현재 사용자의 비밀번호를 변경합니다.")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody PasswordChangeDto passwordChangeDto,
            Authentication authentication) {

        Long userId = getUserIdFromAuthentication(authentication);
        userService.changePassword(userId, passwordChangeDto);

        return ResponseEntity.ok(ApiResponse.success(null, "비밀번호가 변경되었습니다."));
    }

    @DeleteMapping("/me")
    @PreAuthorize("hasRole('USER')")
    @ApiOperation(value = "회원 탈퇴", notes = "현재 사용자 계정을 삭제합니다.")
    public ResponseEntity<ApiResponse<Void>> deleteCurrentUser(
            @Valid @RequestBody AccountDeleteDto deleteDto,
            Authentication authentication) {

        Long userId = getUserIdFromAuthentication(authentication);
        userService.deleteUser(userId, deleteDto);

        return ResponseEntity.ok(ApiResponse.success(null, "계정이 삭제되었습니다."));
    }

    private Long getUserIdFromAuthentication(Authentication authentication) {
        return ((UserPrincipal) authentication.getPrincipal()).getUserId();
    }
}
```

#### TestResultController
```java
@RestController
@RequestMapping("/api/v1/test-results")
@RequiredArgsConstructor
@Validated
@Slf4j
@Api(tags = "Test Result Management")
public class TestResultController {

    private final TestResultService testResultService;
    private final TestSessionService testSessionService;

    @PostMapping("/sessions/{sessionId}/results")
    @PreAuthorize("hasRole('USER')")
    @ApiOperation(value = "검사 결과 저장", notes = "검사 결과를 저장하고 분석합니다.")
    public ResponseEntity<ApiResponse<TestResultResponseDto>> createTestResult(
            @PathVariable @Min(1) Long sessionId,
            @Valid @RequestBody TestResultCreateDto createDto,
            Authentication authentication) {

        Long userId = getUserIdFromAuthentication(authentication);

        // Validate session ownership
        testSessionService.validateSessionOwnership(sessionId, userId);

        TestResultResponseDto result = testResultService.processTestResult(sessionId, createDto);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(result, "검사 결과가 저장되었습니다."));
    }

    @GetMapping("/my-history")
    @PreAuthorize("hasRole('USER')")
    @ApiOperation(value = "내 검사 이력", notes = "사용자의 검사 이력을 조회합니다.")
    public ResponseEntity<ApiResponse<PageResponse<TestResultResponseDto>>> getMyTestHistory(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate,
            @RequestParam(required = false) String testType,
            Authentication authentication) {

        Long userId = getUserIdFromAuthentication(authentication);

        PageResponse<TestResultResponseDto> results = testResultService.getUserTestHistory(
                userId, page, size, fromDate, toDate, testType);

        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @GetMapping("/{resultId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @ApiOperation(value = "검사 결과 상세", notes = "특정 검사 결과의 상세 정보를 조회합니다.")
    public ResponseEntity<ApiResponse<TestResultDetailDto>> getTestResultDetail(
            @PathVariable @Min(1) Long resultId,
            Authentication authentication) {

        TestResultDetailDto result = testResultService.getTestResultDetail(resultId);

        // Check ownership for users (admins can view all)
        if (authentication.getAuthorities().stream()
                .noneMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"))) {
            Long userId = getUserIdFromAuthentication(authentication);
            if (!result.getUserId().equals(userId)) {
                throw new AccessDeniedException("접근 권한이 없습니다.");
            }
        }

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{resultId}/export")
    @PreAuthorize("hasRole('USER')")
    @ApiOperation(value = "검사 결과 내보내기", notes = "검사 결과를 PDF 형태로 내보냅니다.")
    public ResponseEntity<Resource> exportTestResult(
            @PathVariable @Min(1) Long resultId,
            @RequestParam(defaultValue = "PDF") ExportFormat format,
            Authentication authentication) {

        Long userId = getUserIdFromAuthentication(authentication);

        ByteArrayResource resource = testResultService.exportTestResult(resultId, userId, format);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"test-result-" + resultId + "." + format.getExtension() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    private Long getUserIdFromAuthentication(Authentication authentication) {
        return ((UserPrincipal) authentication.getPrincipal()).getUserId();
    }
}
```

## 메소드 알고리즘 설계

### 1. 심장질환 분석 알고리즘

#### HeartDiseaseAnalysisEngine - 심장 데이터 종합 분석
**목적**: 사용자가 입력한 심장 관련 측정 데이터를 AI 분석하여 심장질환 위험도를 평가

**처리 단계**:
1. **데이터 전처리 및 검증**
   - 원시 데이터에서 심박수, RR 간격, ECG 데이터 추출
   - 데이터 품질 검사 (누락값, 범위 초과값 확인)
   - 이동평균 필터로 노이즈 제거
   - IQR 방법으로 이상치 탐지 및 제거

2. **심박수 분석**
   - 평균 심박수, 최대/최소 심박수 계산
   - 심박수 변이도(HRV) 분석
   - 시간 도메인 지표 계산 (SDNN, RMSSD, pNN50)
   - 주파수 도메인 지표 계산 (LF, HF, LF/HF 비율)

3. **ECG 분석 (선택적)**
   - P파, QRS 복합체, T파 형태 분석
   - QT 간격, ST 분절 변화 검출
   - 부정맥 패턴 탐지

4. **ML 모델 질병 예측**
   - 추출된 특성값들을 벡터로 구성
   - 사전 훈련된 기계학습 모델로 질병 분류
   - 신뢰도 점수 계산

5. **위험도 종합 평가**
   - 심박수 분석, ECG 분석, ML 예측 결과 통합
   - 위험도 레벨 결정 (LOW, MODERATE, HIGH, CRITICAL)
   - 이상 지표 목록 생성

### 2. 결제 처리 알고리즘

#### PaymentGatewayService - 안전한 결제 처리
**목적**: 다양한 결제 수단을 통한 안전하고 신뢰성 있는 결제 처리

**처리 단계**:
1. **결제 요청 검증**
   - 결제 금액 유효성 검사 (0보다 큰 값, 한도 내)
   - 결제 방법 및 고객 정보 완성도 확인
   - 결제 한도 초과 여부 검증

2. **민감 정보 암호화**
   - 신용카드 번호, CVV 등 민감 정보 AES 암호화
   - 각 결제마다 고유한 거래 ID 생성
   - 타임스탬프 및 무결성 검증 정보 추가

3. **결제 게이트웨이 연동**
   - 결제 방법별 적절한 PG사 API 호출
   - 신용카드, 은행이체, 모바일페이, Apple Pay, Google Pay 지원
   - API 호출 실패시 재시도 로직 적용

4. **응답 처리 및 검증**
   - PG사 응답 데이터 무결성 검증
   - 결제 승인/거부 상태 확인
   - 영수증 URL 및 승인번호 저장

5. **오류 처리 및 재시도**
   - 네트워크 오류, 타임아웃 등 재시도 가능한 오류 판별
   - 최대 3회까지 자동 재시도
   - 재시도 불가능한 오류는 즉시 실패 처리

### 3. 보안 암호화 알고리즘

#### EncryptionService - 의료 데이터 보호 암호화
**목적**: 의료 개인정보를 안전하게 암호화하여 저장 및 전송

**암호화 과정**:
1. **데이터 암호화 키(DEK) 생성**
   - 각 데이터마다 고유한 256비트 AES 키 생성
   - 암호학적으로 안전한 난수 생성기 사용

2. **실제 데이터 암호화**
   - AES-GCM 알고리즘으로 평문 데이터 암호화
   - 12바이트 초기화 벡터(IV) 무작위 생성
   - 128비트 인증 태그로 무결성 보장

3. **키 암호화 키(KEK)로 DEK 보호**
   - 마스터 키를 사용하여 DEK 암호화
   - 실제 환경에서는 HSM 또는 KMS 사용 권장

4. **암호화 결과 패키징**
   - 암호화된 데이터, 암호화된 키, IV, 태그를 JSON으로 조합
   - Base64 인코딩으로 안전한 텍스트 형태로 변환

**복호화 과정**:
1. **암호화 데이터 파싱**
   - Base64 디코딩 후 JSON 구조 분석
   - 암호화 메타데이터 추출

2. **DEK 복구**
   - 마스터 키로 암호화된 DEK 복호화
   - 키 무결성 검증

3. **실제 데이터 복호화**
   - 복구된 DEK와 IV를 사용하여 AES-GCM 복호화
   - 인증 태그로 데이터 무결성 검증
   - 원본 평문 데이터 반환

**보안 특징**:
- **데이터별 독립 암호화**: 각 데이터마다 서로 다른 키 사용
- **무결성 보장**: GCM 모드의 인증 태그로 변조 탐지
- **키 분리**: 실제 데이터와 암호화 키를 분리 저장
- **재사용 방지**: IV를 통한 동일 데이터의 다른 암호문 생성

이 설계 문서는 심장질환 검사 시스템의 핵심적인 데이터베이스 스키마, 클래스 구조, 그리고 주요 알고리즘을 포함하고 있습니다. 의료 데이터의 특성을 고려한 보안성과 확장성을 중점으로 설계되었습니다.