<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { supabaseClient } from '$lib/supabase';
	import type { PageData } from './$types';
	import { Slider } from '$lib/components';

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

<header>
	<div class="flex justify-center">
		<h1 class="text-2xl font-bold mt-8 mb-4">New Releases</h1>
	</div>
</header>

<!-- Section Slider -->
<section id="slider">
	<Slider albums={albums.items} />
</section>

<!-- Section Temp logged in -->
<section id="temp">
	{#if session}
		<p>Welcome, {session.user.email}!</p>
		<form action="/logout" method="POST" use:enhance={submitLogout}>
			<button type="submit" class="btn btn-primary">Logout</button>
		</form>
	{/if}
</section>
