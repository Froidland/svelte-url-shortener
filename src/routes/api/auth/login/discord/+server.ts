import { dev } from '$app/environment';
import { discordAuth } from '$lib/server/lucia.js';
import { generateState } from 'arctic';

export async function GET({ cookies }) {
	const state = generateState();
	const url = await discordAuth.createAuthorizationURL(state);

	cookies.set('discord_oauth_state', state, {
		httpOnly: true,
		secure: !dev,
		path: '/',
		maxAge: 60 * 60
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
}
