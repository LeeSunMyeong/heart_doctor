# Heart Doctor Backend API 비즈니스 로직 문서

> CBNU 심장질환 검사 시스템 Backend API 종합 정리 (비즈니스 로직 관점)

**작성일**: 2025-01-28
**버전**: 1.0
**기술스택**: Spring Boot 3.5.6, Java 17, MySQL, Redis

---

## 목차

1. [시스템 개요](#1-시스템-개요)
2. [핵심 비즈니스 프로세스](#2-핵심-비즈니스-프로세스)
3. [API 도메인별 분류](#3-api-도메인별-분류)
4. [데이터 모델 관계도](#4-데이터-모델-관계도)
5. [비즈니스 규칙](#5-비즈니스-규칙)
6. [향후 개발 계획](#6-향후-개발-계획)

---

## 1. 시스템 개요

### 1.1 프로젝트 목적
충북대학교 심장질환 조기 진단 및 관리 시스템으로, 사용자의 자가 검진 데이터를 수집하고 AI 모델을 통해 심장질환 위험도를 평가하여 조기 진단을 지원합니다.

### 1.2 주요 기능
- **사용자 관리**: 회원가입, 로그인, 프로필 관리
- **심장 검사**: 증상 입력 및 AI 진단
- **구독 관리**: 일일 사용량 제한 및 요금제 관리
- **결제 시스템**: 인앱 결제 (Google Play / Apple Store)
- **알림**: 검사 알림, 위험도 알림, 구독 알림
- **설정**: 사용자 개인화 설정 관리

### 1.3 아키텍처 구성
```
[React Native App (iOS/Android)]
           ↓ HTTPS/REST API
[Spring Boot Backend + Redis Session]
           ↓ JPA
      [MySQL Database]
```

---

## 2. 핵심 비즈니스 프로세스

### 2.1 사용자 검사 플로우

```
1. 사용자 로그인
2. 일일 사용량 확인 (무료: 1회/일, 유료: 무제한)
3. 증상 입력 (17개 항목)
   - 성별, 나이, 체중, 키, 체온, 호흡수
   - 11개 증상 (0-4 척도)
4. 검사 데이터 저장 (Check 테이블)
5. AI 모델 진단 요청
6. 진단 결과 저장 (Prediction 테이블)
7. 위험도 평가 및 알림 발송
8. 사용량 증가
9. 결과 조회 및 이력 관리
```

### 2.2 구독 및 결제 플로우

```
1. 요금제 조회
2. 결제 요청 (Google Play / App Store)
3. 결제 처리 (PENDING → COMPLETED / FAILED)
4. 구독 활성화 (Subscription 생성)
5. 일일 사용량 제한 해제
6. 만료 시 구독 상태 변경 (ACTIVE → EXPIRED)
```

### 2.3 알림 발송 플로우

```
1. 이벤트 발생
   - 높은 위험도 진단 결과
   - 구독 만료 임박 (7일, 3일, 1일 전)
   - 일일 사용량 도달
2. 알림 생성 (Notification 테이블)
3. 푸시 알림 발송 (설정 활성화 시)
4. 사용자 알림함 저장
5. 읽음 처리
```

---

## 3. API 도메인별 분류

### 3.1 헬스 체크 (Health Check)
**경로**: `/api/health`

#### 비즈니스 목적
시스템 가용성 모니터링 및 서비스 상태 확인

| Endpoint | Method | 설명 | 응답 |
|----------|--------|------|------|
| `/api/health` | GET | 기본 헬스 체크 | 서비스 상태, 버전 정보 |
| `/api/health/ready` | GET | 준비 상태 확인 | DB/Redis 연결 상태 |

**비즈니스 규칙**:
- 로드 밸런서 헬스 체크용
- 인증 불필요
- 응답 시간 200ms 이내 보장

---

### 3.2 심장 검사 (Health Assessment)
**경로**: `/api/checks`

#### 비즈니스 목적
사용자의 자가 심장 건강 검진 데이터 수집 및 관리

#### 3.2.1 검사 생성 및 조회

| Endpoint | Method | 설명 | 비즈니스 로직 |
|----------|--------|------|--------------|
| `/api/checks` | POST | 검사 결과 저장 | 사용량 확인 → 검사 저장 → 위험도 평가 → BMI 계산 |
| `/api/checks/{checkId}` | GET | 검사 조회 | 검사 데이터 + 위험도 + 의료진 검토 권장 여부 |
| `/api/checks/user/{userId}` | GET | 사용자 검사 이력 (페이징) | 최신순 정렬, 페이지네이션 |
| `/api/checks/user/{userId}/recent` | GET | 최근 검사 조회 | 최근 5건 조회 |
| `/api/checks/user/{userId}/today` | GET | 오늘 검사 조회 | 당일 검사 목록 및 횟수 |

**데이터 모델 (Check)**:
```json
{
  "id": 1,
  "user": { "userId": 123 },
  "assessmentTime": "2024-01-28T10:30:00",
  "gender": "M",
  "age": 45,
  "weight": 75.5,
  "height": 175.0,
  "bmi": 24.7,
  "bodyTemperature": 36.5,
  "breathingRate": 18,
  "chestPain": 2,
  "shortnessOfBreath": 1,
  "fatigue": 3,
  "dizziness": 0,
  "nausea": 1,
  "palpitations": 2,
  "swelling": 0,
  "coldSweat": 1,
  "indigestion": 2,
  "anxiety": 2,
  "backPain": 1,
  "symptomCount": 11
}
```

#### 3.2.2 검사 분석 및 통계

| Endpoint | Method | 설명 | 비즈니스 로직 |
|----------|--------|------|--------------|
| `/api/checks/user/{userId}/range` | GET | 기간별 검사 조회 | 시작일~종료일 범위 조회 |
| `/api/checks/user/{userId}/high-risk` | GET | 높은 위험도 검사 | 증상 개수 ≥ 5 또는 심각 증상 포함 |
| `/api/checks/user/{userId}/symptom/{symptomName}` | GET | 특정 증상 검사 | 특정 증상 점수 ≥ 2 인 검사 |
| `/api/checks/user/{userId}/statistics` | GET | 사용자 통계 | 평균 증상 개수, 오늘 검사 횟수, 최근 위험도 |
| `/api/checks/statistics` | GET | 시스템 전체 통계 | 총 검사 수, 오늘/주간 검사 수 |

**비즈니스 규칙**:
- **BMI 자동 계산**: `BMI = weight / (height/100)²`
- **symptomCount**: 11개 증상 중 점수 ≥ 2 인 개수
- **위험도 평가**:
  - HIGH: symptomCount ≥ 5 또는 chestPain ≥ 3
  - MEDIUM: symptomCount 3-4
  - LOW: symptomCount < 3
- **의료진 검토 권장**: chestPain ≥ 3 또는 shortnessOfBreath ≥ 3

---

### 3.3 AI 진단 결과 (Predictions)
**경로**: `/api/predictions`

#### 비즈니스 목적
AI 모델의 심장질환 진단 결과 저장 및 분석

#### 3.3.1 진단 생성 및 조회

| Endpoint | Method | 설명 | 비즈니스 로직 |
|----------|--------|------|--------------|
| `/api/predictions` | POST | AI 진단 결과 저장 | 진단 저장 → 위험도 평가 → 알림 생성 |
| `/api/predictions/check/{checkId}` | GET | 검사별 진단 조회 | 검사 ID로 진단 결과 조회 |
| `/api/predictions/user/{userId}` | GET | 사용자 진단 이력 (페이징) | 최신순 정렬 |
| `/api/predictions/user/{userId}/recent` | GET | 최근 진단 조회 | 최근 5건 |
| `/api/predictions/user/{userId}/today` | GET | 오늘 진단 조회 | 당일 진단 목록 |

**데이터 모델 (Prediction)**:
```json
{
  "id": 1,
  "user": { "userId": 123 },
  "check": { "id": 456 },
  "predictTime": "2024-01-28T10:35:00",
  "normalProb": 45.2,
  "anginaProb": 25.3,
  "myocardialInfarctionProb": 15.1,
  "heartFailureProb": 10.2,
  "atrialFibrillationProb": 2.1,
  "otherProb": 2.1,
  "highestProbabilityDiagnosis": "ANGINA",
  "diagnosisKoreanName": "협심증",
  "highestProbability": 25.3,
  "model": "v2.1",
  "accuracy": 0.92,
  "medicalReviewRecommended": false
}
```

#### 3.3.2 진단 분석 및 트렌드

| Endpoint | Method | 설명 | 비즈니스 로직 |
|----------|--------|------|--------------|
| `/api/predictions/user/{userId}/range` | GET | 기간별 진단 조회 | 시작일~종료일 범위 |
| `/api/predictions/user/{userId}/high-risk` | GET | 높은 위험도 진단 | highestProbability ≥ 60% |
| `/api/predictions/user/{userId}/medical-review` | GET | 의료진 검토 권장 | medicalReviewRecommended = true |
| `/api/predictions/user/{userId}/disease/{diseaseType}` | GET | 특정 질환 고확률 | 특정 질환 확률 ≥ minProbability (기본 60%) |
| `/api/predictions/user/{userId}/normal` | GET | 정상 진단 | normalProb ≥ minNormalProb (기본 70%) |
| `/api/predictions/user/{userId}/statistics` | GET | 질환별 통계 | 질환별 평균 확률 |
| `/api/predictions/user/{userId}/trend` | GET | 건강 트렌드 분석 | 최근 N개월 트렌드 (기본 6개월) |
| `/api/predictions/statistics` | GET | 시스템 진단 통계 | 총 진단 수, 질환별 분포 |

**질환 종류**:
- `NORMAL`: 정상
- `ANGINA`: 협심증
- `MYOCARDIAL_INFARCTION`: 심근경색
- `HEART_FAILURE`: 심부전
- `ATRIAL_FIBRILLATION`: 심방세동
- `OTHER`: 기타 심장질환

**비즈니스 규칙**:
- **highestProbabilityDiagnosis**: 6개 질환 중 가장 높은 확률의 질환
- **medicalReviewRecommended**:
  - 비정상 질환 확률 ≥ 70%
  - 또는 심근경색/심부전 확률 ≥ 50%
- **알림 발송**: medicalReviewRecommended = true 시 긴급 알림

---

### 3.4 일일 사용량 관리 (Daily Usage Quota)
**경로**: `/api/usage`

#### 비즈니스 목적
무료/유료 사용자의 일일 검사 횟수 제한 관리

#### 3.4.1 사용량 조회 및 확인

| Endpoint | Method | 설명 | 비즈니스 로직 |
|----------|--------|------|--------------|
| `/api/usage/user/{userId}/today` | GET | 오늘 사용량 정보 | 현재 사용량, 제한, 남은 횟수, 사용 가능 여부 |
| `/api/usage/user/{userId}/can-use` | GET | 사용 가능 여부 확인 | currentUsage < dailyLimit |
| `/api/usage/user/{userId}/range` | GET | 기간별 사용량 조회 | 시작일~종료일 사용량 통계 |
| `/api/usage/user/{userId}/monthly` | GET | 월간 사용량 통계 | 월 총 사용량, 활성일 수 |

**응답 예시 (오늘 사용량)**:
```json
{
  "success": true,
  "data": {
    "userId": 123,
    "date": "2024-01-28",
    "currentUsage": 1,
    "dailyLimit": 1,
    "remainingUsage": 0,
    "canUse": false,
    "usagePercentage": 100.0
  }
}
```

#### 3.4.2 사용량 증가 및 관리

| Endpoint | Method | 설명 | 비즈니스 로직 |
|----------|--------|------|--------------|
| `/api/usage/user/{userId}/increment` | POST | 사용량 증가 | 사용 가능 확인 → 사용량 +1 → 남은 횟수 반환 |
| `/api/usage/user/{userId}/reset` | DELETE | 사용량 초기화 (관리자) | 특정 날짜 사용량 0으로 초기화 |
| `/api/usage/dashboard` | GET | 사용량 대시보드 (관리자) | 전체 사용자 사용량 통계 (추후 구현) |

**비즈니스 규칙**:
- **무료 사용자**: dailyLimit = 1
- **유료 사용자** (구독 활성화 시):
  - 기본 플랜: dailyLimit = 5
  - 프리미엄 플랜: dailyLimit = 무제한 (999)
- **자정 초기화**: 매일 00:00에 count = 0으로 자동 리셋
- **Redis 캐싱**: 빠른 조회를 위해 오늘 사용량 캐싱
- **403 Forbidden**: canUse = false 시 사용 차단

---

### 3.5 구독 관리 (Subscriptions)
**경로**: `/api/v1/subscriptions`

#### 비즈니스 목적
요금제 기반 구독 관리 및 일일 사용량 제한 해제

#### 3.5.1 요금제 조회

| Endpoint | Method | 설명 | 비즈니스 로직 |
|----------|--------|------|--------------|
| `/api/v1/subscriptions/plans` | GET | 모든 요금제 조회 | 활성 요금제 목록 |
| `/api/v1/subscriptions/plans/{planId}` | GET | 특정 요금제 조회 | 요금제 상세 정보 |

**요금제 예시 (CostModel)**:
```json
[
  {
    "costId": 1,
    "plan": "무료 플랜",
    "price": 0,
    "currency": "KRW",
    "duration": 0,
    "dailyLimit": 1,
    "description": "일일 1회 검사"
  },
  {
    "costId": 2,
    "plan": "기본 플랜",
    "price": 5000,
    "currency": "KRW",
    "duration": 30,
    "dailyLimit": 5,
    "description": "일일 5회 검사, 30일"
  },
  {
    "costId": 3,
    "plan": "프리미엄 플랜",
    "price": 10000,
    "currency": "KRW",
    "duration": 30,
    "dailyLimit": 999,
    "description": "무제한 검사, 30일"
  }
]
```

#### 3.5.2 구독 관리

| Endpoint | Method | 설명 | 비즈니스 로직 |
|----------|--------|------|--------------|
| `/api/v1/subscriptions` | POST | 새 구독 신청 | 결제 완료 후 구독 생성 |
| `/api/v1/subscriptions/{subscriptionId}` | GET | 구독 조회 | 구독 상세 정보 |
| `/api/v1/subscriptions/user/{userId}` | GET | 사용자 구독 목록 | 전체 구독 이력 |
| `/api/v1/subscriptions/user/{userId}/active` | GET | 활성 구독 조회 | 현재 유효한 구독 |
| `/api/v1/subscriptions/{subscriptionId}/cancel` | PUT | 구독 취소 | ACTIVE → CANCELED |

**구독 상태 (SubscriptionStatus)**:
- `ACTIVE`: 활성 (현재 사용 중)
- `EXPIRED`: 만료
- `CANCELED`: 취소됨
- `PENDING`: 대기 중

**비즈니스 규칙**:
- **startDate**: 결제 완료 시점
- **endDate**: startDate + duration (일)
- **자동 만료**: endDate 도달 시 ACTIVE → EXPIRED
- **중복 방지**: 활성 구독 있을 시 신규 구독 차단 (409 Conflict)
- **사용량 제한 해제**: ACTIVE 상태 시 dailyLimit 적용
- **remainingDays**: endDate - 현재 날짜

---

### 3.6 결제 관리 (Payments)
**경로**: `/api/v1/payments`

#### 비즈니스 목적
인앱 결제 (Google Play Store / Apple App Store) 처리 및 이력 관리

#### 3.6.1 결제 생성 및 처리

| Endpoint | Method | 설명 | 비즈니스 로직 |
|----------|--------|------|--------------|
| `/api/v1/payments` | POST | 결제 생성 | 결제 정보 생성 (PENDING 상태) |
| `/api/v1/payments/{paymentId}/complete` | PUT | 결제 완료 처리 | PENDING → COMPLETED + 구독 활성화 |
| `/api/v1/payments/{paymentId}/fail` | PUT | 결제 실패 처리 | PENDING → FAILED |
| `/api/v1/payments/{paymentId}/cancel` | PUT | 결제 취소 | PENDING → CANCELED |
| `/api/v1/payments/{paymentId}/refund` | POST | 환불 처리 | COMPLETED → REFUNDED + 구독 취소 |

**결제 상태 흐름**:
```
PENDING (결제 대기)
   ↓ (완료)      ↓ (실패/취소)
COMPLETED      FAILED / CANCELED
   ↓ (환불)
REFUNDED
```

**데이터 모델 (Payment)**:
```json
{
  "id": 1,
  "user": { "userId": 123 },
  "costModel": { "costId": 2 },
  "subscriptionId": 456,
  "amount": 5000,
  "currency": "KRW",
  "storeInfo": "G",  // G: Google Play, A: Apple Store
  "transactionId": "GPA.1234-5678-9012-34567",
  "status": "COMPLETED",
  "createTime": "2024-01-28T10:00:00",
  "paymentTime": "2024-01-28T10:01:00"
}
```

#### 3.6.2 결제 조회 및 통계

| Endpoint | Method | 설명 | 비즈니스 로직 |
|----------|--------|------|--------------|
| `/api/v1/payments/{paymentId}` | GET | 결제 조회 | 결제 상세 정보 |
| `/api/v1/payments/transaction/{transactionId}` | GET | 트랜잭션 ID로 조회 | 앱 스토어 거래 ID로 조회 |
| `/api/v1/payments/history/{userId}` | GET | 사용자 결제 이력 (페이징) | 최신순 정렬 |
| `/api/v1/payments/successful/{userId}` | GET | 성공한 결제 목록 | status = COMPLETED |
| `/api/v1/payments/latest/{userId}` | GET | 최근 결제 조회 | 가장 최근 결제 |
| `/api/v1/payments/stats/revenue` | GET | 매출 통계 (관리자) | 기간별 매출 합계 |
| `/api/v1/payments/stats/by-plan` | GET | 요금제별 통계 (관리자) | 플랜별 판매 수 및 매출 |

**비즈니스 규칙**:
- **transactionId**: 필수 (앱 스토어 거래 ID)
- **중복 방지**: transactionId 중복 검사
- **결제 완료 시**: 자동으로 구독 생성 및 활성화
- **환불 시**: 해당 구독 자동 취소 및 만료 처리
- **통계 기간**: startDate ~ endDate (기본: 최근 30일)

---

### 3.7 알림 관리 (Notifications)
**경로**: `/api/v1/notifications`

#### 비즈니스 목적
사용자 알림 발송 및 관리 (푸시 알림, 인앱 알림함)

#### 3.7.1 알림 조회

| Endpoint | Method | 설명 | 비즈니스 로직 |
|----------|--------|------|--------------|
| `/api/v1/notifications/user/{userId}` | GET | 사용자 알림 목록 (페이징) | 최신순, 페이지네이션 |
| `/api/v1/notifications/user/{userId}/unread` | GET | 읽지 않은 알림 (페이징) | isRead = false |
| `/api/v1/notifications/user/{userId}/unread-count` | GET | 읽지 않은 알림 개수 | 배지 표시용 |
| `/api/v1/notifications/{notificationId}` | GET | 특정 알림 조회 | 알림 상세 |
| `/api/v1/notifications/user/{userId}/type/{type}` | GET | 타입별 알림 조회 | 특정 타입 필터링 |
| `/api/v1/notifications/user/{userId}/urgent` | GET | 긴급 알림 조회 | type = URGENT |
| `/api/v1/notifications/user/{userId}/period` | GET | 기간별 알림 조회 | 시작~종료 시간 범위 |
| `/api/v1/notifications/user/{userId}/stats` | GET | 알림 타입별 통계 | 타입별 알림 개수 |

**알림 타입 (NotificationType)**:
- `URGENT`: 긴급 (높은 위험도 진단 결과)
- `CHECK_REMINDER`: 검사 알림 (정기 검진 권장)
- `SUBSCRIPTION_EXPIRY`: 구독 만료 알림
- `SYSTEM`: 시스템 공지

**데이터 모델 (Notification)**:
```json
{
  "id": 1,
  "user": { "userId": 123 },
  "type": "URGENT",
  "title": "높은 위험도 진단 결과",
  "message": "최근 검사에서 높은 위험도가 감지되었습니다. 의료진 상담을 권장합니다.",
  "isRead": false,
  "createdTime": "2024-01-28T10:35:00"
}
```

#### 3.7.2 알림 관리

| Endpoint | Method | 설명 | 비즈니스 로직 |
|----------|--------|------|--------------|
| `/api/v1/notifications` | POST | 알림 생성 | 새 알림 생성 (시스템/관리자) |
| `/api/v1/notifications/{notificationId}/read` | PUT | 알림 읽음 처리 | isRead = true |
| `/api/v1/notifications/{notificationId}/unread` | PUT | 알림 미읽음 처리 | isRead = false |
| `/api/v1/notifications/user/{userId}/read-all` | PUT | 모든 알림 읽음 처리 | 전체 isRead = true |
| `/api/v1/notifications/user/{userId}/type/{type}/read-all` | PUT | 타입별 읽음 처리 | 특정 타입만 읽음 |
| `/api/v1/notifications/{notificationId}` | DELETE | 알림 삭제 | 알림 삭제 |
| `/api/v1/notifications/user/{userId}/old` | DELETE | 오래된 읽은 알림 삭제 | 30일 이상 + isRead = true |

**비즈니스 규칙**:
- **자동 알림 발송**:
  - 높은 위험도 진단: URGENT 알림
  - 구독 만료 7일 전: SUBSCRIPTION_EXPIRY 알림
  - 구독 만료 3일 전: SUBSCRIPTION_EXPIRY 알림
  - 구독 만료 1일 전: SUBSCRIPTION_EXPIRY 알림
- **푸시 알림**: Setting에서 pushNotification = true 시만 발송
- **자동 삭제**: 읽은 알림 30일 후 자동 삭제
- **배치 작업**: 매일 00:00 오래된 알림 정리

---

### 3.8 설정 관리 (Settings)
**경로**: `/api/v1/settings`

#### 비즈니스 목적
사용자 개인화 설정 관리 (알림, 보안, UI)

#### 3.8.1 설정 조회 및 업데이트

| Endpoint | Method | 설명 | 비즈니스 로직 |
|----------|--------|------|--------------|
| `/api/v1/settings/{userId}` | GET | 사용자 설정 조회 | 설정 정보 반환 |
| `/api/v1/settings/{userId}` | PUT | 사용자 설정 업데이트 | 전체 설정 업데이트 |
| `/api/v1/settings/{userId}/reset` | POST | 설정 초기화 | 기본값으로 리셋 |

**데이터 모델 (Setting)**:
```json
{
  "id": 1,
  "user": { "userId": 123 },
  "pushNotification": true,
  "darkMode": false,
  "biometricAuth": true,
  "autoBackup": true,
  "languageCode": "ko",
  "privacyLevel": 2,
  "sessionTimeout": 30
}
```

#### 3.8.2 개별 설정 토글

| Endpoint | Method | 설명 | 비즈니스 로직 |
|----------|--------|------|--------------|
| `/api/v1/settings/{userId}/push-notification/toggle` | POST | 푸시 알림 토글 | true ↔ false |
| `/api/v1/settings/{userId}/dark-mode/toggle` | POST | 다크모드 토글 | true ↔ false |
| `/api/v1/settings/{userId}/biometric-auth/toggle` | POST | 생체인증 토글 | true ↔ false |
| `/api/v1/settings/{userId}/auto-backup/toggle` | POST | 자동 백업 토글 | true ↔ false |
| `/api/v1/settings/{userId}/security-mode` | POST | 보안 모드 활성화 | 보안 강화 설정 일괄 적용 |
| `/api/v1/settings/{userId}/saving-mode` | POST | 절약 모드 활성화 | 데이터 절약 설정 일괄 적용 |

#### 3.8.3 고급 설정

| Endpoint | Method | 설명 | 비즈니스 로직 |
|----------|--------|------|--------------|
| `/api/v1/settings/{userId}/language` | PUT | 언어 변경 | ko/en |
| `/api/v1/settings/{userId}/privacy-level` | PUT | 개인정보 보호 수준 | 1(낮음) ~ 3(높음) |
| `/api/v1/settings/{userId}/session-timeout` | PUT | 세션 타임아웃 설정 | 5~120분 |

**비즈니스 규칙**:
- **기본값**:
  - pushNotification: true
  - darkMode: false
  - biometricAuth: false
  - autoBackup: true
  - languageCode: "ko"
  - privacyLevel: 2
  - sessionTimeout: 30분
- **보안 모드**: biometricAuth = true, privacyLevel = 3, sessionTimeout = 15
- **절약 모드**: autoBackup = false, pushNotification = false
- **언어 지원**: ko (한국어), en (영어)
- **개인정보 보호 수준**:
  - 1: 낮음 (기본 익명화)
  - 2: 중간 (민감정보 마스킹)
  - 3: 높음 (최소 데이터 수집)

---

## 4. 데이터 모델 관계도

### 4.1 Entity Relationship Diagram

```
User (사용자)
  ├── 1:N → Check (검사)
  ├── 1:N → Prediction (진단)
  ├── 1:N → Payment (결제)
  ├── 1:N → Subscription (구독)
  ├── 1:N → DailyUsageQuota (일일 사용량)
  ├── 1:N → Notification (알림)
  └── 1:1 → Setting (설정)

Check (검사)
  ├── N:1 → User
  └── 1:1 → Prediction

Prediction (진단)
  ├── N:1 → User
  └── N:1 → Check

Subscription (구독)
  ├── N:1 → User
  ├── N:1 → CostModel (요금제)
  └── 1:1 → Payment

Payment (결제)
  ├── N:1 → User
  ├── N:1 → CostModel
  └── 1:1 → Subscription
```

### 4.2 핵심 Entity 설명

#### User (사용자)
- **식별자**: userId (PK, AUTO_INCREMENT)
- **필수 정보**: userName, userDob, phone, password
- **SNS 연동**: provider (kakao/google/apple), providerUid
- **역할**: role (USER/ADMIN)
- **상태**: isActive (활성/비활성)
- **인덱스**: phone (UNIQUE), provider + providerUid

#### Check (검사)
- **식별자**: id (PK)
- **외래키**: userId (FK → User)
- **검사 시간**: assessmentTime
- **기본 정보**: gender, age, weight, height, bmi, bodyTemperature, breathingRate
- **증상**: 11개 (chestPain ~ backPain, 0-4 척도)
- **계산 필드**: symptomCount (증상 개수)

#### Prediction (AI 진단 결과)
- **식별자**: id (PK)
- **외래키**: userId (FK), checkId (FK)
- **진단 시간**: predictTime
- **확률**: 6개 질환 확률 (normalProb ~ otherProb)
- **최종 진단**: highestProbabilityDiagnosis, highestProbability
- **모델 정보**: model, accuracy
- **검토 권장**: medicalReviewRecommended

#### DailyUsageQuota (일일 사용량)
- **식별자**: id (PK)
- **외래키**: userId (FK)
- **날짜**: date (UNIQUE with userId)
- **사용량**: count
- **제한**: dailyLimit (구독 기반)

#### Subscription (구독)
- **식별자**: id (PK)
- **외래키**: userId (FK), costId (FK)
- **기간**: startDate, endDate
- **상태**: status (ACTIVE/EXPIRED/CANCELED/PENDING)
- **사용량 제한**: dailyLimit

#### Payment (결제)
- **식별자**: id (PK)
- **외래키**: userId (FK), costId (FK), subscriptionId (FK)
- **금액**: amount, currency
- **스토어**: storeInfo (G/A)
- **거래 ID**: transactionId (UNIQUE)
- **상태**: status (PENDING/COMPLETED/FAILED/CANCELED/REFUNDED)
- **시간**: createTime, paymentTime

#### CostModel (요금제)
- **식별자**: costId (PK)
- **요금제**: plan (무료/기본/프리미엄)
- **가격**: price, currency
- **기간**: duration (일)
- **사용량 제한**: dailyLimit

#### Notification (알림)
- **식별자**: id (PK)
- **외래키**: userId (FK)
- **타입**: type (URGENT/CHECK_REMINDER/SUBSCRIPTION_EXPIRY/SYSTEM)
- **내용**: title, message
- **상태**: isRead
- **시간**: createdTime

#### Setting (설정)
- **식별자**: id (PK)
- **외래키**: userId (FK, UNIQUE)
- **알림**: pushNotification
- **UI**: darkMode
- **보안**: biometricAuth
- **백업**: autoBackup
- **언어**: languageCode
- **보호 수준**: privacyLevel
- **세션**: sessionTimeout

---

## 5. 비즈니스 규칙

### 5.1 사용량 제한 규칙

```
무료 사용자 (구독 없음):
  - dailyLimit = 1
  - 일일 1회 검사 후 사용 제한
  - 다음 날 00:00 자동 리셋

기본 플랜 (5,000원/30일):
  - dailyLimit = 5
  - 일일 5회 검사 가능
  - 구독 만료 시 무료로 전환

프리미엄 플랜 (10,000원/30일):
  - dailyLimit = 999 (무제한)
  - 제한 없이 사용 가능
  - 구독 만료 시 무료로 전환
```

### 5.2 위험도 평가 규칙

```
HIGH (높음):
  - symptomCount ≥ 5
  - OR chestPain ≥ 3
  - OR shortnessOfBreath ≥ 3
  - → 긴급 알림 발송

MEDIUM (중간):
  - symptomCount 3-4
  - AND 심각 증상 없음

LOW (낮음):
  - symptomCount < 3
```

### 5.3 의료진 검토 권장 규칙

```
medicalReviewRecommended = true 조건:
  - 비정상 질환 확률 ≥ 70%
  - OR myocardialInfarctionProb ≥ 50%
  - OR heartFailureProb ≥ 50%
  - → 의료진 상담 권장 알림 발송
```

### 5.4 알림 발송 규칙

```
1. 높은 위험도 진단 (URGENT):
   - 조건: medicalReviewRecommended = true
   - 내용: "높은 위험도 진단, 의료진 상담 권장"

2. 구독 만료 알림 (SUBSCRIPTION_EXPIRY):
   - 7일 전, 3일 전, 1일 전 발송
   - 내용: "구독이 N일 후 만료됩니다"

3. 검사 권장 알림 (CHECK_REMINDER):
   - 마지막 검사 후 7일 경과 시
   - 내용: "정기 검진을 진행해보세요"

4. 시스템 공지 (SYSTEM):
   - 관리자가 수동 발송
   - 점검, 업데이트 등
```

### 5.5 구독 및 결제 규칙

```
1. 구독 생성:
   - 결제 완료 (COMPLETED) 후에만 가능
   - 활성 구독 있을 시 신규 구독 차단 (409 Conflict)

2. 구독 만료:
   - endDate 도달 시 ACTIVE → EXPIRED
   - dailyLimit을 1로 자동 변경
   - 만료 알림 발송

3. 구독 취소:
   - 사용자 요청 시 즉시 취소
   - 환불 정책에 따라 결제 환불 처리
   - ACTIVE → CANCELED

4. 결제 환불:
   - 결제 완료 후 7일 이내만 가능
   - COMPLETED → REFUNDED
   - 연결된 구독 자동 취소
```

---

## 6. 향후 개발 계획

### 6.1 미구현 기능

#### 6.1.1 인증 및 사용자 관리
- [ ] 회원가입 API (`POST /api/auth/register`)
- [ ] 로그인 API (`POST /api/auth/login`)
- [ ] 로그아웃 API (`POST /api/auth/logout`)
- [ ] 토큰 갱신 API (`POST /api/auth/refresh`)
- [ ] 비밀번호 재설정 API (`POST /api/auth/reset-password`)
- [ ] SNS 로그인 (Kakao, Google, Apple)
- [ ] 프로필 조회/수정 API (`GET/PUT /api/users/{userId}`)
- [ ] 회원 탈퇴 API (`DELETE /api/users/{userId}`)

#### 6.1.2 음성 입력 (Voice Input)
- [ ] 음성 검사 입력 API (`POST /api/checks/voice`)
- [ ] OpenAI Realtime API 통합 (WebSocket Proxy)
- [ ] 음성 데이터 전처리 및 검증
- [ ] STT (Speech-to-Text) 정확도 검증

#### 6.1.3 AI 모델 통합
- [ ] AI 모델 API 서버 연동
- [ ] 진단 결과 자동 생성 (Check → Prediction)
- [ ] 모델 버전 관리
- [ ] 정확도 모니터링

#### 6.1.4 관리자 대시보드
- [ ] 사용자 관리 API
- [ ] 시스템 통계 대시보드
- [ ] 결제/구독 관리
- [ ] 알림 일괄 발송

#### 6.1.5 보안 및 암호화
- [ ] JWT 토큰 인증
- [ ] 비밀번호 암호화 (BCrypt)
- [ ] 민감 정보 암호화 (AES-256)
- [ ] CORS 설정
- [ ] Rate Limiting
- [ ] HIPAA 준수 설정

### 6.2 우선순위별 개발 계획

#### Phase 1: 인증 시스템 (1주)
1. JWT 기반 로그인/회원가입 구현
2. Spring Security 설정
3. 비밀번호 암호화
4. 토큰 갱신 로직

#### Phase 2: AI 모델 통합 (1주)
1. AI 모델 서버 연동
2. Check → Prediction 자동 생성
3. 위험도 평가 자동화
4. 알림 자동 발송

#### Phase 3: 음성 입력 (2주)
1. OpenAI Realtime API WebSocket Proxy
2. 음성 검사 입력 API
3. 음성 데이터 검증 및 전처리
4. Frontend 통합 테스트

#### Phase 4: 관리자 기능 (1주)
1. 관리자 대시보드 API
2. 사용자 관리 기능
3. 통계 및 리포트
4. 시스템 모니터링

#### Phase 5: 보안 강화 (1주)
1. 민감 정보 암호화
2. HIPAA 준수 설정
3. Rate Limiting
4. 보안 감사 로그

---

## 7. API 응답 포맷

### 7.1 성공 응답
```json
{
  "success": true,
  "message": "요청이 성공적으로 처리되었습니다",
  "data": { ... }
}
```

### 7.2 에러 응답
```json
{
  "success": false,
  "message": "오류 메시지",
  "errorCode": "ERROR_CODE"
}
```

### 7.3 HTTP 상태 코드
- **200 OK**: 성공
- **201 Created**: 생성 성공
- **400 Bad Request**: 잘못된 요청
- **401 Unauthorized**: 인증 필요
- **403 Forbidden**: 권한 없음
- **404 Not Found**: 리소스 없음
- **409 Conflict**: 충돌 (중복 등)
- **500 Internal Server Error**: 서버 오류

---

## 8. 참고 문서

- [Backend Code Convention](backend_code_convention.md)
- [Entity Test Documentation](entity_test_documentation.md)
- [음성입력 구현계획서](../../docs/음성입력_구현계획서.md)
- [GPT-Realtime-Mini 구현계획서](../../docs/gpt-realtime-mini_구현계획서.md)

---

**문서 작성자**: Claude Code
**최종 업데이트**: 2025-01-28
**다음 업데이트 예정**: Phase 1 완료 후 (인증 시스템)
