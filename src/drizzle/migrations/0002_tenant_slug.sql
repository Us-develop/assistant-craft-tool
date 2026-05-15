ALTER TABLE `submissions` ADD COLUMN `tenant_slug` varchar(32) NOT NULL DEFAULT 'demo';
ALTER TABLE `submissions` ADD INDEX `submissions_tenant_slug_idx` (`tenant_slug`);

ALTER TABLE `prompt_shares` ADD COLUMN `tenant_slug` varchar(32) NOT NULL DEFAULT 'demo';
