import { db } from '$lib/server/db';
import { createId } from '@paralleldrive/cuid2';
import { fail } from '@sveltejs/kit';

const urlRegex =
	/[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

export const actions = {
	create: async ({ locals, request }) => {
		const data = await request.formData();

		const url = data.get('url')?.toString().trim();

		if (!url || url.length === 0) {
			return fail(400, {
				url: 'You must specify a URL to shorten.'
			});
		}

		if (!urlRegex.test(url)) {
			return fail(400, {
				url: 'The value you provided is not a valid URL.'
			});
		}

		const session = locals.session;
		const slug = createId();

		await db.url.create({
			data: {
				slug,
				location: url,
				user_id: session?.user.userId
			}
		});

		return {
			slug
		};
	}
};
