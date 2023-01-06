<script lang="ts">
	export let name: string;
	export let type: string;
	export let value: string;

	$: labelName = name.charAt(0).toUpperCase() + name.slice(1);

	const typeAction = (node: HTMLInputElement) => {
		node.type = type;
	};
</script>

<div class="form-control">
	<label for={name} class="label">
		<span class="label-text">{labelName}</span>
	</label>
	<input
		use:typeAction
		bind:value
		{name}
		id={name}
		placeholder={name}
		class="input input-bordered"
	/>
</div>
