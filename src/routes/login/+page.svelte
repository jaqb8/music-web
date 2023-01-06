<script lang="ts">
	import { Hero, Card } from '$lib/components';
	import LoginForm from './LoginForm.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { LoginFormData } from '$lib/types';
	import toast from 'svelte-french-toast';

	const submitLogin: SubmitFunction = ({ data, cancel }) => {
		const { email, password } = Object.fromEntries(data) as LoginFormData;

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
	<Hero>
		<div class="text-center lg:text-left">
			<h1 class="text-5xl font-bold">Login</h1>
			<p class="py-6">
				Provifdent cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
				quasi. In deleniti eaque aut repudiandae et a id nisi.
			</p>
		</div>
		<Card>
			<LoginForm submitFunction={submitLogin} />
		</Card>
	</Hero>
</main>
