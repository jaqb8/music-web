<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { supabaseClient } from '$lib/supabase';
	import type { PageData } from './$types';

	export let data: PageData;

	const submitLogout: SubmitFunction = async ({ cancel }) => {
		const { error } = await supabaseClient.auth.signOut();

		if (error) {
			// TODO - handle error client side (e.g. in toast)
			console.log(error);
		}
		cancel();
	};
</script>

<svelte:head>
	<title>Music Web</title>
	<meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

<main>
	<div class="hero min-h-screen bg-base-200">
		<div class="hero-content text-center">
			<div class="max-w-md">
				<h1 class="text-5xl font-bold">Music Web</h1>
				<p class="py-6">
					Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
					exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
				</p>
				{#if data.session}
					<p>Welcome, {data.session.user.email}!</p>
					<form action="/logout" method="POST" use:enhance={submitLogout}>
						<button type="submit" class="btn btn-primary">Logout</button>
					</form>
				{:else}
					<a href="/login" class="btn btn-primary">Login</a>
					<a href="/register" class="btn btn-primary">Register</a>
				{/if}
			</div>
		</div>
	</div>
</main>
