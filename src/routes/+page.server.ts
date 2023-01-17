import { spotifyApi } from '$lib/server/spotify';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const result = await spotifyApi.getNewReleases();
	return result.body;
};
