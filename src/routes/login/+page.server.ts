import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { LoginFormData } from '$lib/types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.session?.user) {
		throw redirect(303, '/');
	}
};

export const actions: Actions = {
	login: async ({ request, locals }) => {
		const { email, password } = Object.fromEntries(await request.formData()) as LoginFormData;

		const { error: err } = await locals.sb.auth.signInWithPassword({
			email,
			password
		});

		if (err) {
			console.log(err);
			if (err instanceof AuthApiError && err.status === 400) {
				return fail(400, {
					error: err.message
				});
			}
			return fail(500, {
				error: 'Internal server error'
			});
		}

		throw redirect(303, '/');
	}
};
