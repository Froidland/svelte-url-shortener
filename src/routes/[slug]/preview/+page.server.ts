import { db } from '$lib/server/db';
import { urls } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function load({ params }) {
	let url;
	try {
		url = await db.query.urls
			.findFirst({
				where: eq(urls.slug, params.slug)
			})
			.execute();
	} catch (err) {
		console.log(err);

		error(500, {
			message: 'An error occurred while trying to fetch the URL.'
		});
	}

	if (!url) {
		error(404, {
			message: 'The URL you are looking for does not exist.'
		});
	}

	return {
		url
	};
}
