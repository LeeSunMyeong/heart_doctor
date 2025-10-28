CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    status VARCHAR(30) NOT NULL,
    created_at DATETIME(3) NOT NULL,
    updated_at DATETIME(3) NOT NULL
);

CREATE TABLE user_profiles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    sex VARCHAR(20),
    birth_date DATE,
    height_cm INT,
    weight_kg INT,
    created_at DATETIME(3) NOT NULL,
    updated_at DATETIME(3) NOT NULL,
    CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    locale VARCHAR(10),
    input_mode VARCHAR(20),
    timeout_sec INT,
    notifications_enabled BOOLEAN,
    created_at DATETIME(3) NOT NULL,
    updated_at DATETIME(3) NOT NULL,
    CONSTRAINT fk_user_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE screenings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL,
    result_label VARCHAR(50),
    risk_score DECIMAL(5,4),
    recommendation VARCHAR(500),
    sdk_version VARCHAR(40),
    created_at DATETIME(3) NOT NULL,
    updated_at DATETIME(3) NOT NULL,
    CONSTRAINT fk_screenings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_screenings_user (user_id)
);

CREATE TABLE screening_metrics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    screening_id BIGINT NOT NULL,
    metric_key VARCHAR(100) NOT NULL,
    metric_value VARCHAR(100) NOT NULL,
    unit VARCHAR(30),
    created_at DATETIME(3) NOT NULL,
    updated_at DATETIME(3) NOT NULL,
    CONSTRAINT fk_metrics_screening FOREIGN KEY (screening_id) REFERENCES screenings(id) ON DELETE CASCADE
);

CREATE TABLE subscriptions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    plan_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    renewal_date DATETIME(3),
    platform VARCHAR(20),
    created_at DATETIME(3) NOT NULL,
    updated_at DATETIME(3) NOT NULL,
    CONSTRAINT fk_subscriptions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_subscriptions_user (user_id)
);

CREATE TABLE payment_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    subscription_id BIGINT,
    provider VARCHAR(20),
    provider_tx_id VARCHAR(120) NOT NULL UNIQUE,
    amount DECIMAL(10,2),
    currency VARCHAR(10),
    status VARCHAR(20) NOT NULL,
    purchased_at DATETIME(3),
    created_at DATETIME(3) NOT NULL,
    updated_at DATETIME(3) NOT NULL,
    CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_payments_subscription FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL
);

CREATE TABLE audio_sessions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    screening_id BIGINT,
    state VARCHAR(20) NOT NULL,
    duration_sec INT,
    error_code VARCHAR(50),
    created_at DATETIME(3) NOT NULL,
    updated_at DATETIME(3) NOT NULL,
    CONSTRAINT fk_audio_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_audio_screening FOREIGN KEY (screening_id) REFERENCES screenings(id) ON DELETE SET NULL
);
