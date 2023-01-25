import { SpotifyApi } from './spotifyApi';
import {
	SPOTIFY_CLIENT_ID,
	SPOTIFY_CLIENT_SECRET,
	SPOTIFY_REDIRECT_URI
} from '$env/static/private';

/**
 * Creates or gets already existing SpotifyApi instance
 * @returns SpotifyApi instance
 */
export const getSpotifyClient = async () =>
	await SpotifyApi.getInstance({
		clientId: SPOTIFY_CLIENT_ID,
		clientSecret: SPOTIFY_CLIENT_SECRET,
		redirectUri: SPOTIFY_REDIRECT_URI
	});
