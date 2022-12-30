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
	<title>Supabase + SvelteKit</title>
	<meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

<main>
	<h1>Music Web</h1>
	{#if data.session}
		<p>Welcome, {data.session.user.email}!</p>
		<form action="/logout" method="POST" use:enhance={submitLogout}>
			<button type="submit" class="btn btn-primary">Logout</button>
		</form>
	{:else}
		<a href="/register" class="button">Login</a>
		<a href="/register" class="button">Register</a>
	{/if}
</main>
