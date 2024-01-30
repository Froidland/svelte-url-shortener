import { db } from '$lib/server/db';
import { urls } from '$lib/server/db/schema.js';
import { json } from '@sveltejs/kit';
import { generateRandomString } from 'oslo/crypto';

const urlRegex =
	/[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

// TODO: Rate limiting.
export async function POST({ locals, request }) {
	const data = await request.json();
	const user = locals.user;

	const url = data.url;
	const length = Number(data.length || 12);

	if (!url) {
		return json(
			{
				message: 'You must specify a URL to shorten.'
			},
			{
				status: 400
			}
		);
	}

	if (Number.isNaN(length)) {
		return json(
			{
				message: "The value you provided for 'length' is not a number."
			},
			{
				status: 400
			}
		);
	}

	if (!urlRegex.test(url)) {
		return json(
			{
				message: 'The value you provided is not a valid URL.',
				value: url
			},
			{
				status: 400
			}
		);
	}

	/* if (length < 12 && !session) {
		return json(
			{
				message: 'Unregistered users are not allowed to create slugs shorter than 12 characters.'
			},
			{
				status: 401
			}
		);
	} */

	// TODO: Only registered users with a certain flag should be able to generate this type of url.
	//? (This is to avoid running out of slugs too quickly in the case the endpoint is spammed, maybe do some rate limiting too)
	if (length < 12) {
		return json(
			{
				message: 'Slugs shorter than 12 characters are not implemented yet.'
			},
			{
				status: 501
			}
		);
	}

	const slug = generateRandomString(
		length,
		'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
	);

	await db.insert(urls).values({
		slug,
		redirect: url,
		userId: user?.id
	});

	return json(
		{
			slug,
			url
		},
		{
			status: 200
		}
	);
}
