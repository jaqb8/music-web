<script lang="ts">
	export let style: 'primary' | 'secondary' | 'info' = 'primary';
	export let text = 'Submit';
	export let disabled = false;
</script>

<div class="form-control mt-2">
	<button class="btn btn-{style}" {disabled}>{text}</button>
</div>
