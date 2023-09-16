import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, url }) => {
	const session = locals.session;
	const limit = Number(url.searchParams.get('limit')) || 10;
	const skip = Number(url.searchParams.get('skip')) || 0;

	if (limit > 100) {
		throw error(400, 'limit can not be greater than 100.');
	}

	if (skip < 0) {
		throw error(400, 'skip can not be less than 0.');
	}

	if (!session) {
		throw redirect(302, '/api/auth/login/discord');
	}

	const urls = db.url.findMany({
		where: {
			user_id: session.user.userId,
			deleted_at: null
		},
		take: limit,
		skip,
		orderBy: {
			created_at: 'desc'
		}
	});

	const urlCount = db.url.count({
		where: {
			user_id: session.user.userId,
			deleted_at: null
		}
	});

	return {
		urls,
		total: urlCount,
		limit,
		skip
	};
};
