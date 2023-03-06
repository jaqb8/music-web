<script lang="ts">
	import { fly } from 'svelte/transition';

	export let name: string;
	export let type: string;
	export let value: string = '';
	export let errorMessage: string | undefined = undefined;
	export let labelText: string | undefined = undefined;
	export let submitEvent: Event | undefined = undefined;

	$: labelName = labelText ? labelText : name.charAt(0).toUpperCase() + name.slice(1);
</script>

<div class="form-control">
	<label for={name} class="label">
		<span class="label-text">{labelName}</span>
	</label>
	<input
		{value}
		{type}
		{name}
		id={name}
		class="input {!errorMessage ? 'input-bordered' : 'input-error'}"
	/>
	{#key submitEvent}
		{#if errorMessage}
			<label in:fly={{ x: -10, delay: 150 }} for="name" class="label">
				<span class="label-text-alt text-error">{errorMessage ? errorMessage : ''}</span>
			</label>
		{/if}
	{/key}
</div>
