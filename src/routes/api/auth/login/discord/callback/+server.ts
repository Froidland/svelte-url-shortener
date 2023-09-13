import { auth, discordAuth } from '$lib/server/lucia.js';

export async function GET({ url, cookies, locals }) {
	const storedState = cookies.get('discord_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const { getExistingUser, discordUser, createUser } = await discordAuth.validateCallback(code);

		const getUser = async () => {
			const existingUser = await getExistingUser();

			if (existingUser) {
				return existingUser;
			}

			const user = await createUser({
				attributes: {
					discord_username: discordUser.username,
					discord_id: discordUser.id
				}
			});

			return user;
		};

		const user = await getUser();

		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});

		locals.auth.setSession(session);

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/profile'
			}
		});
		// eslint-disable-next-line
	} catch (error: any) {
		console.error(error);
		//! Apparently there is an error with the OAuthRequestError import from lucia.
		if (error.message === 'OAUTH_REQUEST_FAILED') {
			return new Response(null, {
				status: 400
			});
		}

		return new Response(null, {
			status: 500
		});
	}
}
