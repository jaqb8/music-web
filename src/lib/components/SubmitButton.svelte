<script lang="ts">
	export let style: 'primary' | 'secondary' | 'info' = 'primary';
	export let text = 'Submit';
</script>

<div class="form-control mt-4">
	<button class="btn btn-{style}">{text}</button>
</div>
