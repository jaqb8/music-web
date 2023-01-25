import type { SpotifyApi } from './spotifyApi';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { getSpotifyClient } from './getSpotifyClient';

dayjs.extend(isSameOrAfter);

/**
 * Validates if spotifyClient is authenticated and returns its instance
 * @returns SpotifyApi instance
 *  */

export async function getSpotify(): Promise<SpotifyApi> {
	const client = await getSpotifyClient();
	if (!client.getAccessToken() || dayjs().isSameOrAfter(dayjs(client.token?.expiresAt))) {
		client.renewAccessToken();
	}

	return client;
}
