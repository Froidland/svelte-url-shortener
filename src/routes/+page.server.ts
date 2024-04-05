import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { schema } from './schema';
import { generateRandomString } from 'oslo/crypto';
import { db } from '$lib/server/db';
import { urls } from '$lib/server/db/schema';

const slugAlphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const disallowedSlugs = ['api', 'profile'];

export async function load() {
	return {
		form: await superValidate(zod(schema))
	};
}

export const actions = {
	default: async ({ locals, request }) => {
		const form = await superValidate(request, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (!locals.user?.isAllowedCustomSlugs && form.data.slug !== '') {
			return fail(403, {
				form: { ...form, errors: { slug: ['Your account is not allowed to use custom slugs.'] } }
			});
		}

		if (disallowedSlugs.includes(form.data.slug)) {
			return fail(400, {
				form: { ...form, errors: { slug: ['This slug is reserved.'] } }
			});
		}

		const slug = form.data.slug || generateRandomString(12, slugAlphabet);

		try {
			await db.insert(urls).values({
				slug,
				destination: form.data.destination,
				userId: locals.user?.id
			});
		} catch (err) {
			// @ts-expect-error yes yes I know err is of type unknown
			if (err.code === 'ER_DUP_ENTRY') {
				return fail(400, {
					form: { ...form, errors: { slug: ['This slug is already in use.'] } }
				});
			}

			console.log(err);
			return fail(500, { form });
		}

		return message(form, slug);
	}
};
