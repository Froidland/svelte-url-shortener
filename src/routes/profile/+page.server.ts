import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	const session = locals.session;

	if (!session) {
		throw redirect(302, '/');
	}

	const urls = db.url.findMany({
		where: {
			user_id: session.user.userId
		},
		take: 25,
		orderBy: {
			created_at: 'desc'
		}
	});

	return {
		streamed: {
			urls
		}
	};
};
