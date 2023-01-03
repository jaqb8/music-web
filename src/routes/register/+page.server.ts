import type { RegisterForm } from '$lib/types';
import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.session?.user) {
		throw redirect(303, '/');
	}
};

export const actions: Actions = {
	register: async ({ request, locals }) => {
		const { email, password } = Object.fromEntries(await request.formData()) as RegisterForm;

		const { error: err } = await locals.sb.auth.signUp({ email, password });

		if (err) {
			if (err instanceof AuthApiError && err.status === 422) {
				return fail(422, {
					error: 'Invalid email or password'
				});
			}
			return fail(500, {
				error: 'Server error. Please try again later.'
			});
		}

		throw redirect(303, '/');
	}
};
