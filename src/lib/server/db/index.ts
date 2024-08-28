import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import postgres from 'postgres';

const queryClient = postgres(env.PRIVATE_DATABASE_URL);

export const db = drizzle(queryClient, {
	schema,
	logger: dev
});
