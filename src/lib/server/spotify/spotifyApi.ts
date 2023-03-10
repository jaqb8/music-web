import SpotifyWebApi from 'spotify-web-api-node';
import dayjs from 'dayjs';
import { ok, err, Result } from 'neverthrow';

type ResponseBody = { message: string };

type SpotifyToken = {
	accessToken: string;
	expiresIn: number;
	tokenType: string;
	issuedAt: string;
	expiresAt: string;
};

export class SpotifyApi extends SpotifyWebApi {
	token?: SpotifyToken;
	private static instance: SpotifyApi;

	private constructor(credentials: Record<string, string | undefined>) {
		super(credentials);
	}

	static async getInstance(credentials: Record<string, string | undefined>): Promise<SpotifyApi> {
		if (!SpotifyApi.instance) {
			SpotifyApi.instance = new SpotifyApi(credentials);
			const result = await SpotifyApi.instance.renewAccessToken();
			result
				.map((response) => console.log('SpotifyApi', response))
				.mapErr((err) => console.error('SpotifyApi', err));
		}

		SpotifyApi.instance.setCredentials(credentials);
		return SpotifyApi.instance;
	}

	public async renewAccessToken(): Promise<Result<ResponseBody, Error>> {
		try {
			const {
				body: { access_token, expires_in, token_type }
			} = await this.clientCredentialsGrant();

			const token: SpotifyToken = {
				accessToken: access_token,
				expiresIn: expires_in,
				tokenType: token_type,
				issuedAt: dayjs().format(),
				expiresAt: dayjs().add(expires_in, 'second').format()
			};

			this.setToken(token);
			return ok({
				message: 'Token successfully renewed.'
			});
		} catch (_error) {
			const error = _error instanceof Error ? _error : new Error('Unknown error');
			return err(error);
		}
	}

	private setToken(spotifyToken: SpotifyToken): void {
		this.setAccessToken(spotifyToken.accessToken);
		this.token = spotifyToken;
	}
}
