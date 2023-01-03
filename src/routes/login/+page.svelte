<script lang="ts">
	import type { SubmitFunction } from '$app/forms';
	import toast, { Toaster } from 'svelte-french-toast';
	import type { LoginForm } from '$lib/types';
	import { Hero, Card, Form, FormInput, SubmitButton } from '$lib/components';

	const submitLogin: SubmitFunction = ({ data, cancel }) => {
		const { email, password } = Object.fromEntries(data) as LoginForm;

		if (email.length === 0 || password.length === 0) {
			toast.error('Enter email and password');
			console.log('Login submitFunction');
			cancel();
		}

		return async ({ result, update }) => {
			if (result.type === 'failure' && result.data) {
				toast.error(result.data.error);
			}
			await update();
		};
	};
</script>

<main>
	<Toaster />
	<Hero>
		<div class="text-center lg:text-left">
			<h1 class="text-5xl font-bold">Login</h1>
			<p class="py-6">
				Provifdent cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
				quasi. In deleniti eaque aut repudiandae et a id nisi.
			</p>
		</div>
		<Card>
			<Form actionName="login" submitFunction={submitLogin}>
				<FormInput name="email" inputType="email" />
				<FormInput name="password" inputType="password" />
				<label for="forgot-password" class="label">
					<a href="#!" id="forgot-password" class="label-text-alt link link-hover"
						>Forgot password?</a
					>
				</label>
				<SubmitButton text="login" />
				<label for="link" class="label mt-3">
					<span id="link">
						Don't have an account yet? <a href="/register" class="link link-hover link-primary"
							>Register here!</a
						></span
					>
				</label>
			</Form>
		</Card>
	</Hero>
</main>
