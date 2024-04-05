ALTER TABLE `urls` RENAME COLUMN `redirect` TO `destination`;
ALTER TABLE `users` ADD `is_allowed_custom_slugs` boolean DEFAULT false;