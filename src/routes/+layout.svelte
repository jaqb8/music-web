<script lang="ts">
	import '../app.css';
	import { supabaseClient } from '$lib/supabase';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';

	onMount(() => {
		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange(() => {
			invalidateAll();
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<Toaster />
<div>
	<div class="navbar bg-primary">
		<a href="/" class="btn btn-ghost normal-case text-xl text-white">Music Web</a>
	</div>
	<slot />
</div>
