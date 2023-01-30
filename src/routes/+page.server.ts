import { redis } from '$lib/server/redis';
import type { PageServerLoad } from './$types';

const CACHE_KEY = 'new-releases';

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
	const getNewReleases = async (): Promise<
		SpotifyApi.PagingObject<SpotifyApi.AlbumObjectSimplified>
	> => {
		const cached = await redis.get(CACHE_KEY);

		if (cached) {
			console.log(`Cache ${CACHE_KEY} hit!`);
			const ttl = await redis.ttl(CACHE_KEY);
			setHeaders({ 'cache-control': `max-age=${ttl}` });
			return JSON.parse(cached);
		}

		console.log(`Cache ${CACHE_KEY} miss!`);

		const {
			body: { albums },
			headers
		} = await locals.spotifyClient.getNewReleases({
			country: 'PL',
			limit: 10,
			offset: 1
		});

		const cacheControl = headers['cache-control'];
		if (cacheControl) {
			setHeaders({
				'cache-control': cacheControl
			});
		}

		redis.set(CACHE_KEY, JSON.stringify(albums), 'EX', 600);
		return albums;
	};

	return {
		albums: getNewReleases()
	};
};
