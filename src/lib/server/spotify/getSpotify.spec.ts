import { vi, type SpyInstance } from 'vitest';
import { getSpotify } from './getSpotify';
import * as getSpotifyClient from './getSpotifyClient';
import dayjs from 'dayjs';
import { err, ok } from 'neverthrow';
import { error } from '@sveltejs/kit';

vi.mock('$env/static/private', () => {
	return {
		SPOTIFY_CLIENT_ID: '',
		SPOTIFY_CLIENT_SECRET: '',
		SPOTIFY_REDIRECT_URI: ''
	};
});

let renewAccessTokenSpy: SpyInstance;

describe('getSpotify', () => {
	beforeEach(() => {
		renewAccessTokenSpy = vi.fn(() => ok({}));
	});

	it('should renew SpotifyApi token when there is no access token at all', async () => {
		vi.spyOn(getSpotifyClient, 'getSpotifyClient').mockResolvedValue({
			getAccessToken: () => false,
			token: {
				expiresAt: dayjs()
			},
			renewAccessToken: renewAccessTokenSpy
		} as any);

		await getSpotify();

		expect(renewAccessTokenSpy).toHaveBeenCalledTimes(1);
	});

	it('should renew SpotifyApi token when it is expired', async () => {
		vi.spyOn(getSpotifyClient, 'getSpotifyClient').mockResolvedValue({
			getAccessToken: () => true,
			token: {
				expiresAt: dayjs().subtract(1, 'days')
			},
			renewAccessToken: renewAccessTokenSpy
		} as any);

		await getSpotify();

		expect(renewAccessTokenSpy).toHaveBeenCalledTimes(1);
	});

	it('should not renew SpotifyApi token when it is not expired', async () => {
		vi.spyOn(getSpotifyClient, 'getSpotifyClient').mockResolvedValue({
			getAccessToken: () => true,
			token: {
				expiresAt: dayjs().add(1, 'days')
			},
			renewAccessToken: renewAccessTokenSpy
		} as any);

		await getSpotify();

		expect(renewAccessTokenSpy).not.toHaveBeenCalled();
	});

	it('should throw an error when access token renewal failure', async () => {
		vi.spyOn(getSpotifyClient, 'getSpotifyClient').mockResolvedValue({
			getAccessToken: () => false,
			token: {
				expiresAt: dayjs()
			},
			renewAccessToken: vi.fn(() => err({ message: 'TEST renewAccessToken error' }))
		} as any);

		await expect(() => getSpotify()).rejects.toStrictEqual(error(500, 'Something went wrong'));
	});
});
