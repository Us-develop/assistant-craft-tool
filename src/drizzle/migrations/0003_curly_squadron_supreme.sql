CREATE TABLE IF NOT EXISTS `tenant_users` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`tenant_slug` varchar(32) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`created_by` varchar(255),
	CONSTRAINT `tenant_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_tenant_uniq` UNIQUE(`email`,`tenant_slug`)
);
--> statement-breakpoint
CREATE INDEX `tenant_users_email_idx` ON `tenant_users` (`email`);
