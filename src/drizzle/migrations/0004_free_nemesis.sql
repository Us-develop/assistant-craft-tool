CREATE TABLE `temp_users` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`display_name` varchar(160),
	`expires_at` timestamp,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`created_by` varchar(255),
	CONSTRAINT `temp_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `temp_users_email_unique` UNIQUE(`email`)
);
