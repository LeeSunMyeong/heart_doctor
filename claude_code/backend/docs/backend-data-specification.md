# 🧩 backend.data.spec.md
**Project:** Heart Doctor  
**Version:** 1.4  
**Author:** GPT-5 SDD Architect  
**Framework:** Spring Boot 3.2 (Java 17)  
**Database:** MySQL 8.0 (AWS RDS)  
**ORM:** JPA (Hibernate)  
**Cache:** Redis (Session, Daily Limit)  

---

## 📘 1️⃣ Overview
본 문서는 **Heart Doctor 백엔드 시스템의 데이터 모델 명세서(Data Specification)** 입니다.  
Spring Boot 기반 API 서버에서 사용되는 모든 데이터 엔티티 구조를 명확히 정의하며,  
AI Agent 또는 개발자가 직접 JPA Entity, DTO, DDL 생성 시 참조할 수 있도록 작성되었습니다.

---

## 📗 2️⃣ Entity Relationship Overview

**주요 엔티티 구성도**

- User → (1:N) → Check, Prediction, Subscription, Payment, Notification, Setting, DailyUsageQuota  
- Check → (1:1) → Prediction  
- Subscription → (N:1) → CostModel  
- Payment → (N:1) → Subscription  
- Notification → (N:1) → User  

---

## 📙 3️⃣ Entity Definitions

### 🧩 3.1 User
사용자 계정 및 기본 정보 관리 테이블.

| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| userId | BIGINT | PK | 사용자 고유 ID |
| userName | VARCHAR(30) | NN | 사용자 이름 |
| userDob | CHAR(8) | NN | 생년월일 (YYYYMMDD) |
| phone | VARCHAR(11) | NN, UNIQUE | 휴대폰 번호 |
| password | VARCHAR(64) | NN | 암호화된 비밀번호 |
| provider | VARCHAR(20) | NULL | SNS 로그인 루트 (kakao, google, apple) |
| providerUid | VARCHAR(100) | NULL | SNS 고유 식별자 |
| createTime | DATETIME | DEFAULT CURRENT_TIMESTAMP | 생성 시각 |

**관계**
- `@OneToMany(mappedBy="user")` → Check, Prediction, Payment, Subscription, Notification, Setting, DailyUsageQuota

---

### 🧩 3.2 CostModel
구독 요금제 모델 정의.

| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| costId | SMALLINT | PK | 요금제 식별자 |
| type | ENUM('MONTHLY','YEARLY','LIFETIME') | NN | 구독 타입 |
| cost | INT | NN | 가격 (단위: 원) |

**관계**
- `@OneToMany(mappedBy="costModel")` → Subscription

---

### 🧩 3.3 Payment
사용자 결제 정보 및 상태 기록.

| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | BIGINT | PK | 결제 ID |
| userId | BIGINT | FK (User.userId) | 결제 사용자 |
| subscriptionId | BIGINT | FK (Subscription.id) | 연결된 구독 |
| costId | SMALLINT | FK (CostModel.costId) | 요금제 참조 |
| status | ENUM('PENDING','SUCCESS','FAIL','CANCELED','REFUNDED') | NN | 결제 상태 |
| payTime | DATETIME | NN | 결제 완료 시간 |
| storeInfo | CHAR(1) | NN | 결제 스토어(G/A) |
| transactionId | VARCHAR(100) | UNIQUE | 트랜잭션 식별자 |
| createTime | DATETIME | DEFAULT CURRENT_TIMESTAMP | 생성 시간 |

---

### 🧩 3.4 Check
사용자의 건강 검사 데이터.

| No | 컬럼명 | 타입 | 제약 | 기본값 | 설명 |
|----|---------|------|------|---------|------|
| 1 | id | BIGINT | PK, NN | AUTO_INCREMENT | 검사 고유 ID |
| 2 | userId | BIGINT | FK, NN |  | 사용자 ID (User.userId 참조) |
| 3 | assessmentTime | DATETIME | NN | CURRENT_TIMESTAMP | 검사 일시 |
| 4 | gender | BOOLEAN | NULL | 0 | 성별 (0:남, 1:여) |
| 5 | age | SMALLINT(2) | NULL |  | 나이 |
| 6 | height | SMALLINT(2) | NULL |  | 키(cm) |
| 7 | weight | SMALLINT(2) | NULL |  | 몸무게(kg) |
| 8 | bmi | DECIMAL(4,2) | NULL |  | BMI (자동 계산) |
| 9 | temperature | CHAR(1) | NULL | 0 | 체온 상태 (0:보통,1:낮음,2:높음) |
| 10 | breathing | CHAR(1) | NULL | 0 | 호흡 상태 (0:보통,1:낮음,2:높음) |
| 11 | pulse | SMALLINT(2) | NULL |  | 맥박수 (30~220 bpm) |
| 12 | chestPain | BOOLEAN | NULL | 0 | Q1. 가슴 통증 여부 |
| 13 | flankPain | BOOLEAN | NULL | 0 | Q2. 옆구리 통증 여부 |
| 14 | footPain | BOOLEAN | NULL | 0 | Q3. 발 통증 여부 |
| 15 | footEdema | BOOLEAN | NULL | 0 | Q4. 발 부종 여부 |
| 16 | dyspnea | BOOLEAN | NULL | 0 | Q5. 호흡곤란 여부 |
| 17 | syncope | BOOLEAN | NULL | 0 | Q6. 실신 여부 |
| 18 | weakness | BOOLEAN | NULL | 0 | Q7. 피로감 여부 |
| 19 | vomitting | BOOLEAN | NULL | 0 | Q8. 구토 여부 |
| 20 | palpitation | BOOLEAN | NULL | 0 | Q9. 심장 두근거림 여부 |
| 21 | dizziness | BOOLEAN | NULL | 0 | Q10. 어지러움 여부 |
| 22 | chestTightness | BOOLEAN | NULL | 0 | Q11. 흉부 답답함 여부 |
| 23 | sweating | BOOLEAN | NULL | 0 | Q12. 식은땀 발생 여부 |
| 24 | headache | BOOLEAN | NULL | 0 | Q13. 두통 여부 |
| 25 | nausea | BOOLEAN | NULL | 0 | Q14. 메스꺼움 여부 |
| 26 | edema | BOOLEAN | NULL | 0 | Q15. 부종 여부 |
| 27 | insomnia | BOOLEAN | NULL | 0 | Q16. 수면장애 여부 |

---

### 🧩 3.5 Prediction
AI 추론 기반 진단 결과 저장.

| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | BIGINT | PK | 결과 ID |
| userId | BIGINT | FK (User.userId) | 사용자 참조 |
| assessmentId | BIGINT | FK (Check.id) | 검사 참조 |
| angina | DECIMAL(5,2) | NN | 협심증 확률 |
| mi | DECIMAL(5,2) | NN | 심근경색 확률 |
| hf | DECIMAL(5,2) | NN | 심부전 확률 |
| af | DECIMAL(5,2) | NN | 심방세동 확률 |
| other | DECIMAL(5,2) | NN | 기타 질환 확률 |
| normal | DECIMAL(5,2) | NN | 정상 확률 |
| comment | VARCHAR(100) | NN | 결과 코멘트 |
| predictTime | DATETIME | DEFAULT CURRENT_TIMESTAMP | 예측 시각 |

---

### 🧩 3.6 Notification
사용자 알림 데이터.

| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | BIGINT | PK | 알림 ID |
| userId | BIGINT | FK (User.userId) | 사용자 |
| type | CHAR(1) | NULL | 알림 유형 |
| title | VARCHAR(50) | NULL | 제목 |
| body | VARCHAR(100) | NULL | 본문 |
| notiTime | DATETIME | NULL | 발송 시각 |
| readTime | DATETIME | NULL | 읽음 시각 |

---

### 🧩 3.7 Subscription
사용자 구독 상태.

| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | BIGINT | PK | 구독 ID |
| userId | BIGINT | FK (User.userId) | 사용자 |
| costId | SMALLINT | FK (CostModel.costId) | 요금제 |
| from | DATETIME | NULL | 시작일 |
| to | DATETIME | NULL | 종료일 |
| status | ENUM('ACTIVE','PENDING','EXPIRED','CANCELED') | NN | 구독 상태 |

---

### 🧩 3.8 DailyUsageQuota
사용자 일일 검사 제한량 관리.

| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | BIGINT | PK | 식별자 |
| userId | BIGINT | FK (User.userId) | 사용자 |
| day | DATE | NN | 날짜 |
| count | INT | DEFAULT 0 | 당일 사용 횟수 |
| limit | INT | NN | 당일 허용 횟수 (무료:1, 유료:5) |

---

### 🧩 3.9 Setting
사용자 환경 설정 저장.

| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | BIGINT | PK | 설정 ID |
| userId | BIGINT | FK (User.userId) | 사용자 |
| inputMode | BOOLEAN | NN | 입력 방식 (0:텍스트,1:음성) |
| theme | BOOLEAN | NN | 테마 (0:라이트,1:다크) |
| alarmTime1 | CHAR(6) | NULL | 알람1 (HHMMSS) |
| alarmTime2 | CHAR(6) | NULL | 알람2 |
| alarmTime3 | CHAR(6) | NULL | 알람3 |

---
