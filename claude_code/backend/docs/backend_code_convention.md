# Backend Code Convention - Java & Spring Boot

본 문서는 심장질환 검사 시스템 백엔드 프로젝트의 Java 및 Spring Boot 코딩 컨벤션을 정의합니다.

## 📋 목차

1. [개요](#개요)
2. [Java 코딩 컨벤션](#java-코딩-컨벤션)
3. [Spring Boot 컨벤션](#spring-boot-컨벤션)
4. [패키지 구조](#패키지-구조)
5. [네이밍 컨벤션](#네이밍-컨벤션)
6. [애노테이션 사용 규칙](#애노테이션-사용-규칙)
7. [예외 처리](#예외-처리)
8. [로깅](#로깅)
9. [테스트 코드](#테스트-코드)
10. [보안 코딩](#보안-코딩)

## 개요

### 기술 스택
- **Java**: 17 (LTS)
- **Spring Boot**: 3.5.6
- **Build Tool**: Gradle
- **Database**: MySQL + JPA
- **Additional**: Lombok, Spring Security, Redis Session

### 코드 품질 목표
- 가독성과 유지보수성 향상
- 의료 데이터 보안 강화
- 팀 개발 효율성 증대
- 일관된 코드 스타일 유지

## Java 코딩 컨벤션

### 1. 기본 포맷팅

#### 들여쓰기
```java
// ✅ 좋은 예: 4 spaces 들여쓰기
public class UserService {
    private final UserRepository userRepository;

    public User createUser(UserDto userDto) {
        if (userDto == null) {
            throw new IllegalArgumentException("UserDto cannot be null");
        }
        return userRepository.save(convertToEntity(userDto));
    }
}

// ❌ 나쁜 예: 탭 또는 2 spaces
public class UserService {
  private final UserRepository userRepository;

  public User createUser(UserDto userDto) {
	return userRepository.save(convertToEntity(userDto));
  }
}
```

#### 라인 길이
```java
// ✅ 좋은 예: 120자 이내
public ResponseEntity<List<TestResultDto>> getTestResults(
        Long userId,
        LocalDateTime startDate,
        LocalDateTime endDate) {
    // 구현
}

// ❌ 나쁜 예: 너무 긴 라인
public ResponseEntity<List<TestResultDto>> getTestResultsByUserIdAndDateRangeBetweenStartDateAndEndDate(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
    // 구현
}
```

#### 중괄호 스타일
```java
// ✅ 좋은 예: K&R 스타일 (같은 라인에 여는 중괄호)
public class HeartDiseaseService {

    public void processTestResult(TestResult result) {
        if (result.isValid()) {
            saveResult(result);
        } else {
            handleInvalidResult(result);
        }
    }
}

// ❌ 나쁜 예: Allman 스타일
public class HeartDiseaseService
{
    public void processTestResult(TestResult result)
    {
        if (result.isValid())
        {
            saveResult(result);
        }
    }
}
```

### 2. Import 문 정리

```java
// ✅ 좋은 예: 그룹별 정렬
package com.example.heart_disease.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.heart_disease.dto.TestResultDto;
import com.example.heart_disease.entity.TestResult;
import com.example.heart_disease.repository.TestResultRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

// ❌ 나쁜 예: 정렬되지 않은 import
import com.example.heart_disease.entity.TestResult;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
```

### 3. 주석 작성 규칙

#### JavaDoc
```java
// ✅ 좋은 예: 완성된 JavaDoc
/**
 * 심장질환 검사 결과를 처리하는 서비스 클래스
 *
 * @author Backend Team
 * @since 1.0.0
 */
@Service
public class HeartDiseaseTestService {

    /**
     * 사용자의 검사 결과를 저장합니다.
     *
     * @param userId 사용자 ID (null 불가)
     * @param testData 검사 데이터 (validation 필수)
     * @return 저장된 검사 결과 ID
     * @throws IllegalArgumentException 입력값이 유효하지 않은 경우
     * @throws DataAccessException 데이터베이스 저장 실패시
     */
    public Long saveTestResult(Long userId, TestData testData) {
        // 구현
    }
}

// ❌ 나쁜 예: 불완전한 주석
// 검사 결과 저장
public Long saveTestResult(Long userId, TestData testData) {
    // 구현
}
```

#### 인라인 주석
```java
// ✅ 좋은 예: 의미있는 주석
public void processHeartRateData(List<Integer> heartRates) {
    // 의료 기준: 정상 심박수 범위는 60-100 BPM
    List<Integer> normalRates = heartRates.stream()
            .filter(rate -> rate >= 60 && rate <= 100)
            .collect(toList());

    // 비정상 심박수 패턴 분석을 위한 별도 처리
    if (normalRates.size() < heartRates.size() * 0.8) {
        triggerAbnormalPatternAlert();
    }
}

// ❌ 나쁜 예: 의미없는 주석
public void processHeartRateData(List<Integer> heartRates) {
    // 심박수 필터링
    List<Integer> normalRates = heartRates.stream()
            .filter(rate -> rate >= 60 && rate <= 100) // 60과 100 사이 필터
            .collect(toList()); // 리스트로 변환
}
```

## Spring Boot 컨벤션

### 1. 컴포넌트 계층 구조

```java
// ✅ Controller Layer
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Validated
@Slf4j
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponseDto> createUser(
            @Valid @RequestBody UserCreateDto userCreateDto) {

        UserResponseDto response = userService.createUser(userCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

// ✅ Service Layer
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponseDto createUser(UserCreateDto userCreateDto) {
        // 비즈니스 로직 구현
        User user = User.builder()
                .email(userCreateDto.getEmail())
                .password(passwordEncoder.encode(userCreateDto.getPassword()))
                .build();

        User savedUser = userRepository.save(user);
        return UserResponseDto.from(savedUser);
    }
}

// ✅ Repository Layer
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.createdAt BETWEEN :startDate AND :endDate")
    List<User> findByCreatedAtBetween(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}
```

### 2. Entity 작성 규칙

```java
// ✅ 좋은 예: 완성된 Entity
@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
@ToString(exclude = {"password", "testResults"})
@EqualsAndHashCode(of = "id")
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private UserStatus status;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestResult> testResults = new ArrayList<>();

    // 비즈니스 메서드
    public void updatePassword(String newPassword) {
        if (StringUtils.hasText(newPassword)) {
            this.password = newPassword;
        }
    }

    public boolean isActive() {
        return UserStatus.ACTIVE.equals(this.status);
    }
}

// ✅ BaseTimeEntity
@MappedSuperclass
@Getter
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseTimeEntity {

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
```

### 3. DTO 패턴

```java
// ✅ Request DTO
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserCreateDto {

    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 8, max = 20, message = "비밀번호는 8-20자 사이여야 합니다")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
            message = "비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다")
    private String password;

    @Pattern(regexp = "^01[0-9]-[0-9]{4}-[0-9]{4}$",
            message = "올바른 휴대폰 번호 형식이 아닙니다 (예: 010-1234-5678)")
    private String phoneNumber;
}

// ✅ Response DTO
@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponseDto {

    private Long id;
    private String email;
    private String phoneNumber;
    private UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static UserResponseDto from(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
```

## 패키지 구조

```
src/main/java/com/example/heart_disease/
├── HeartDiseaseApplication.java              # 메인 애플리케이션 클래스
├── config/                                   # 설정 클래스
│   ├── SecurityConfig.java
│   ├── JpaConfig.java
│   ├── RedisConfig.java
│   └── WebConfig.java
├── controller/                               # REST API 컨트롤러
│   ├── UserController.java
│   ├── TestResultController.java
│   ├── PaymentController.java
│   └── AdminController.java
├── service/                                  # 비즈니스 로직
│   ├── UserService.java
│   ├── TestResultService.java
│   ├── PaymentService.java
│   └── NotificationService.java
├── repository/                               # 데이터 접근 계층
│   ├── UserRepository.java
│   ├── TestResultRepository.java
│   └── PaymentRepository.java
├── entity/                                   # JPA 엔티티
│   ├── User.java
│   ├── TestResult.java
│   ├── Payment.java
│   └── common/
│       └── BaseTimeEntity.java
├── dto/                                      # 데이터 전송 객체
│   ├── request/
│   │   ├── UserCreateDto.java
│   │   └── TestResultCreateDto.java
│   └── response/
│       ├── UserResponseDto.java
│       └── TestResultResponseDto.java
├── exception/                                # 예외 처리
│   ├── GlobalExceptionHandler.java
│   ├── BusinessException.java
│   └── ErrorCode.java
├── security/                                 # 보안 관련
│   ├── JwtTokenProvider.java
│   ├── CustomUserDetailsService.java
│   └── SecurityUtils.java
├── util/                                     # 유틸리티 클래스
│   ├── DateUtils.java
│   ├── EncryptionUtils.java
│   └── ValidationUtils.java
└── constant/                                 # 상수 정의
    ├── ApiConstants.java
    ├── SecurityConstants.java
    └── MessageConstants.java
```

## 네이밍 컨벤션

### 1. 클래스 네이밍

```java
// ✅ Controller: ~Controller 접미사
@RestController
public class UserController { }

@RestController
public class HeartDiseaseTestController { }

// ✅ Service: ~Service 접미사
@Service
public class UserService { }

@Service
public class TestResultService { }

// ✅ Repository: ~Repository 접미사
@Repository
public interface UserRepository extends JpaRepository<User, Long> { }

// ✅ Entity: 명사, PascalCase
@Entity
public class User { }

@Entity
public class TestResult { }

// ✅ DTO: 목적에 따른 접미사
public class UserCreateDto { }        // 생성용
public class UserUpdateDto { }        // 수정용
public class UserResponseDto { }      // 응답용
public class UserSearchDto { }        // 검색용

// ✅ Exception: ~Exception 접미사
public class UserNotFoundException extends BusinessException { }
public class InvalidTestDataException extends BusinessException { }

// ✅ Config: ~Config 접미사
@Configuration
public class SecurityConfig { }

@Configuration
public class DatabaseConfig { }
```

### 2. 메서드 네이밍

```java
// ✅ 좋은 예: 동사로 시작하는 명확한 메서드명
public class UserService {

    // 조회 메서드
    public User findUserById(Long id) { }
    public List<User> findUsersByStatus(UserStatus status) { }
    public Optional<User> findUserByEmail(String email) { }

    // 생성 메서드
    public User createUser(UserCreateDto dto) { }
    public TestResult createTestResult(Long userId, TestData data) { }

    // 수정 메서드
    public User updateUserProfile(Long id, UserUpdateDto dto) { }
    public void updateUserPassword(Long id, String newPassword) { }

    // 삭제 메서드
    public void deleteUser(Long id) { }
    public void softDeleteUser(Long id) { }

    // 검증 메서드
    public boolean isValidUser(User user) { }
    public boolean hasPermission(Long userId, String permission) { }

    // 변환 메서드
    public UserResponseDto convertToDto(User user) { }
    public User convertToEntity(UserCreateDto dto) { }
}
```

### 3. 변수 네이밍

```java
// ✅ 좋은 예: 의미있는 변수명
public class TestResultService {

    // 상수: UPPER_SNAKE_CASE
    private static final int MAX_RETRY_COUNT = 3;
    private static final String DEFAULT_TEST_TYPE = "BASIC_HEART_CHECK";

    // 필드: camelCase
    private final TestResultRepository testResultRepository;
    private final NotificationService notificationService;

    public void processTestResult(TestData testData) {
        // 지역 변수: camelCase, 의미있는 이름
        LocalDateTime testStartTime = testData.getStartTime();
        List<Integer> heartRateReadings = testData.getHeartRates();
        boolean isAbnormalPattern = false;

        // 반복문 변수: 의미있는 이름 선호
        for (Integer currentHeartRate : heartRateReadings) {
            if (isAbnormalHeartRate(currentHeartRate)) {
                isAbnormalPattern = true;
                break;
            }
        }
    }
}

// ❌ 나쁜 예: 의미없는 변수명
public void process(TestData td) {
    LocalDateTime dt = td.getStartTime();
    List<Integer> hrs = td.getHeartRates();
    boolean flag = false;

    for (Integer hr : hrs) {
        if (check(hr)) {
            flag = true;
            break;
        }
    }
}
```

## 애노테이션 사용 규칙

### 1. Spring 애노테이션 순서

```java
// ✅ 권장 애노테이션 순서
@RestController              // Spring stereotype
@RequestMapping("/api/v1")   // Spring mapping
@RequiredArgsConstructor     // Lombok
@Validated                   // Validation
@Slf4j                       // Logging
@Api(tags = "User API")      // Swagger (있는 경우)
public class UserController {

    @GetMapping("/{id}")                           // HTTP method mapping
    @ApiOperation(value = "사용자 조회")            // Swagger (있는 경우)
    public ResponseEntity<UserResponseDto> getUser(
            @PathVariable @Min(1) Long id) {        // Parameter validation
        // 구현
    }
}
```

### 2. Validation 애노테이션

```java
// ✅ 의료 데이터를 고려한 검증 규칙
public class PatientDataDto {

    @NotNull(message = "환자 ID는 필수입니다")
    @Min(value = 1, message = "환자 ID는 1 이상이어야 합니다")
    private Long patientId;

    @NotBlank(message = "환자명은 필수입니다")
    @Size(min = 2, max = 50, message = "환자명은 2-50자 사이여야 합니다")
    @Pattern(regexp = "^[가-힣a-zA-Z\\s]+$", message = "환자명은 한글, 영문, 공백만 허용됩니다")
    private String patientName;

    @NotNull(message = "생년월일은 필수입니다")
    @Past(message = "생년월일은 과거 날짜여야 합니다")
    private LocalDate birthDate;

    @NotNull(message = "검사 일시는 필수입니다")
    @PastOrPresent(message = "검사 일시는 과거 또는 현재여야 합니다")
    private LocalDateTime testDateTime;

    @DecimalMin(value = "30.0", message = "심박수는 30 이상이어야 합니다")
    @DecimalMax(value = "250.0", message = "심박수는 250 이하여야 합니다")
    private BigDecimal heartRate;

    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String contactEmail;
}
```

### 3. JPA 애노테이션

```java
// ✅ JPA 애노테이션 최적화
@Entity
@Table(name = "test_results", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_test_date", columnList = "test_date"),
    @Index(name = "idx_test_type", columnList = "test_type")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class TestResult extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "test_result_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_test_result_user"))
    private User user;

    @Column(name = "test_type", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private TestType testType;

    @Column(name = "test_date", nullable = false)
    private LocalDateTime testDate;

    @Column(name = "heart_rate_data", columnDefinition = "JSON")
    @Convert(converter = HeartRateDataConverter.class)
    private List<HeartRateReading> heartRateData;

    @Lob
    @Column(name = "test_image")
    private byte[] testImage;

    @Column(name = "diagnosis_result", length = 1000)
    private String diagnosisResult;

    @Column(name = "is_abnormal", nullable = false)
    private Boolean isAbnormal = false;
}
```

## 예외 처리

### 1. 커스텀 예외 계층

```java
// ✅ 기본 비즈니스 예외
public abstract class BusinessException extends RuntimeException {

    private final ErrorCode errorCode;

    protected BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    protected BusinessException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }
}

// ✅ 도메인별 예외
public class UserNotFoundException extends BusinessException {
    public UserNotFoundException(Long userId) {
        super(ErrorCode.USER_NOT_FOUND, "사용자를 찾을 수 없습니다. ID: " + userId);
    }
}

public class InvalidTestDataException extends BusinessException {
    public InvalidTestDataException(String message) {
        super(ErrorCode.INVALID_TEST_DATA, message);
    }
}

public class PaymentProcessingException extends BusinessException {
    public PaymentProcessingException(String message) {
        super(ErrorCode.PAYMENT_PROCESSING_FAILED, message);
    }
}
```

### 2. 에러 코드 정의

```java
// ✅ 에러 코드 열거형
@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // 일반적인 에러 (1000번대)
    INVALID_INPUT_VALUE(1001, "잘못된 입력값입니다"),
    METHOD_NOT_ALLOWED(1002, "허용되지 않은 HTTP 메서드입니다"),
    INTERNAL_SERVER_ERROR(1003, "서버 내부 오류가 발생했습니다"),

    // 사용자 관련 에러 (2000번대)
    USER_NOT_FOUND(2001, "사용자를 찾을 수 없습니다"),
    USER_ALREADY_EXISTS(2002, "이미 존재하는 사용자입니다"),
    INVALID_PASSWORD(2003, "비밀번호가 올바르지 않습니다"),
    USER_ACCOUNT_LOCKED(2004, "계정이 잠겨있습니다"),

    // 인증/인가 관련 에러 (3000번대)
    UNAUTHORIZED(3001, "인증이 필요합니다"),
    ACCESS_DENIED(3002, "접근 권한이 없습니다"),
    INVALID_TOKEN(3003, "유효하지 않은 토큰입니다"),
    TOKEN_EXPIRED(3004, "토큰이 만료되었습니다"),

    // 검사 데이터 관련 에러 (4000번대)
    INVALID_TEST_DATA(4001, "유효하지 않은 검사 데이터입니다"),
    TEST_RESULT_NOT_FOUND(4002, "검사 결과를 찾을 수 없습니다"),
    TEST_DATA_CORRUPTED(4003, "검사 데이터가 손상되었습니다"),

    // 결제 관련 에러 (5000번대)
    PAYMENT_PROCESSING_FAILED(5001, "결제 처리에 실패했습니다"),
    INVALID_PAYMENT_METHOD(5002, "유효하지 않은 결제 방법입니다"),
    INSUFFICIENT_BALANCE(5003, "잔액이 부족합니다");

    private final int code;
    private final String message;
}
```

### 3. 글로벌 예외 처리

```java
// ✅ 글로벌 예외 핸들러
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e) {
        log.warn("Business exception occurred: {}", e.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .code(e.getErrorCode().getCode())
                .message(e.getErrorCode().getMessage())
                .detail(e.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException e) {
        log.warn("Validation exception occurred: {}", e.getMessage());

        List<String> errors = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(toList());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .code(ErrorCode.INVALID_INPUT_VALUE.getCode())
                .message(ErrorCode.INVALID_INPUT_VALUE.getMessage())
                .detail(String.join(", ", errors))
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ErrorResponse> handleDataAccessException(DataAccessException e) {
        log.error("Database access exception occurred", e);

        ErrorResponse errorResponse = ErrorResponse.builder()
                .code(ErrorCode.INTERNAL_SERVER_ERROR.getCode())
                .message("데이터베이스 처리 중 오류가 발생했습니다")
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}

// ✅ 에러 응답 DTO
@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

    private int code;
    private String message;
    private String detail;
    private LocalDateTime timestamp;
    private String path;
}
```

## 로깅

### 1. 로깅 레벨 및 사용법

```java
// ✅ 로깅 컨벤션
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    public User createUser(UserCreateDto userCreateDto) {
        // INFO: 중요한 비즈니스 플로우
        log.info("Creating new user with email: {}", userCreateDto.getEmail());

        try {
            // DEBUG: 상세한 처리 과정 (개발시에만)
            log.debug("Validating user input data: {}", userCreateDto);

            User user = User.builder()
                    .email(userCreateDto.getEmail())
                    .password(passwordEncoder.encode(userCreateDto.getPassword()))
                    .build();

            User savedUser = userRepository.save(user);

            // INFO: 성공적인 결과
            log.info("Successfully created user with ID: {}", savedUser.getId());

            return savedUser;

        } catch (DataIntegrityViolationException e) {
            // WARN: 예상 가능한 오류
            log.warn("Failed to create user due to duplicate email: {}",
                    userCreateDto.getEmail());
            throw new UserAlreadyExistsException(userCreateDto.getEmail());

        } catch (Exception e) {
            // ERROR: 예상치 못한 오류
            log.error("Unexpected error while creating user: {}",
                    userCreateDto.getEmail(), e);
            throw new InternalServerException("사용자 생성 중 오류가 발생했습니다");
        }
    }
}
```

### 2. 의료 데이터 로깅 주의사항

```java
// ✅ 개인정보 보호를 고려한 로깅
@Service
@Slf4j
public class TestResultService {

    public void processTestResult(Long userId, TestData testData) {
        // ✅ 좋은 예: 개인정보 마스킹
        log.info("Processing test result for user: {}", maskUserId(userId));
        log.debug("Test type: {}, Test date: {}", testData.getType(), testData.getDate());

        // ❌ 나쁜 예: 민감한 정보 로깅 금지
        // log.info("Processing test for patient: {} with SSN: {}",
        //          patientName, socialSecurityNumber);
        // log.debug("Heart rate data: {}", sensitiveHeartRateData);
    }

    private String maskUserId(Long userId) {
        if (userId == null) return "null";
        String userIdStr = userId.toString();
        if (userIdStr.length() <= 2) return "***";
        return userIdStr.substring(0, 2) + "***";
    }
}
```

### 3. 로깅 설정 (application.yml)

```yaml
# ✅ 로깅 설정 예시
logging:
  level:
    com.example.heart_disease: DEBUG
    org.springframework.security: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
  file:
    name: logs/heart-disease-app.log
    max-size: 10MB
    max-history: 30
```

## 테스트 코드

### 1. 단위 테스트

```java
// ✅ Service 단위 테스트
@ExtendWith(MockitoExtension.class)
@DisplayName("UserService 테스트")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    @DisplayName("사용자 생성 성공")
    void createUser_Success() {
        // Given
        UserCreateDto userCreateDto = UserCreateDto.builder()
                .email("test@example.com")
                .password("TestPassword123!")
                .build();

        User savedUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .password("encodedPassword")
                .build();

        when(passwordEncoder.encode("TestPassword123!")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // When
        UserResponseDto result = userService.createUser(userCreateDto);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getEmail()).isEqualTo("test@example.com");

        verify(passwordEncoder).encode("TestPassword123!");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("중복 이메일로 사용자 생성 실패")
    void createUser_DuplicateEmail_ThrowsException() {
        // Given
        UserCreateDto userCreateDto = UserCreateDto.builder()
                .email("duplicate@example.com")
                .password("TestPassword123!")
                .build();

        when(userRepository.save(any(User.class)))
                .thenThrow(new DataIntegrityViolationException("Duplicate email"));

        // When & Then
        assertThatThrownBy(() -> userService.createUser(userCreateDto))
                .isInstanceOf(UserAlreadyExistsException.class)
                .hasMessageContaining("duplicate@example.com");
    }
}
```

### 2. 통합 테스트

```java
// ✅ Controller 통합 테스트
@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource(locations = "classpath:application-test.properties")
@DisplayName("UserController 통합 테스트")
class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("사용자 생성 API 성공")
    void createUser_Success() throws Exception {
        // Given
        UserCreateDto userCreateDto = UserCreateDto.builder()
                .email("test@example.com")
                .password("TestPassword123!")
                .phoneNumber("010-1234-5678")
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userCreateDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.phoneNumber").value("010-1234-5678"))
                .andExpect(jsonPath("$.id").exists())
                .andDo(print());

        // Verify
        List<User> users = userRepository.findAll();
        assertThat(users).hasSize(1);
        assertThat(users.get(0).getEmail()).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("잘못된 입력으로 사용자 생성 실패")
    void createUser_InvalidInput_BadRequest() throws Exception {
        // Given
        UserCreateDto invalidDto = UserCreateDto.builder()
                .email("invalid-email")  // 잘못된 이메일 형식
                .password("weak")        // 약한 비밀번호
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpected(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(1001))
                .andExpect(jsonPath("$.message").exists())
                .andDo(print());
    }
}
```

### 3. 데이터베이스 테스트

```java
// ✅ Repository 테스트
@DataJpaTest
@DisplayName("UserRepository 테스트")
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("이메일로 사용자 조회")
    void findByEmail_Success() {
        // Given
        User user = User.builder()
                .email("test@example.com")
                .password("encodedPassword")
                .status(UserStatus.ACTIVE)
                .build();

        entityManager.persistAndFlush(user);

        // When
        Optional<User> foundUser = userRepository.findByEmail("test@example.com");

        // Then
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getEmail()).isEqualTo("test@example.com");
        assertThat(foundUser.get().getStatus()).isEqualTo(UserStatus.ACTIVE);
    }

    @Test
    @DisplayName("존재하지 않는 이메일 조회")
    void findByEmail_NotFound() {
        // When
        Optional<User> foundUser = userRepository.findByEmail("nonexistent@example.com");

        // Then
        assertThat(foundUser).isEmpty();
    }
}
```

## 보안 코딩

### 1. 입력값 검증

```java
// ✅ 의료 데이터 입력 검증
@Service
@RequiredArgsConstructor
@Validated
public class TestResultService {

    public TestResult saveTestResult(
            @Valid @NotNull TestResultCreateDto testResultDto) {

        // 추가 비즈니스 검증
        validateTestData(testResultDto);
        validatePatientConsent(testResultDto.getPatientId());

        // 민감한 데이터 암호화
        String encryptedDiagnosis = encryptSensitiveData(testResultDto.getDiagnosis());

        TestResult testResult = TestResult.builder()
                .patientId(testResultDto.getPatientId())
                .testType(testResultDto.getTestType())
                .encryptedDiagnosis(encryptedDiagnosis)
                .build();

        return testResultRepository.save(testResult);
    }

    private void validateTestData(TestResultCreateDto dto) {
        // 의료 데이터 특화 검증
        if (dto.getHeartRate() != null) {
            if (dto.getHeartRate() < 30 || dto.getHeartRate() > 250) {
                throw new InvalidTestDataException("심박수가 정상 범위를 벗어났습니다");
            }
        }

        if (dto.getBloodPressure() != null) {
            String[] bpValues = dto.getBloodPressure().split("/");
            if (bpValues.length != 2) {
                throw new InvalidTestDataException("혈압 형식이 올바르지 않습니다");
            }
        }
    }
}
```

### 2. 데이터 암호화

```java
// ✅ 민감한 데이터 암호화 유틸리티
@Component
@RequiredArgsConstructor
public class EncryptionUtils {

    @Value("${app.encryption.secret-key}")
    private String secretKey;

    public String encrypt(String plainText) {
        try {
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            SecretKeySpec keySpec = new SecretKeySpec(
                    secretKey.getBytes(StandardCharsets.UTF_8), "AES");
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);

            byte[] encryptedBytes = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encryptedBytes);

        } catch (Exception e) {
            log.error("Encryption failed", e);
            throw new SecurityException("데이터 암호화에 실패했습니다");
        }
    }

    public String decrypt(String encryptedText) {
        try {
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            SecretKeySpec keySpec = new SecretKeySpec(
                    secretKey.getBytes(StandardCharsets.UTF_8), "AES");
            cipher.init(Cipher.DECRYPT_MODE, keySpec);

            byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedText));
            return new String(decryptedBytes, StandardCharsets.UTF_8);

        } catch (Exception e) {
            log.error("Decryption failed", e);
            throw new SecurityException("데이터 복호화에 실패했습니다");
        }
    }
}
```

### 3. SQL 인젝션 방지

```java
// ✅ 안전한 쿼리 작성
@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {

    // ✅ 좋은 예: 파라미터화된 쿼리
    @Query("SELECT tr FROM TestResult tr WHERE tr.user.id = :userId " +
           "AND tr.testDate BETWEEN :startDate AND :endDate")
    List<TestResult> findByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // ✅ 좋은 예: 네이티브 쿼리도 파라미터 사용
    @Query(value = "SELECT * FROM test_results tr " +
                   "WHERE tr.user_id = :userId " +
                   "AND tr.test_type = :testType", nativeQuery = true)
    List<TestResult> findByUserIdAndTestType(
            @Param("userId") Long userId,
            @Param("testType") String testType);
}

// ❌ 나쁜 예: 동적 쿼리 생성 (사용 금지)
// public List<TestResult> findByDynamicQuery(String userInput) {
//     String sql = "SELECT * FROM test_results WHERE condition = '" + userInput + "'";
//     return entityManager.createNativeQuery(sql).getResultList();
// }
```

### 4. 접근 권한 제어

```java
// ✅ 메서드 레벨 보안
@Service
@RequiredArgsConstructor
public class TestResultService {

    @PreAuthorize("hasRole('USER') and #userId == authentication.principal.userId")
    public List<TestResultResponseDto> getMyTestResults(Long userId) {
        return testResultRepository.findByUserId(userId)
                .stream()
                .map(TestResultResponseDto::from)
                .collect(toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<TestResultResponseDto> getAllTestResults() {
        return testResultRepository.findAll()
                .stream()
                .map(TestResultResponseDto::from)
                .collect(toList());
    }

    @PreAuthorize("hasRole('DOCTOR') or (hasRole('USER') and #userId == authentication.principal.userId)")
    public TestResultResponseDto getTestResult(Long testResultId, Long userId) {
        TestResult testResult = testResultRepository.findById(testResultId)
                .orElseThrow(() -> new TestResultNotFoundException(testResultId));

        // 의사가 아닌 경우 본인 데이터만 조회 가능하도록 추가 검증
        if (!hasRole("DOCTOR") && !testResult.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("본인의 검사 결과만 조회할 수 있습니다");
        }

        return TestResultResponseDto.from(testResult);
    }
}
```

## 마무리

이 컨벤션은 심장질환 검사 시스템의 특성을 고려하여 작성되었습니다:

- **의료 데이터 보안**: 개인정보 보호 및 암호화
- **데이터 정확성**: 엄격한 입력값 검증
- **감사 추적**: 상세한 로깅 및 이력 관리
- **성능 최적화**: 효율적인 쿼리 및 인덱싱
- **유지보수성**: 명확한 코드 구조 및 문서화

모든 개발자는 이 컨벤션을 준수하여 일관되고 안전한 코드를 작성해야 합니다.