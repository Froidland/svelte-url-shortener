import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from './schema';
import mysql from 'mysql2/promise';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

const poolConnection = mysql.createPool({
	uri: env.PRIVATE_DATABASE_URL
});

export const db = drizzle(poolConnection, {
	schema,
	mode: 'default',
	logger: dev
});
