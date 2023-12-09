import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import * as schema from './schema';
import mysql from 'mysql2/promise';

(async () => {
	const connection = await mysql.createConnection({
		uri: process.env.DATABASE_URL
	});

	const db = drizzle(connection, {
		schema,
		mode: 'default',
		logger: true
	});

	await migrate(db, { migrationsFolder: './drizzle/migrations' });

	await connection.end();
})();
