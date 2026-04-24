-- ----------------------------------------------------------------------------
-- Initial schema for Assistant Craft Tool.
-- Run via `npm run db:migrate` or apply manually in phpMyAdmin on Combell.
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `submissions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `language` VARCHAR(8) NOT NULL,
  `assistant_name` VARCHAR(160) NULL,
  `domain` VARCHAR(160) NULL,
  `job_title` VARCHAR(320) NULL,
  `data` JSON NOT NULL,
  `generated_prompt` TEXT NOT NULL,
  `kickoff_message` TEXT NULL,
  `char_count` BIGINT UNSIGNED NOT NULL,
  `ip_hash` VARCHAR(64) NULL,
  `user_agent` VARCHAR(500) NULL,
  PRIMARY KEY (`id`),
  INDEX `submissions_created_at_idx` (`created_at`),
  INDEX `submissions_domain_idx` (`domain`),
  INDEX `submissions_language_idx` (`language`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
