<script lang="ts">
	import { Hero, Card } from '$lib/components';
	import RegisterForm from './RegisterForm.svelte';
	import { submitForm } from '$lib/submitForm';
</script>

<main>
	<Hero>
		<div class="text-center lg:text-left">
			<h1 class="text-5xl font-bold">Register</h1>
			<p class="py-6">
				Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
				quasi. In deleniti eaque aut repudiandae et a id nisi.
			</p>
		</div>
		<Card>
			<RegisterForm submitFunction={submitForm} />
		</Card>
	</Hero>
</main>
