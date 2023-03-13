import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z, ZodError } from 'zod';

const loginSchema = z.object({
	email: z
		.string({ required_error: 'Please enter email' })
		.min(1, { message: 'Please enter email' })
		.email({ message: 'Email must be a valid email address' }),
	password: z
		.string({ required_error: 'Please enter password' })
		.min(1, { message: 'Please enter password' })
		.trim()
});

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.session?.user) {
		throw redirect(303, '/');
	}
};

export const actions: Actions = {
	login: async ({ request, locals, url }) => {
		const formData = Object.fromEntries(await request.formData());

		try {
			const { email, password } = loginSchema.parse(formData);
			const { error: supabaseError } = await locals.sb.auth.signInWithPassword({
				email,
				password
			});

			if (supabaseError) {
				throw supabaseError;
			}
		} catch (err) {
			if (err instanceof ZodError) {
				const { fieldErrors: errors } = err.flatten();
				return fail(400, {
					data: formData,
					errors
				});
			} else if (err instanceof AuthApiError && err.status !== 500) {
				return fail(err.status, {
					data: formData,
					error: err.message
				});
			} else {
				console.error(err);
				return fail(500, {
					error: 'Server error. Please try again'
				});
			}
		}

		const location = url.searchParams.get('redirectTo') ?? '/';
		throw redirect(303, location);
	}
};
