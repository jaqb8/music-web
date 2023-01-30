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

<div class="my-10 text-center">
	<h1 class="text-5xl font-bold">Music Web</h1>
</div>

<div class="carousel carousel-center p-5 w-full mb-20">
	{#each albums.items as album, index}
		<div
			id="slide{index}"
			class="carousel-item my-5 mx-10 w-full relative card lg:card-side bg-base-100 shadow-xl"
		>
			<figure><img class="w-96" src={album.images.at(0)?.url} alt="Album" /></figure>
			<div class="card-body">
				<p>{album.album_type.toUpperCase()}</p>
				<h2 class="card-title">{album?.name}</h2>
				<p>{album.artists.map((artist) => artist.name)}</p>
				<div class="card-actions justify-end">
					<button class="btn btn-primary">Listen</button>
				</div>
			</div>
			<div
				class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2 inline-block"
			>
				<a href="#slide{index - 1}" class="btn btn-circle {index === 0 && 'hidden'}">❮</a>
				<a
					href="#slide{index + 1}"
					class="btn btn-circle ml-auto {index === albums.items.length - 1 && 'hidden'}">❯</a
				>
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
