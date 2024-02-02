import { Redis } from 'ioredis';
import { env } from '$env/dynamic/private';

export const urlRedis = new Redis(env.PRIVATE_REDIS_URL, {
	keyPrefix: 'url:',
	reconnectOnError: (err) => {
		if (
			err.message.includes('READONLY') ||
			err.message.includes('NOAUTH') ||
			err.message.includes('LOADING')
		) {
			return 1;
		}

		return false;
	},
	lazyConnect: true
});
