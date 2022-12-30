<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import toast, { Toaster } from 'svelte-french-toast';
	import type { LoginForm } from './types';

	const submitLogin: SubmitFunction = ({ data, cancel }) => {
		const { email, password } = Object.fromEntries(data) as LoginForm;

		if (email.length === 0 || password.length === 0) {
			toast.error('Enter email and password');
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
	<h1>Login</h1>
	<form action="?/login" method="POST" class="auth-form" use:enhance={submitLogin}>
		<label for=""> Email </label>
		<input type="email" name="email" />
		<label for=""> Password </label>
		<input type="password" name="password" />
		<button type="submit" class="btn btn-primary" style="margin-top: 10px">Login</button>
	</form>
</main>
