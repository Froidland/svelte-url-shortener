import { db } from '$lib/server/db/index.js';
import { users } from '$lib/server/db/schema.js';
import { discordAuth, lucia } from '$lib/server/lucia.js';
import { OAuth2RequestError } from 'arctic';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';

export async function GET({ url, cookies }) {
	const storedState = cookies.get('discord_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const discordTokens = await discordAuth.validateAuthorizationCode(code);
		const discordUser = await discordAuth.getUser(discordTokens.accessToken);

		const existingUser = await db.query.users.findFirst({
			where: eq(users.discordId, discordUser.id)
		});

		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);

			return new Response(null, {
				status: 302,
				headers: {
					Location: '/profile',
					'Set-Cookie': sessionCookie.serialize()
				}
			});
		}

		const userId = generateId(24);
		await db.insert(users).values({
			id: userId,
			discordId: discordUser.id,
			discordUsername: discordUser.username
		});

		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/profile',
				'Set-Cookie': sessionCookie.serialize()
			}
		});
	} catch (error) {
		console.error(error);

		if (error instanceof OAuth2RequestError) {
			return new Response(null, {
				status: 400
			});
		}

		return new Response(null, {
			status: 500
		});
	}
}
