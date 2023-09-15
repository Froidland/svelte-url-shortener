import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const GET = async ({ params }) => {
	const urlData = await db.url.findFirst({
		where: {
			slug: params.slug
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
};
