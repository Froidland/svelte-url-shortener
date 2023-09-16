import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export async function GET({ params }) {
	const urlData = await db.url.findFirst({
		where: {
			slug: params.slug,
			deleted_at: null
		}
	});

	if (!urlData) {
		throw error(404, {
			message: 'The URL you are looking for does not exist.'
		});
	}

	return new Response(null, {
		status: 302,
		headers: {
			Location: urlData.location
		}
	});
}
