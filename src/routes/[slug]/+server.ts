import { db } from '$lib/server/db';

export const GET = async ({ params }) => {
	const urlData = await db.url.findFirst({
		where: {
			slug: params.slug
		}
	});

	if (!urlData) {
		return new Response(null, {
			status: 404,
			statusText: 'The url you are trying to access does not exist.'
		});
	}

	return new Response(null, {
		status: 302,
		headers: {
			Location: urlData.location
		}
	});
};
