<script lang="ts">
	import { Form, FormInput, SubmitButton } from '$lib/components';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { loading } from '$lib/stores';

	export let submitFunction: SubmitFunction | undefined = undefined;
</script>

<Form actionName="register" {submitFunction}>
	<FormInput name="email" type="email" />
	<FormInput name="password" type="password" />
	<SubmitButton text="register" disabled={$loading} />
	<label for="link" class="label mt-3">
		<span id="link">
			Already have an account? <a href="/login" class="link link-hover link-primary"
				>Go to login page</a
			></span
		>
	</label>
</Form>
