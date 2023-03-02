// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import type { Session } from '@supabase/supabase-js';
import type { SpotifyClient } from '$lib/server/spotify';

declare global {
	declare namespace App {
		// interface Error {}
		interface Locals {
			sb: TypedSupabaseClient;
			session: Session | null;
			spotifyClient: SpotifyClient;
		}
		interface Supabase {
			Database: import('$lib/types').Database;
			SchemaName: 'public';
		}
		interface PageData {
			session: import('@supabase/supabase-js').Session | null;
		}
		// interface Platform {}
	}
	declare namespace svelteHTML {
		interface HTMLAttributes<T> {
			'on:outclick'?: (event: CustomEvent<T>) => void;
		}
	}
}
