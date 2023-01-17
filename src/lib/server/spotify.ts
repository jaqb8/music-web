import SpotifyWebApi from 'spotify-web-api-node';
import redis from '$lib/server/redis';
import {
	SPOTIFY_CLIENT_ID,
	SPOTIFY_CLIENT_SECRET,
	SPOTIFY_REDIRECT_URI
} from '$env/static/private';
import dayjs from 'dayjs';

export const TOKEN_KEY = 'spotify_token';

export interface SpotifyTokenResponse {
	access_token: string;
	expires_in: number;
	token_type: string;
	issued_at: string;
	expires_at: string;
}

export class Spotify extends SpotifyWebApi {
	static async createClient(): Promise<Spotify> {
		const api = new Spotify({
			clientId: SPOTIFY_CLIENT_ID,
			clientSecret: SPOTIFY_CLIENT_SECRET,
			redirectUri: SPOTIFY_REDIRECT_URI
		});
		console.log('renew token called from createClient()', api.getAccessToken());
		if (!api.getAccessToken()) {
			await api.renewAccessToken();
		}
		return api;
	}

	async renewAccessToken(): Promise<void> {
		try {
			const response = await this.clientCredentialsGrant();
			const token = {
				...response.body,
				issued_at: dayjs().format(),
				expires_at: dayjs().add(response.body['expires_in'], 'second').format()
			} satisfies SpotifyTokenResponse;
			console.log('renewing token', token);
			await redis.set(TOKEN_KEY, JSON.stringify(token), 'EX', token.expires_in);
			this.setAccessToken(response.body['access_token']);
		} catch (error) {}
	}
}

export const spotifyApi = await Spotify.createClient();
