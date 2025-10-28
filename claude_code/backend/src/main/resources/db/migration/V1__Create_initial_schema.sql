-- Initial database schema for Heart Disease Check System
-- Version: 1.0.0
-- Author: CBNU Development Team

-- Users table
CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20),
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    birth_date DATETIME,
    role ENUM('USER', 'ADMIN', 'DOCTOR') NOT NULL DEFAULT 'USER',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    account_non_expired BOOLEAN NOT NULL DEFAULT TRUE,
    account_non_locked BOOLEAN NOT NULL DEFAULT TRUE,
    credentials_non_expired BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at DATETIME,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    version BIGINT DEFAULT 0,
    PRIMARY KEY (id)
);

-- Test results table
CREATE TABLE test_results (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    diagnosis_type ENUM('ANGINA', 'MYOCARDIAL_INFARCTION', 'HEART_FAILURE', 'ARRHYTHMIA', 'OTHER_HEART_DISEASE', 'NORMAL') NOT NULL,
    confidence_score DECIMAL(5,4),
    input_data TEXT,
    audio_file_path VARCHAR(500),
    analysis_result TEXT,
    recommendations TEXT,
    status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'COMPLETED',
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    version BIGINT DEFAULT 0,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE payments (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    plan_type ENUM('MONTHLY', 'YEARLY', 'LIFETIME') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    transaction_id VARCHAR(100) UNIQUE,
    payment_method VARCHAR(50),
    payment_status ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    payment_gateway VARCHAR(50),
    receipt_url VARCHAR(500),
    failure_reason VARCHAR(500),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    version BIGINT DEFAULT 0,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance optimization
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_phone ON users(phone_number);

CREATE INDEX idx_test_result_user ON test_results(user_id);
CREATE INDEX idx_test_result_diagnosis ON test_results(diagnosis_type);
CREATE INDEX idx_test_result_date ON test_results(created_at);

CREATE INDEX idx_payment_user ON payments(user_id);
CREATE INDEX idx_payment_status ON payments(payment_status);
CREATE INDEX idx_payment_plan ON payments(plan_type);
CREATE INDEX idx_payment_date ON payments(created_at);

-- Insert default admin user (password: admin123!)
INSERT INTO users (email, password, name, role, enabled, email_verified, created_at, updated_at)
VALUES ('admin@cbnu.ac.kr', '$2a$12$7TXX1nNFE8Z1oQN2kHJzEOdWX8qKgfhE5KJKaW8qGjPLnVhLzGN3e', 'System Administrator', 'ADMIN', TRUE, TRUE, NOW(), NOW());