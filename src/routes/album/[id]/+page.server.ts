import { redis } from '$lib/server/redis';
import type { RatingValue } from '$lib/types';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

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

	const getUserRating = async () => {
		if (!locals.session) {
			return;
		}

		try {
			const { data, error: supabaseError } = await locals.sb
				.from('ratings')
				.select()
				.eq('user_id', locals.session.user.id)
				.eq('album_id', params.id);

			if (supabaseError) {
				throw supabaseError;
			}

			return data;
		} catch (error) {
			console.error(error);
		}
	};

	return {
		album: getAlbum(),
		userRating: getUserRating()
	};
};

export const actions: Actions = {
	addRating: async ({ request, locals, params }) => {
		console.log('addRating');
		if (!locals.session?.user) {
			return fail(401, {
				error: 'Unauthorized'
			});
		}

		const rating = (await request.formData()).get('rating') as RatingValue;

		try {
			const { error: supabaseError } = await locals.sb.from('ratings').insert({
				album_id: params.id,
				user_id: locals.session.user.id,
				rating: rating
			});

			if (supabaseError) {
				throw supabaseError;
			}
		} catch (error) {
			console.error(error);
		}
	}
};
