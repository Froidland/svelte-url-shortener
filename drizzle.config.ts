import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle/migrations',
	driver: 'mysql2',
	dbCredentials: {
		uri: process.env.VITE_DATABASE_URL
	}
} satisfies Config;
