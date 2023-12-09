import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from './schema';
import mysql from 'mysql2/promise';
import { dev } from '$app/environment';

const poolConnection = mysql.createPool({
	uri: process.env.DATABASE_URL
});

export const db = drizzle(poolConnection, {
	schema,
	mode: 'default',
	logger: dev
});
