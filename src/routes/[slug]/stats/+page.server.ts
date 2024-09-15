import { db } from '$lib/server/db/index.js';
import { clicks, urls } from '$lib/server/db/schema.js';
import { error } from '@sveltejs/kit';
import { and, eq, isNull, sql } from 'drizzle-orm';

export async function load({ locals, params }) {
	if (!locals.user) {
		error(401, 'Unauthorized');
	}

	const urlData = await db.query.urls
		.findFirst({
			where: and(eq(urls.slug, params.slug), isNull(urls.deletedAt))
		})
		.execute();

	if (!urlData) {
		error(404, 'Not found');
	}

	if (urlData.userId !== locals.user.id) {
		error(403, 'Forbidden');
	}

	const clicksData = await db
		.select({
			country: clicks.country,
			count: sql<number>`count(*)`.as('count')
		})
		.from(clicks)
		.where(eq(clicks.urlSlug, urlData.slug))
		.groupBy(clicks.country)
		.execute();

	const mappedClicksData: {
		[country: string]: number;
	} = {};

	for (const click of clicksData) {
		mappedClicksData[click.country || 'XX'] = click.count;
	}

	return {
		url: urlData,
		clicks: mappedClicksData
	};
}
