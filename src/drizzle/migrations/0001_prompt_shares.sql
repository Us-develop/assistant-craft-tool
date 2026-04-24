-- ----------------------------------------------------------------------------
-- Public share links for generated prompts (result screen: "Create link")
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `prompt_shares` (
  `token` VARCHAR(32) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `language` VARCHAR(8) NOT NULL,
  `assistant_name` VARCHAR(160) NULL,
  `generated_prompt` TEXT NOT NULL,
  `kickoff_message` TEXT NULL,
  PRIMARY KEY (`token`),
  INDEX `prompt_shares_created_at_idx` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
