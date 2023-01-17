import '$lib/supabase';
import redis from '$lib/server/redis';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';
import { spotifyApi, TOKEN_KEY, type SpotifyTokenResponse } from '$lib/server/spotify';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrAfter);

export const handle: Handle = async ({ event, resolve }) => {
	const { session, supabaseClient } = await getSupabase(event);

	// TODO: store spotifyClient in locals
	event.locals.sb = supabaseClient;
	event.locals.session = session;

	// TODO: refactor this (something like getSupabase)
	const spotifyToken: SpotifyTokenResponse | {} = JSON.parse((await redis.get(TOKEN_KEY)) ?? '{}');
	if ('expires_at' in spotifyToken && dayjs().isSameOrAfter(dayjs(spotifyToken.expires_at))) {
		console.log('renew token called from hook');
		spotifyApi.renewAccessToken();
	}

	return resolve(event);
};
