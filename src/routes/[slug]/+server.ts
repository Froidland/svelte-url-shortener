import { db } from '$lib/server/db';
import { clicks, urls } from '$lib/server/db/schema.js';
import { error } from '@sveltejs/kit';
import { and, eq, isNull, sql } from 'drizzle-orm';
import { urlRedis } from '$lib/server/redis';

export async function GET({ params, request }) {
	try {
		const cachedUrl = await urlRedis.get(params.slug);

		if (cachedUrl) {
			db.insert(clicks)
				.values({
					urlSlug: params.slug,
					ip:
						request.headers.get('cf-connecting-ip') ||
						request.headers.get('x-forwarded-for') ||
						null,
					country:
						request.headers.get('cf-ipcountry') || request.headers.get('geoip-country') || null,
					city: request.headers.get('cf-ipcity') || request.headers.get('geoip-city') || null
				})
				.execute()
				.catch(console.error);

			return new Response(null, {
				status: 302,
				headers: {
					Location: cachedUrl
				}
			});
		}
	} catch (error) {
		console.error(error);
	}

	const url = await db.query.urls
		.findFirst({
			where: and(eq(urls.slug, params.slug), isNull(urls.deletedAt))
		})
		.execute();

	if (!url) {
		error(404, {
			message: 'The URL you are looking for does not exist.'
		});
	}

	// Fire and forget, therefore no await
	urlRedis.set(params.slug, url.destination, 'EX', 3600).catch(console.error);

	db.insert(clicks)
		.values({
			urlSlug: params.slug,
			ip: request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || null,
			country: request.headers.get('cf-ipcountry') || request.headers.get('geoip-country') || null,
			city: request.headers.get('cf-ipcity') || request.headers.get('geoip-city') || null
		})
		.execute()
		.catch(console.error);

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.destination
		}
	});
}
