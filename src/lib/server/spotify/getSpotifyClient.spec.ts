import { vi, type SpyInstance } from 'vitest';
import { getSpotifyClient } from './getSpotifyClient';
import { SpotifyApi } from './spotifyApi';
import { ok } from 'neverthrow';

vi.mock('$env/dynamic/private', () => {
	return {
		env: {
			SPOTIFY_CLIENT_ID: '',
			SPOTIFY_CLIENT_SECRET: '',
			SPOTIFY_REDIRECT_URI: ''
		}
	};
});

let renewAccessTokenSpy: SpyInstance;

describe('getSpotifyClient', () => {
	beforeEach(() => {
		renewAccessTokenSpy = vi.spyOn(SpotifyApi.prototype, 'renewAccessToken').mockResolvedValue(
			ok({
				message: 'TEST'
			})
		);
	});

	afterEach(() => {
		(SpotifyApi as any)['instance'] = null;
	});

	it('should return same instance of SpotifyAPI', async () => {
		const instance1 = await getSpotifyClient();
		const instance2 = await getSpotifyClient();

		expect(instance1).toBeInstanceOf(SpotifyApi);
		expect(instance2).toBeInstanceOf(SpotifyApi);
		expect(instance1).toStrictEqual(instance2);
	});

	it('should call renewAccessToken only once when creating multiple SpotifyApi instances', async () => {
		const getInstanceSpy = vi.spyOn(SpotifyApi, 'getInstance');

		for (const _ of Array.from({ length: 3 })) {
			await getSpotifyClient();
		}

		expect(getInstanceSpy).toHaveBeenCalledTimes(3);
		expect(renewAccessTokenSpy).toHaveBeenCalledTimes(1);
	});
});
