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
<div class="bg-base-200">
	<div class="navbar bg-primary">
		<div class="flex-none">
			<a href="/" class="btn btn-ghost normal-case text-xl text-white">Music Web</a>
		</div>
		<div class="flex-grow">
			<div class="form-control">
				<input type="text" placeholder="Search" class="input input-bordered" />
			</div>
		</div>
	</div>
	<div class="container mx-auto">
		<slot />
	</div>
</div>
