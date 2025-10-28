-- Add login_id column to users table
-- This migration adds the loginId field for user's input login ID
-- while keeping userId as the Long primary key

ALTER TABLE users
ADD COLUMN login_id VARCHAR(20) UNIQUE AFTER user_id;

-- Create index for login_id for faster lookups
CREATE INDEX idx_user_login_id ON users(login_id);

-- Optional: Update existing users with a default login_id based on phone
-- UPDATE users SET login_id = CONCAT('user_', phone) WHERE login_id IS NULL;

-- Comments
COMMENT ON COLUMN users.login_id IS 'User input login ID (unique identifier for login)';
