<script lang="ts">
	export let name: string;
	export let type: string;

	$: labelName = name.charAt(0).toUpperCase() + name.slice(1);
</script>

<div class="form-control">
	<label for={name} class="label">
		<span class="label-text">{labelName}</span>
	</label>
	<input {type} {name} id={name} placeholder={name} class="input input-bordered" />
</div>
