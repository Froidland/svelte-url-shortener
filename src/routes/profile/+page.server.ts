import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { and, desc, eq, isNull, count } from 'drizzle-orm';
import { urls } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = locals.user;
	const limit = Number(url.searchParams.get('limit')) || 10;
	const skip = Number(url.searchParams.get('skip')) || 0;

	if (limit > 100) {
		throw error(400, 'limit can not be greater than 100.');
	}

	if (skip < 0) {
		throw error(400, 'skip can not be less than 0.');
	}

	if (!user) {
		throw redirect(302, '/api/auth/login/discord');
	}

	const urlData = db.query.urls
		.findMany({
			where: and(eq(urls.userId, user.id), isNull(urls.deletedAt)),
			limit,
			offset: skip,
			orderBy: [desc(urls.createdAt)]
		})
		.execute();

	const urlCount = db
		.select({
			count: count()
		})
		.from(urls)
		.execute();

	return {
		urls: urlData,
		total: urlCount,
		limit,
		skip
	};
};
