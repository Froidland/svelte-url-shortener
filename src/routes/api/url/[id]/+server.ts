import { db } from '$lib/server/db.js';
import { error } from '@sveltejs/kit';

export async function DELETE({ locals, params }) {
	const session = locals.session;

	if (!session) {
		throw error(401, {
			message: 'You need to log in to access this endpoint.'
		});
	}

	try {
		await db.url.update({
			where: {
				slug: params.id,
				user_id: session.user.userId
			},
			data: {
				deleted_at: new Date()
			}
		});
	} catch (err) {
		throw error(500, {
			message: 'An unexpected error ocurred while trying to delete the URL, please try again later.'
		});
	}

	return new Response(null, {
		status: 200
	});
}
