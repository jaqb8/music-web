import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z, ZodError } from 'zod';

const registerSchema = z
	.object({
		email: z
			.string({ required_error: 'Email is required' })
			.min(1, { message: 'Email is required' })
			.max(64, { message: 'Email must be less than 64 characters' })
			.email({ message: 'Email must be a valid email address' }),
		password: z
			.string({ required_error: 'Password is required' })
			.min(6, { message: 'Password must be at least 6 characters' })
			.max(64, { message: 'Password must be less than 64 characters' })
			.trim(),
		passwordConfirm: z
			.string({ required_error: 'Password is required' })
			.min(6, { message: 'Password must be at least 6 characters' })
			.max(64, { message: 'Password must be less than 64 characters' })
			.trim(),
		terms: z.enum(['on'], { required_error: 'Terms and Conditions must be accepted' })
	})
	.superRefine(({ password, passwordConfirm }, ctx) => {
		if (passwordConfirm !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Passwords must match',
				path: ['password']
			});
			ctx.addIssue({
				code: 'custom',
				message: 'Passwords must match',
				path: ['passwordConfirm']
			});
		}
	});

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.session?.user) {
		throw redirect(303, '/');
	}
};

export const actions: Actions = {
	register: async ({ request, locals }) => {
		const formData = Object.fromEntries(await request.formData());

		try {
			const { email, password } = registerSchema.parse(formData);
			const { error: supabaseError } = await locals.sb.auth.signUp({ email, password });

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
					error: 'Server error. Please try again later.'
				});
			}
		}
		throw redirect(303, '/');
	}
};
