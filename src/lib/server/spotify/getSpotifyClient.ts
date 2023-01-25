import { SpotifyApi } from './spotifyApi';
import { env } from '$env/dynamic/private';

/**
 * Creates or gets already existing SpotifyApi instance
 * @returns SpotifyApi instance
 */
export const getSpotifyClient = async () =>
	await SpotifyApi.getInstance({
		clientId: env.SPOTIFY_CLIENT_ID,
		clientSecret: env.SPOTIFY_CLIENT_SECRET,
		redirectUri: env.SPOTIFY_REDIRECT_URI
	});
