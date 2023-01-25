import { vi } from 'vitest';
import { getSpotify } from './getSpotify';
import * as getSpotifyClient from './getSpotifyClient';
import dayjs from 'dayjs';

vi.mock('$env/static/private', () => {
	return {
		SPOTIFY_CLIENT_ID: '',
		SPOTIFY_CLIENT_SECRET: '',
		SPOTIFY_REDIRECT_URI: ''
	};
});

const renewAccessToken = vi.fn();

describe('getSpotify', () => {
	it('should renew SpotifyApi token when there is no access token at all', async () => {
		vi.spyOn(getSpotifyClient, 'getSpotifyClient').mockResolvedValue({
			getAccessToken: () => false,
			token: {
				expiresAt: dayjs()
			},
			renewAccessToken
		} as any);

		await getSpotify();

		expect(renewAccessToken).toHaveBeenCalledTimes(1);
	});

	it('should renew SpotifyApi token when it is expired', async () => {
		vi.spyOn(getSpotifyClient, 'getSpotifyClient').mockResolvedValue({
			getAccessToken: () => true,
			token: {
				expiresAt: dayjs().subtract(1, 'days')
			},
			renewAccessToken
		} as any);

		await getSpotify();

		expect(renewAccessToken).toHaveBeenCalledTimes(1);
	});

	it('should not renew SpotifyApi token when it is not expired', async () => {
		vi.spyOn(getSpotifyClient, 'getSpotifyClient').mockResolvedValue({
			getAccessToken: () => true,
			token: {
				expiresAt: dayjs().add(1, 'days')
			},
			renewAccessToken
		} as any);

		await getSpotify();

		expect(renewAccessToken).not.toHaveBeenCalled();
	});
});
