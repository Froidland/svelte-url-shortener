import { lucia } from '$lib/server/lucia';

export async function GET({ locals, cookies }) {
	const user = locals.user;

	if (!user) {
		return new Response(null, {
			status: 401
		});
	}

	try {
		await lucia.invalidateSession(user.id);
	} catch (error) {
		console.error(error);

		return new Response(null, {
			status: 500
		});
	}

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/'
		}
	});
}
