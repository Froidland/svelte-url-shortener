import { lucia } from '$lib/server/lucia';
import { urlRedis } from '$lib/server/redis';
import type { Handle, RequestEvent } from '@sveltejs/kit';

urlRedis.connect();

export const handle: Handle = async ({ event, resolve }) => {
	await handleAuth(event);
	return resolve(event);
};

async function handleAuth(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
	const sessionId = event.cookies.get(lucia.sessionCookieName);

	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return;
	}

	let session, user;
	try {
		({ session, user } = await lucia.validateSession(sessionId));
	} catch (err) {
		event.locals.user = null;
		event.locals.session = null;

		return;
	}

	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);

		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}

	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();

		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}

	event.locals.user = user;
	event.locals.session = session;
	return;
}
