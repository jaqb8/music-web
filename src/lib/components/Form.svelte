<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';

	export let actionName: string;
	export let submitFunction: SubmitFunction | undefined = undefined;

	const formEnhance = (form: HTMLFormElement) => {
		submitFunction && enhance(form, submitFunction);
	};
</script>

<form action="?/{actionName}" method="post" use:formEnhance>
	<slot />
</form>
