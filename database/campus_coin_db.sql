-- =========================================================
-- Campus Coin Database
-- Student Budget and Expense Management System
-- =========================================================

DROP DATABASE IF EXISTS campus_coin_db;

CREATE DATABASE campus_coin_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE campus_coin_db;


-- =========================================================
-- 1. USERS
-- Stores both student and administrator accounts.
-- =========================================================

CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    role ENUM('student', 'admin') NOT NULL DEFAULT 'student',

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    academic_year VARCHAR(50) DEFAULT NULL,

    monthly_allowance DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    monthly_savings_goal DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    is_active TINYINT(1) NOT NULL DEFAULT 1,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- =========================================================
-- 2. CATEGORIES
--
-- user_id = NULL means the category is a system/default
-- category available to students.
--
-- user_id with a value means it belongs only to that student.
-- =========================================================

CREATE TABLE categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNSIGNED DEFAULT NULL,

    name VARCHAR(80) NOT NULL,

    type ENUM('income', 'expense') NOT NULL,

    is_default TINYINT(1) NOT NULL DEFAULT 0,

    is_active TINYINT(1) NOT NULL DEFAULT 1,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_categories_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;


-- =========================================================
-- 3. TRANSACTIONS
-- Stores all student income and expense records.
-- =========================================================

CREATE TABLE transactions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNSIGNED NOT NULL,

    category_id INT UNSIGNED NOT NULL,

    amount DECIMAL(12,2) NOT NULL,

    type ENUM('income', 'expense') NOT NULL,

    description VARCHAR(255) DEFAULT NULL,

    transaction_date DATE NOT NULL,

    is_recurring TINYINT(1) NOT NULL DEFAULT 0,

    recurring_frequency ENUM(
        'weekly',
        'monthly',
        'yearly'
    ) DEFAULT NULL,

    recurring_end_date DATE DEFAULT NULL,

    ai_suggested_category_id INT UNSIGNED DEFAULT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_transactions_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_transactions_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id),

    CONSTRAINT fk_transactions_ai_category
        FOREIGN KEY (ai_suggested_category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL,

    INDEX idx_transactions_user_date (user_id, transaction_date),

    INDEX idx_transactions_category (category_id)
) ENGINE=InnoDB;


-- =========================================================
-- 4. TRANSACTION HISTORY
--
-- Keeps an audit trail when transactions are created,
-- edited or deleted.
-- =========================================================

CREATE TABLE transaction_history (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    transaction_id INT UNSIGNED NOT NULL,

    user_id INT UNSIGNED NOT NULL,

    action ENUM(
        'created',
        'updated',
        'deleted'
    ) NOT NULL,

    old_data LONGTEXT DEFAULT NULL,

    new_data LONGTEXT DEFAULT NULL,

    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_history_transaction (transaction_id),

    INDEX idx_history_user (user_id)
) ENGINE=InnoDB;


-- =========================================================
-- 5. BUDGETS
-- Monthly spending limit for an expense category.
-- =========================================================

CREATE TABLE budgets (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNSIGNED NOT NULL,

    category_id INT UNSIGNED NOT NULL,

    budget_month DATE NOT NULL,

    limit_amount DECIMAL(12,2) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_budgets_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_budgets_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE,

    UNIQUE KEY unique_monthly_budget (
        user_id,
        category_id,
        budget_month
    )
) ENGINE=InnoDB;


-- =========================================================
-- 6. SAVINGS GOALS
-- Allows a student to create specific saving targets.
-- =========================================================

CREATE TABLE savings_goals (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNSIGNED NOT NULL,

    title VARCHAR(120) NOT NULL,

    target_amount DECIMAL(12,2) NOT NULL,

    saved_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    target_date DATE DEFAULT NULL,

    status ENUM(
        'active',
        'completed',
        'cancelled'
    ) NOT NULL DEFAULT 'active',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_goals_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;


-- =========================================================
-- 7. INSIGHTS
-- Stores monthly rule-based or optional AI insights.
-- =========================================================

CREATE TABLE insights (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNSIGNED NOT NULL,

    insight_month DATE NOT NULL,

    summary_text TEXT NOT NULL,

    advice_text TEXT DEFAULT NULL,

    source ENUM(
        'system',
        'ai'
    ) NOT NULL DEFAULT 'system',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_insights_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_insights_user_month (
        user_id,
        insight_month
    )
) ENGINE=InnoDB;


-- =========================================================
-- 8. SAVING TIPS
-- Personalized saving recommendations for students.
-- =========================================================

CREATE TABLE saving_tips (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNSIGNED NOT NULL,

    title VARCHAR(150) NOT NULL,

    message TEXT NOT NULL,

    potential_saving DECIMAL(12,2) DEFAULT NULL,

    priority ENUM(
        'low',
        'medium',
        'high'
    ) NOT NULL DEFAULT 'medium',

    is_pinned TINYINT(1) NOT NULL DEFAULT 0,

    is_dismissed TINYINT(1) NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_tips_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;


-- =========================================================
-- 9. NOTIFICATIONS
-- Budget alerts and application messages.
-- =========================================================

CREATE TABLE notifications (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNSIGNED NOT NULL,

    title VARCHAR(150) NOT NULL,

    message TEXT NOT NULL,

    type ENUM(
        'budget',
        'transaction',
        'goal',
        'system'
    ) NOT NULL DEFAULT 'system',

    is_read TINYINT(1) NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_notifications_user_read (
        user_id,
        is_read
    )
) ENGINE=InnoDB;


-- =========================================================
-- 10. BOOKMARKS
-- Saves tips or insights for later reference.
-- =========================================================

CREATE TABLE bookmarks (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNSIGNED NOT NULL,

    item_type ENUM(
        'tip',
        'insight'
    ) NOT NULL,

    item_id INT UNSIGNED NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bookmarks_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    UNIQUE KEY unique_bookmark (
        user_id,
        item_type,
        item_id
    )
) ENGINE=InnoDB;


-- =========================================================
-- 11. PASSWORD RESET TOKENS
-- Used for password recovery.
-- =========================================================

CREATE TABLE password_reset_tokens (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNSIGNED NOT NULL,

    token_hash VARCHAR(255) NOT NULL,

    expires_at DATETIME NOT NULL,

    used_at DATETIME DEFAULT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_password_reset_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_password_reset_token (token_hash)
) ENGINE=InnoDB;


-- =========================================================
-- 12. ANNOUNCEMENTS
-- Admin-created system announcements and messages.
-- =========================================================

CREATE TABLE announcements (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(150) NOT NULL,

    message TEXT NOT NULL,

    created_by INT UNSIGNED NOT NULL,

    is_active TINYINT(1) NOT NULL DEFAULT 1,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_announcements_admin
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;


-- =========================================================
-- DEFAULT INCOME CATEGORIES
-- =========================================================

INSERT INTO categories (
    user_id,
    name,
    type,
    is_default
)
VALUES
(NULL, 'Allowance', 'income', 1),
(NULL, 'Part-time Job', 'income', 1),
(NULL, 'Scholarship', 'income', 1),
(NULL, 'Gift', 'income', 1),
(NULL, 'Other Income', 'income', 1);


-- =========================================================
-- DEFAULT EXPENSE CATEGORIES
-- =========================================================

INSERT INTO categories (
    user_id,
    name,
    type,
    is_default
)
VALUES
(NULL, 'Food', 'expense', 1),
(NULL, 'Transport', 'expense', 1),
(NULL, 'Hostel/Rent', 'expense', 1),
(NULL, 'Academics', 'expense', 1),
(NULL, 'Subscriptions', 'expense', 1),
(NULL, 'Entertainment', 'expense', 1),
(NULL, 'Miscellaneous', 'expense', 1);