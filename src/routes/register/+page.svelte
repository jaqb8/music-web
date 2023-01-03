<script lang="ts">
	import type { SubmitFunction } from '$app/forms';
	import { Hero, Card, Form, FormInput, SubmitButton } from '$lib/components';
	import type { RegisterForm } from '$lib/types';
	import toast, { Toaster } from 'svelte-french-toast';

	const submitRegister: SubmitFunction = ({ data, cancel }) => {
		const { email, password } = Object.fromEntries(data) as RegisterForm;

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
	<Hero>
		<div class="text-center lg:text-left">
			<h1 class="text-5xl font-bold">Register</h1>
			<p class="py-6">
				Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
				quasi. In deleniti eaque aut repudiandae et a id nisi.
			</p>
		</div>
		<Card>
			<Form actionName="register" submitFunction={submitRegister}>
				<FormInput name="email" inputType="email" />
				<FormInput name="password" inputType="password" />
				<SubmitButton text="register" />
				<label for="link" class="label mt-3">
					<span id="link">
						Already have an account? <a href="/login" class="link link-hover link-primary"
							>Go to login page</a
						></span
					>
				</label>
			</Form>
		</Card>
	</Hero>
</main>
