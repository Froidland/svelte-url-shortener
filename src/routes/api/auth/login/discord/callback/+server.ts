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

		const res = await fetch('https://discord.com/api/users/@me', {
			headers: {
				Authorization: `Bearer ${discordTokens.accessToken}`
			}
		});

		if (!res.ok) {
			return new Response(null, {
				status: 500
			});
		}

		const discordUser = (await res.json()) as DiscordUser;

		const existingUser = await db.query.users.findFirst({
			where: eq(users.discordId, discordUser.id)
		});

		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});

			return new Response(null, {
				status: 302,
				headers: {
					Location: '/'
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
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
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

type DiscordUser = {
	id: string;
	username: string;
	avatar: string;
	discriminator: string;
	public_flags: number;
	premium_type: number;
	flags: number;
	banner: string | null;
	accent_color: number;
	global_name: string | null;
	avatar_decoration_data: unknown;
	banner_color: string;
	mfa_enabled: boolean;
	locale: string;
};
