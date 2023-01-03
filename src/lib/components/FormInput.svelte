<script lang="ts">
	export let name: string;
	export let inputType: string;

	$: labelName = name.charAt(0).toUpperCase() + name.slice(1);
</script>

<div class="form-control">
	<label for={name} class="label">
		<span class="label-text">{labelName}</span>
	</label>
	<input {name} id={name} type={inputType} placeholder={name} class="input input-bordered" />
</div>
