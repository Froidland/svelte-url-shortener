import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { prisma } from '@lucia-auth/adapter-prisma';

import { discord } from '@lucia-auth/oauth/providers';
import { db } from './db';
import { dev } from '$app/environment';

export const auth = lucia({
	env: dev ? "DEV" : "PROD",
	middleware: sveltekit(),
	adapter: prisma(db),

	getUserAttributes: (data) => {
		return {
			discord_username: data.discord_username,
			discord_id: data.discord_id
		};
	}
});

export const discordAuth = discord(auth, {
	clientId: process.env.VITE_DISCORD_CLIENT_ID,
	clientSecret: process.env.VITE_DISCORD_CLIENT_SECRET,
	redirectUri: process.env.VITE_DISCORD_REDIRECT_URI
});

export type Auth = typeof auth;
