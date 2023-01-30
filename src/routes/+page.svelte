<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { supabaseClient } from '$lib/supabase';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ albums, session } = data);

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
	<div class="my-10 text-center">
		<h1 class="text-5xl font-bold">Music Web</h1>
	</div>
	<div class="grid grid-cols-3 gap-4 my-10 text-center">
		{#each albums.items as album}
			<div class="card w-96 glass">
				<figure><img src={album.images.at(0)?.url} alt="car!" /></figure>
				<div class="card-body">
					<h2 class="card-title">{album.name}</h2>
					<p>{album.artists.map((artist) => artist.name).join(', ')}</p>
					<div class="card-actions justify-end">
						<button class="btn btn-primary">Learn now!</button>
					</div>
				</div>
			</div>
		{/each}
	</div>
	{#if session}
		<p>Welcome, {session.user.email}!</p>
		<form action="/logout" method="POST" use:enhance={submitLogout}>
			<button type="submit" class="btn btn-primary">Logout</button>
		</form>
	{:else}
		<a href="/login" class="btn btn-primary">Login</a>
		<a href="/register" class="btn btn-primary">Register</a>
	{/if}
</main>
