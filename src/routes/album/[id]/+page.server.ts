import { redis } from '$lib/server/redis';
import type { RatingObject } from '$lib/types';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, setHeaders, depends }) => {
	depends('app:album');
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

	const getUserRating = async (): Promise<RatingObject[]> => {
		if (!locals.session) {
			return [];
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
		} catch (err) {
			console.error('getUserRating error:', err);
			throw error(500, {
				message: 'Interal Server Error'
			});
		}
	};

	return {
		album: getAlbum(),
		userRating: getUserRating()
	};
};

export const actions: Actions = {
	addRating: async ({ request, locals, params }) => {
		if (!locals.session) {
			return fail(401, {
				error: 'Unauthorized'
			});
		}

		const rating = Object.fromEntries(await request.formData()).rating as RatingObject['rating'];

		try {
			const { error: supabaseError } = await locals.sb.from('ratings').insert({
				user_id: locals.session.user.id,
				album_id: params.id,
				rating,
				comment: null
			});

			if (supabaseError) {
				throw supabaseError;
			}
		} catch (err) {
			console.error('addRating error', err);
			throw error(500, {
				message: 'Interal Server Error'
			});
		}
	},
	deleteRating: async ({ locals, params }) => {
		if (!locals.session) {
			return fail(401, {
				message: 'Unauthorized'
			});
		}

		const { error: supabaseError } = await locals.sb
			.from('ratings')
			.delete()
			.eq('user_id', locals.session.user.id)
			.eq('album_id', params.id);

		if (supabaseError) {
			console.error('deleteRating', supabaseError);
			throw error(500, {
				message: 'Internal server error'
			});
		}
	},
	addComment: async ({ request, locals, params }) => {
		if (!locals.session) {
			return fail(401, {
				error: 'Unauthorized'
			});
		}
		console.log(request);
		const comment = Object.fromEntries(await request.formData()).comment as RatingObject['comment'];

		const { error: supabaseError } = await locals.sb
			.from('ratings')
			.update({
				comment
			})
			.eq('user_id', locals.session.user.id)
			.eq('album_id', params.id);

		if (supabaseError) {
			console.error('deleteRating', supabaseError);
			throw error(500, {
				message: 'Internal server error'
			});
		}
	}
};
