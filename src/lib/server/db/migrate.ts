import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as schema from './schema';
import postgres from 'postgres';

(async () => {
	const connection = postgres(process.env.PRIVATE_DATABASE_URL!, { max: 1 });

	const db = drizzle(connection, {
		schema,
		logger: true
	});

	await migrate(db, { migrationsFolder: './drizzle/migrations' });

	await connection.end();
})();
