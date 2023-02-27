<script lang="ts">
	import { register } from 'swiper/element/bundle';
	import '../app.css';
	import { supabaseClient } from '$lib/supabase';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import type { SubmitFunction } from '$app/forms';

	onMount(() => {
		register();
		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange(() => {
			invalidate('app:session');
		});

		return () => {
			subscription.unsubscribe();
		};
	});

	// TODO - move to Navbar component
	const submitLogout: SubmitFunction = async ({ cancel }) => {
		const { error } = await supabaseClient.auth.signOut();

		if (error) {
			console.error(error);
		} else {
			toast('You have been logged out');
			cancel();
		}

		return async ({ update }) => {
			await update();
		};
	};
</script>

<svelte:head>
	<title>Music Web</title>
	<meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

<Toaster />
<Navbar logoutFunction={submitLogout} />
<main>
	<slot />
</main>
<Footer />
