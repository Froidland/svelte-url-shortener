import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = locals.session;

	if (!session) {
		return {
			isLoggedIn: false
		};
	}

	return {
		isLoggedIn: true
	};
};
