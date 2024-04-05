import { sql } from 'drizzle-orm';
import {
	bigint,
	boolean,
	datetime,
	index,
	mysqlTable,
	timestamp,
	varchar
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
	id: varchar('id', {
		length: 24
	}).primaryKey(),

	discordId: varchar('discord_id', { length: 255 }).notNull(),
	discordUsername: varchar('discord_username', { length: 255 }).notNull(),

	isAllowedCustomSlugs: boolean('is_allowed_custom_slugs').default(false),

	createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date' }).onUpdateNow()
});

export const sessions = mysqlTable('sessions', {
	id: varchar('id', {
		length: 255
	}).primaryKey(),
	userId: varchar('user_id', {
		length: 24
	})
		.notNull()
		.references(() => users.id),
	expiresAt: datetime('expires_at').notNull()
});

export const urls = mysqlTable(
	'urls',
	{
		slug: varchar('slug', { length: 255 }).primaryKey(),

		destination: varchar('destination', { length: 2048 }).notNull(),
		clicks: bigint('clicks', { unsigned: true, mode: 'bigint' }).default(sql`0`),

		userId: varchar('user_id', { length: 24 }).references(() => users.id, {
			onDelete: 'set null'
		}),

		createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
		deletedAt: timestamp('deleted_at', { mode: 'date' })
	},
	(table) => {
		return {
			slugIndex: index('slug_idx').on(table.slug),
			userIdIndex: index('user_id_idx').on(table.userId)
		};
	}
);
