import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { and, desc, eq, isNull, count, sql } from 'drizzle-orm';
import { clicks, urls } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = locals.user;
	const limit = Number(url.searchParams.get('limit')) || 10;
	const skip = Number(url.searchParams.get('skip')) || 0;

	if (limit > 100) {
		error(400, 'limit can not be greater than 100.');
	}

	if (skip < 0) {
		error(400, 'skip can not be less than 0.');
	}

	if (!user) {
		redirect(302, '/api/auth/login/discord');
	}

	const urlData = db
		.select({
			slug: urls.slug,
			destination: urls.destination,
			createdAt: urls.createdAt,
			clicks:
				sql<number>`(select count(*) from ${clicks} where ${clicks.urlSlug} = ${urls.slug})`.as(
					'clicks'
				)
		})
		.from(urls)
		.where(and(eq(urls.userId, user.id), isNull(urls.deletedAt)))
		.orderBy(desc(urls.createdAt))
		.limit(limit)
		.offset(skip)
		.execute();

	const urlCount = db
		.select({
			count: count()
		})
		.from(urls)
		.where(and(eq(urls.userId, user.id), isNull(urls.deletedAt)))
		.execute();

	return {
		urls: await urlData,
		total: await urlCount,
		limit,
		skip
	};
};
