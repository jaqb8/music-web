<script lang="ts">
	import { register } from 'swiper/element/bundle';
	import '../app.css';
	import { supabaseClient } from '$lib/supabase';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	onMount(() => {
		register();
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

<svelte:head>
	<title>Music Web</title>
	<meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

<Toaster />
<Navbar />
<main>
	<slot />
</main>
<Footer />
