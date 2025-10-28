# Phase 1 Backend Design

## 0. 범위 정리
- 검사 결과 분류 및 위험도 계산은 프론트엔드에서 Python 기반 SDK로 수행하며, 백엔드는 결과 데이터를 저장·조회하는 역할에 집중한다.
- 백엔드는 사용자 관리, 건강 데이터 제출, 구독/결제 관리, 환경설정 동기화, 음성 입력 세션 기록을 제공한다.
- API 버전은 `v1`으로 시작하며, 모바일 앱과 관리자 웹 모두 동일한 REST 엔드포인트를 사용한다.

## 1. 시스템 아키텍처 개요
- **레이어 구조:** Controller → Service → Domain(Model) → Repository(JPA). DTO는 `interfaces` 패키지에서 정의한다.
- **모듈 구성:** 단일 Spring Boot 애플리케이션으로 시작하되, 향후 `admin` 모듈 분리를 고려해 패키지 네임스페이스를 `com.flowgence.heartrisk` 하위로 구획화한다.
- **주요 의존성:** Spring Boot 3.2, Spring Web, Spring Security, Spring Data JPA, Validation, Flyway, MySQL Connector, Lombok(Optional), MapStruct(Optional), Testcontainers (추후).
- **환경:** `application.yml` 기본값 + `application-local.yml`, `application-prod.yml` 등 프로필 분리. 비밀정보는 환경변수/Secret Manager로 주입.
- **CI/CD:** Gradle 빌드 후 Flyway 마이그레이션 → 통합 테스트 → Docker 이미지 패키징을 목표로 한다.

## 2. 데이터베이스 스키마 설계 (요약)
| 테이블 | 목적 | 주요 컬럼 |
| --- | --- | --- |
| `users` | 사용자 계정 | `id`, `email`(unique), `password_hash`, `phone`, `status`, `created_at` |
| `user_profiles` | 기본 프로필/민감 정보 | `user_id`, `sex`, `birth_year`, `height_cm`, `weight_kg`, `last_updated_at` |
| `screenings` | 검사 결과 기록 | `id`, `user_id`, `status`, `submitted_at`, `result_label`, `risk_score`, `recommendation`, `sdk_version` |
| `screening_metrics` | 입력 변수 스냅샷 | `screening_id`, `metric_key`, `metric_value`, `unit` |
| `subscriptions` | 구독 상태 | `user_id`, `plan_type`, `status`, `renewal_date`, `platform` |
| `payment_transactions` | 결제 내역 | `id`, `user_id`, `subscription_id`, `provider_tx_id`, `amount`, `currency`, `status`, `purchased_at` |
| `user_settings` | 환경설정 | `user_id`, `locale`, `input_mode`, `timeout_sec`, `notifications_enabled` |
| `audio_sessions` | 음성 입력 세션 추적 | `id`, `user_id`, `screening_id`, `state`, `started_at`, `ended_at`, `duration_sec`, `error_code` |

- 기본키는 BIGINT AUTO_INCREMENT, FK는 ON DELETE CASCADE. 모든 테이블에 `created_at`, `updated_at`(TIMESTAMP) 추가.
- 인덱스: `users.email`, `screenings.user_id`, `payment_transactions.provider_tx_id` 등.
- 마이그레이션 도구는 Flyway 사용, `src/main/resources/db/migration`에 버전 관리.

## 3. 인증/보안 설계
- Spring Security + JWT. Access Token 만료 15분, Refresh Token 30일.
- 로그인 성공 시 Refresh Token은 HttpOnly Cookie 또는 Encrypted Storage에 저장.
- 비밀번호 해시는 BCrypt. 휴대폰 인증은 외부 SMS 서비스(Placeholder)와 연동하도록 인터페이스 정의.
- 엔드포인트 보안: `/api/v1/auth/**` 익명 허용, 나머지는 `ROLE_USER`; 관리자 API `/api/v1/admin/**`는 `ROLE_ADMIN`.
- 감사 로깅: 인증 실패, 비밀번호 재설정, 구독 변경 등 주요 이벤트를 `audit_log` 테이블(추후)로 확장.

## 4. 주요 API 사양 (요약)
### 인증
- `POST /api/v1/auth/signup` : 이메일/비밀번호 회원가입.
- `POST /api/v1/auth/login` : 로그인 후 Access/Refresh Token 발급.
- `POST /api/v1/auth/token` : Refresh Token으로 Access Token 재발급.
- `POST /api/v1/auth/password/reset` : 비밀번호 재설정 토큰 발급.

### 건강 데이터 입력 & 검사
- `POST /api/v1/intake/forms` : 건강 입력 임시 저장(draft).
- `PUT /api/v1/intake/forms/{id}` : 임시 저장 업데이트.
- `POST /api/v1/screenings` : 프론트에서 SDK 결과와 입력 데이터를 전송, 백엔드 저장.
- `GET /api/v1/screenings` : 사용자 검사 이력 조회 (페이지네이션).
- `GET /api/v1/screenings/{id}` : 세부 결과 + 입력 변수 반환.

### 환경설정
- `GET /api/v1/settings/me`
- `PUT /api/v1/settings/me`

### 구독/결제
- `GET /api/v1/subscriptions/me`
- `POST /api/v1/subscriptions/purchase` : 클라이언트 결제 영수증 제출, 서버 검증.
- `POST /api/v1/subscriptions/restore` : 영수증 복원.
- `GET /api/v1/payments/history`

### 음성 입력 세션
- `POST /api/v1/audio/sessions` : 세션 시작 저장 (OpenAI 연결 전 초기화).
- `PATCH /api/v1/audio/sessions/{id}` : 상태 업데이트(연결/에러/종료).

### 관리자(후순위)
- `/api/v1/admin/users`, `/api/v1/admin/screenings`, `/api/v1/admin/payments` 등.

## 5. 패키지 구조 제안
```
com.flowgence.heartrisk
├── HeartriskApplication
├── config        // Security, Web, Swagger, Persistence, Flyway
├── domain
│   ├── auth
│   ├── screening
│   ├── subscription
│   ├── settings
│   └── audio
├── interfaces
│   ├── dto       // 요청/응답 DTO
│   └── controller
└── infrastructure
    ├── repository
    ├── security  // JWT, filters
    └── external  // SMS, payment proxy
```
- 단일 모듈에서 시작하되, domain 패키지를 기준으로 bounded context를 유지한다.

## 6. 데이터 흐름
1. 사용자가 앱에서 건강 정보를 입력하면 `intakeForm` 슬라이스에 저장 후 `/intake/forms`로 초안을 전송한다.
2. 검사를 실행하면 프론트의 Python SDK가 결과를 산출하고 `/screenings`에 결과 + 입력 스냅샷을 전송한다.
3. 백엔드는 결과를 영속화하고, 위험도 임계값을 기준으로 알림/추천 메시지를 생성하여 저장한다.
4. 구독 결제 완료 시 `/subscriptions/purchase`로 영수증을 전달하여 서버 검증 후 상태를 갱신한다.

## 7. 구현 로드맵 (Phase 1)
1. Gradle(Spring Boot) 프로젝트 스캐폴딩 및 핵심 의존성 추가.
2. 기본 패키지 구조와 `HeartriskApplication` 부트스트랩 클래스 작성.
3. Flyway 초기 마이그레이션(`V1__baseline.sql`) 작성.
4. 엔티티/리포지토리 초안: `User`, `Screening`, `Subscription`, `PaymentTransaction`, `UserSettings`, `AudioSession`.
5. DTO/Controller 스텁: Auth, Intake, Screening, Settings, Subscription.
6. 서비스 계층 스텁 및 예외 처리 구조 (`BusinessException`, `GlobalExceptionHandler`).
7. 보안 구성: JWT 필터 구조 설계, 임시 NoAuth 프로필 제공.

## 8. 추적해야 할 결정 사항
- Python SDK 결과를 검증하기 위한 백엔드 측 샘플링/로그 정책.
- 결제 영수증 검증 책임 분배(서버 vs 클라이언트).
- 관리자 웹(React 기반) 여부 및 API 권한 모델.
- 이벤트 기반 아키텍처(예: Kafka) 도입 필요성 여부.
