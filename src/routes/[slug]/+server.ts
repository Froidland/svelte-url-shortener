import { db } from '$lib/server/db';
import { urls } from '$lib/server/db/schema.js';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function GET({ params }) {
	const url = await db.query.urls
		.findFirst({
			where: eq(urls.slug, params.slug)
		})
		.execute();

	if (!url) {
		throw error(404, {
			message: 'The URL you are looking for does not exist.'
		});
	}

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.redirect
		}
	});
}
