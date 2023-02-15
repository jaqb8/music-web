import { redis } from '$lib/server/redis';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, setHeaders }) => {
	const CACHE_KEY = params.id;

	const getAlbum = async (): Promise<SpotifyApi.SingleAlbumResponse> => {
		const cached = await redis.get(CACHE_KEY);

		if (cached) {
			console.log(`Cache ${CACHE_KEY} hit!`);
			const ttl = await redis.ttl(CACHE_KEY);
			setHeaders({ 'cache-control': `max-age=${ttl}` });
			return JSON.parse(cached);
		}

		console.log(`Cache ${CACHE_KEY} miss!`);

		const { body: album, headers } = await locals.spotifyClient.getAlbum(params.id);

		const cacheControl = headers['cache-control'];
		if (cacheControl) {
			setHeaders({
				'cache-control': cacheControl
			});
		}

		await redis.set(album.id, JSON.stringify(album), 'EX', 600);
		return album;
	};

	return {
		album: getAlbum()
	};
};
