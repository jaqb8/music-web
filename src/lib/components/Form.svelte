<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';

	export let actionName: string;
	export let submitFunction: SubmitFunction | undefined = undefined;
	let submitEvent: Event;

	const formEnhance = (form: HTMLFormElement) => {
		if (submitFunction) {
			enhance(form, submitFunction);
		}
	};
</script>

<form on:submit={(e) => (submitEvent = e)} action="?/{actionName}" method="post" use:formEnhance>
	<slot {submitEvent} />
</form>
