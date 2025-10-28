-- Heart Doctor Schema Migration
-- Version: 2.0.0 - Complete schema restructure for Heart Doctor system
-- Author: CBNU Development Team
-- Date: 2024
-- Description: Migrates from generic heart disease system to Heart Doctor with 16 symptoms and AI diagnosis

-- ====================================================================
-- STEP 1: Drop existing tables (in reverse dependency order)
-- ====================================================================

-- Drop foreign key constraints first
ALTER TABLE test_results DROP FOREIGN KEY test_results_ibfk_1;
ALTER TABLE payments DROP FOREIGN KEY payments_ibfk_1;

-- Drop existing tables
DROP TABLE IF EXISTS test_results;
DROP TABLE IF EXISTS payments;

-- ====================================================================
-- STEP 2: Recreate users table with Heart Doctor specification
-- ====================================================================

-- Backup existing user data
CREATE TABLE users_backup AS SELECT * FROM users;

-- Drop and recreate users table
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id BIGINT NOT NULL AUTO_INCREMENT COMMENT '사용자 고유 ID',
    user_name VARCHAR(50) NOT NULL COMMENT '사용자 이름',
    user_dob CHAR(8) NOT NULL COMMENT '생년월일 (YYYYMMDD)',
    phone VARCHAR(11) NOT NULL UNIQUE COMMENT '휴대폰 번호 (01012345678)',
    provider VARCHAR(20) COMMENT 'SNS 로그인 제공자 (google, apple, kakao)',
    provider_uid VARCHAR(100) COMMENT 'SNS 고유 ID',
    role ENUM('USER', 'ADMIN', 'DOCTOR') NOT NULL DEFAULT 'USER' COMMENT '사용자 역할',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '활성 상태',
    last_login_time DATETIME COMMENT '마지막 로그인 시간',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '계정 생성 시간',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '마지막 수정 시간',

    PRIMARY KEY (user_id),

    INDEX idx_user_phone (phone),
    INDEX idx_user_provider (provider, provider_uid),
    INDEX idx_user_active (is_active),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자 정보 테이블';

-- ====================================================================
-- STEP 3: Create cost_models table (요금제)
-- ====================================================================

CREATE TABLE cost_models (
    cost_id SMALLINT NOT NULL AUTO_INCREMENT COMMENT '요금제 ID',
    type ENUM('MONTHLY', 'YEARLY', 'LIFETIME') NOT NULL COMMENT '구독 타입',
    cost INT NOT NULL COMMENT '가격 (원)',

    PRIMARY KEY (cost_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='요금제 모델';

-- ====================================================================
-- STEP 4: Create checks table (건강 검사 데이터)
-- ====================================================================

CREATE TABLE checks (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '검사 ID',
    user_id BIGINT NOT NULL COMMENT '사용자 ID',
    assessment_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '검사 시간',

    -- 기본 생체 정보
    gender BOOLEAN DEFAULT FALSE COMMENT '성별 (0:남, 1:여)',
    age SMALLINT COMMENT '나이',
    height SMALLINT COMMENT '키 (cm)',
    weight SMALLINT COMMENT '몸무게 (kg)',
    bmi DECIMAL(4,2) COMMENT 'BMI 지수',
    temperature CHAR(1) DEFAULT '0' COMMENT '체온 (0:보통, 1:낮음, 2:높음)',
    breathing CHAR(1) DEFAULT '0' COMMENT '호흡 (0:보통, 1:낮음, 2:높음)',
    pulse SMALLINT COMMENT '맥박수 (bpm)',

    -- Q1-Q16: 16개 증상 관련 boolean 필드들
    chest_pain BOOLEAN DEFAULT FALSE COMMENT 'Q1. 가슴 통증 여부',
    flank_pain BOOLEAN DEFAULT FALSE COMMENT 'Q2. 옆구리 통증 여부',
    foot_pain BOOLEAN DEFAULT FALSE COMMENT 'Q3. 발 통증 여부',
    foot_edema BOOLEAN DEFAULT FALSE COMMENT 'Q4. 발 부종 여부',
    dyspnea BOOLEAN DEFAULT FALSE COMMENT 'Q5. 호흡곤란 여부',
    syncope BOOLEAN DEFAULT FALSE COMMENT 'Q6. 실신 여부',
    weakness BOOLEAN DEFAULT FALSE COMMENT 'Q7. 피로감 여부',
    vomitting BOOLEAN DEFAULT FALSE COMMENT 'Q8. 구토 여부',
    palpitation BOOLEAN DEFAULT FALSE COMMENT 'Q9. 심장 두근거림 여부',
    dizziness BOOLEAN DEFAULT FALSE COMMENT 'Q10. 어지러움 여부',
    chest_tightness BOOLEAN DEFAULT FALSE COMMENT 'Q11. 흉부 답답함 여부',
    sweating BOOLEAN DEFAULT FALSE COMMENT 'Q12. 식은땀 발생 여부',
    headache BOOLEAN DEFAULT FALSE COMMENT 'Q13. 두통 여부',
    nausea BOOLEAN DEFAULT FALSE COMMENT 'Q14. 메스꺼움 여부',
    edema BOOLEAN DEFAULT FALSE COMMENT 'Q15. 부종 여부',
    insomnia BOOLEAN DEFAULT FALSE COMMENT 'Q16. 수면장애 여부',

    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,

    INDEX idx_check_user (user_id),
    INDEX idx_check_assessment_time (assessment_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='건강 검사 데이터';

-- ====================================================================
-- STEP 5: Create predictions table (AI 진단 결과)
-- ====================================================================

CREATE TABLE predictions (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '예측 ID',
    user_id BIGINT NOT NULL COMMENT '사용자 ID',
    assessment_id BIGINT NOT NULL COMMENT '검사 ID',

    -- AI 진단 결과 - 6개 질환 확률
    angina DECIMAL(5,2) NOT NULL COMMENT '협심증 확률 (%)',
    mi DECIMAL(5,2) NOT NULL COMMENT '심근경색 확률 (%)',
    hf DECIMAL(5,2) NOT NULL COMMENT '심부전 확률 (%)',
    af DECIMAL(5,2) NOT NULL COMMENT '심방세동 확률 (%)',
    other DECIMAL(5,2) NOT NULL COMMENT '기타 질환 확률 (%)',
    normal DECIMAL(5,2) NOT NULL COMMENT '정상 확률 (%)',

    comment VARCHAR(100) NOT NULL COMMENT '결과 코멘트',
    predict_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '예측 시각',

    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (assessment_id) REFERENCES checks(id) ON DELETE CASCADE,

    INDEX idx_prediction_user (user_id),
    INDEX idx_prediction_assessment (assessment_id),
    INDEX idx_prediction_time (predict_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI 진단 결과';

-- ====================================================================
-- STEP 6: Create subscriptions table (사용자 구독 상태)
-- ====================================================================

CREATE TABLE subscriptions (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '구독 ID',
    user_id BIGINT NOT NULL COMMENT '사용자 ID',
    cost_id SMALLINT NOT NULL COMMENT '요금제 ID',
    from_date DATETIME COMMENT '시작일',
    to_date DATETIME COMMENT '종료일',
    status ENUM('ACTIVE', 'PENDING', 'EXPIRED', 'CANCELED') NOT NULL COMMENT '구독 상태',

    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (cost_id) REFERENCES cost_models(cost_id),

    INDEX idx_subscription_user (user_id),
    INDEX idx_subscription_status (status),
    INDEX idx_subscription_dates (from_date, to_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자 구독 상태';

-- ====================================================================
-- STEP 7: Create payments table (결제 정보)
-- ====================================================================

CREATE TABLE payments (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '결제 ID',
    user_id BIGINT NOT NULL COMMENT '사용자 ID',
    subscription_id BIGINT COMMENT '연결된 구독 ID',
    cost_id SMALLINT NOT NULL COMMENT '요금제 ID',
    status ENUM('PENDING', 'SUCCESS', 'FAIL', 'CANCELED', 'REFUNDED') NOT NULL COMMENT '결제 상태',
    pay_time DATETIME NOT NULL COMMENT '결제 완료 시간',
    store_info CHAR(1) NOT NULL COMMENT '결제 스토어 (G:구글, A:애플)',
    transaction_id VARCHAR(100) UNIQUE COMMENT '트랜잭션 ID',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',

    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id),
    FOREIGN KEY (cost_id) REFERENCES cost_models(cost_id),

    INDEX idx_payment_user (user_id),
    INDEX idx_payment_subscription (subscription_id),
    INDEX idx_payment_status (status),
    INDEX idx_payment_transaction (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='결제 정보';

-- ====================================================================
-- STEP 8: Create daily_usage_quotas table (일일 사용량 제한)
-- ====================================================================

CREATE TABLE daily_usage_quotas (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '할당량 ID',
    user_id BIGINT NOT NULL COMMENT '사용자 ID',
    day DATE NOT NULL COMMENT '기준일',
    count INT NOT NULL DEFAULT 0 COMMENT '당일 사용 횟수',
    quota_limit INT NOT NULL COMMENT '허용 횟수 (무료:1, 유료:5)',

    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,

    UNIQUE INDEX idx_quota_user_day (user_id, day),
    INDEX idx_quota_day (day)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='일일 사용량 제한';

-- ====================================================================
-- STEP 9: Create settings table (사용자 환경설정)
-- ====================================================================

CREATE TABLE settings (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '설정 ID',
    user_id BIGINT NOT NULL COMMENT '사용자 ID',
    push_notification BOOLEAN NOT NULL DEFAULT TRUE COMMENT '푸시 알림 허용',
    email_notification BOOLEAN NOT NULL DEFAULT TRUE COMMENT '이메일 알림 허용',
    marketing_notification BOOLEAN NOT NULL DEFAULT FALSE COMMENT '마케팅 알림 허용',
    dark_mode BOOLEAN NOT NULL DEFAULT FALSE COMMENT '다크모드 설정',
    language VARCHAR(5) NOT NULL DEFAULT 'ko' COMMENT '언어 설정 (ko, en)',
    data_save_mode BOOLEAN NOT NULL DEFAULT FALSE COMMENT '데이터 절약 모드',
    auto_backup BOOLEAN NOT NULL DEFAULT TRUE COMMENT '자동 백업 설정',
    session_timeout INT NOT NULL DEFAULT 30 COMMENT '세션 타임아웃 (분)',
    privacy_level INT NOT NULL DEFAULT 2 COMMENT '개인정보 보호 수준 (1:낮음, 2:보통, 3:높음)',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간',

    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,

    UNIQUE INDEX idx_setting_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자 환경설정';

-- ====================================================================
-- STEP 10: Create notifications table (알림 관리)
-- ====================================================================

CREATE TABLE notifications (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '알림 ID',
    user_id BIGINT NOT NULL COMMENT '사용자 ID',
    type ENUM('SYSTEM', 'HEALTH', 'PAYMENT', 'SUBSCRIPTION', 'PROMOTION', 'SECURITY', 'UPDATE', 'REMINDER') NOT NULL COMMENT '알림 타입',
    title VARCHAR(100) NOT NULL COMMENT '알림 제목',
    message VARCHAR(500) NOT NULL COMMENT '알림 메시지',
    url VARCHAR(200) COMMENT '클릭 시 이동할 URL',
    is_read BOOLEAN NOT NULL DEFAULT FALSE COMMENT '읽음 여부',
    read_time DATETIME COMMENT '읽은 시간',
    sent_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '발송 시간',
    scheduled_time DATETIME COMMENT '예약 발송 시간',
    priority INT NOT NULL DEFAULT 1 COMMENT '우선순위 (1:낮음, 2:보통, 3:높음, 4:긴급)',

    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,

    INDEX idx_notification_user (user_id),
    INDEX idx_notification_type (type),
    INDEX idx_notification_read (is_read),
    INDEX idx_notification_sent_time (sent_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='알림 관리';

-- ====================================================================
-- STEP 11: Insert initial data
-- ====================================================================

-- Insert default cost models
INSERT INTO cost_models (type, cost) VALUES
('MONTHLY', 9900),
('YEARLY', 99000),
('LIFETIME', 299000);

-- Migrate existing users to new schema (if users_backup exists and has data)
-- This is a simple migration - in production, you'd need more sophisticated data mapping
INSERT INTO users (user_name, user_dob, phone, role, is_active, create_time, update_time)
SELECT
    name,
    DATE_FORMAT(IFNULL(birth_date, '1990-01-01'), '%Y%m%d'),
    IFNULL(phone_number, '01000000000'),
    role,
    enabled,
    created_at,
    updated_at
FROM users_backup
WHERE id > 0;

-- Create default admin user for Heart Doctor system
INSERT INTO users (user_name, user_dob, phone, role, is_active, create_time, update_time)
VALUES ('관리자', '19900101', '01012345678', 'ADMIN', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE user_name = user_name;

-- Create default settings for all users
INSERT INTO settings (user_id)
SELECT user_id FROM users
ON DUPLICATE KEY UPDATE user_id = user_id;

-- ====================================================================
-- STEP 12: Clean up
-- ====================================================================

-- Drop backup table (comment out for safety in production)
-- DROP TABLE users_backup;

-- ====================================================================
-- MIGRATION COMPLETE
-- ====================================================================

-- Migration completed successfully
-- - Migrated from generic heart disease system to Heart Doctor specification
-- - Added 16 symptom tracking in checks table
-- - Added AI diagnosis with 6 disease probabilities in predictions table
-- - Added subscription and payment management
-- - Added daily usage quotas for free/premium users
-- - Added comprehensive settings and notifications
-- - Preserved existing user data where possible