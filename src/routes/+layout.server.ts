import type { LayoutServerLoad } from './$types';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';

export const load: LayoutServerLoad = async (event) => {
	event.depends('app:session');
	return {
		session: await getServerSession(event)
	};
};
