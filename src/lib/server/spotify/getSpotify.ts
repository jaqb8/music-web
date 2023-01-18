import type { SpotifyApi } from './spotifyApi';
import { spotifyClient } from './createClient';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrAfter);

export function getSpotify(): SpotifyApi {
	if (
		!spotifyClient.getAccessToken() ||
		dayjs().isSameOrAfter(dayjs(spotifyClient.token?.expiresAt))
	) {
		spotifyClient.renewAccessToken();
	}

	return spotifyClient;
}
