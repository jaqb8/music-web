import '$lib/supabase';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { getSpotify } from '$lib/server/spotify';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const { session, supabaseClient } = await getSupabase(event);

	event.locals.sb = supabaseClient;
	event.locals.session = session;

	const spotifyClient = await getSpotify();

	event.locals.spotifyClient = spotifyClient;

	return resolve(event);
};
