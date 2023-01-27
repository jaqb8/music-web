<script lang="ts">
	import { Hero, Card } from '$lib/components';
	import LoginForm from './LoginForm.svelte';
	import { submitForm } from '$lib/shared';
	import type { ActionData } from './$types';

	export let form: ActionData;
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
			<LoginForm submitFunction={submitForm} {form} />
		</Card>
	</Hero>
</main>
