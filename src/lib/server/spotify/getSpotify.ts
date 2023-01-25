import type { SpotifyApi } from './spotifyApi';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { getSpotifyClient } from './getSpotifyClient';
import { error } from '@sveltejs/kit';

dayjs.extend(isSameOrAfter);

/**
 * Validates if spotifyClient is authenticated and returns its instance
 * @returns SpotifyApi instance
 *  */

export async function getSpotify(): Promise<SpotifyApi> {
	const client = await getSpotifyClient();
	if (!client.getAccessToken() || dayjs().isSameOrAfter(dayjs(client.token?.expiresAt))) {
		const result = await client.renewAccessToken();
		result.mapErr((err) => {
			console.error('getSpotify', err);
			throw error(500, 'Something went wrong');
		});
	}

	return client;
}
