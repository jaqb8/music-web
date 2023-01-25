import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const result = await locals.spotifyClient.getNewReleases();
	return result.body;
};
