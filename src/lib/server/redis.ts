import { Redis } from 'ioredis';
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from '$env/static/private';

export default REDIS_HOST
	? new Redis({
			host: REDIS_HOST,
			port: Number(REDIS_PORT),
			password: REDIS_PASSWORD
	  })
	: new Redis();
