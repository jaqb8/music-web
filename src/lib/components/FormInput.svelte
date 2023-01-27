<script lang="ts">
	export let name: string;
	export let type: string;
	export let value: string = '';
	export let errorMessage: string | undefined = undefined;
	export let labelText: string | undefined = undefined;

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
	<label for="name" class="label {!errorMessage ? 'hidden' : ''}">
		<span class="label-text-alt text-error">{errorMessage}</span>
	</label>
</div>
