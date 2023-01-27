<script lang="ts">
	import { fly } from 'svelte/transition';

	export let name: string;
	export let errorMessage: string | undefined = undefined;
	export let checked: boolean = false;
	export let submitEvent: Event | undefined = undefined;
</script>

<div class="form-control mt-2">
	<label class="label cursor-pointer justify-start space-x-4">
		<input type="checkbox" {name} class="checkbox checkbox-primary" {checked} />
		<span class="label-text">I accept the terms and conditions</span>
	</label>
	{#key submitEvent}
		<label in:fly={{ x: -10, delay: 150 }} for="terms" class="label {!errorMessage && 'hidden'}">
			<span class="label-text-alt text-error">{errorMessage}</span>
		</label>
	{/key}
</div>
