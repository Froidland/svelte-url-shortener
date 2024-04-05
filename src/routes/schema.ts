import { z } from 'zod';

export const schema = z.object({
	destination: z.string().url(),
	slug: z.string().max(255).default('')
});
