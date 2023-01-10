<script lang="ts">
	import { Form, FormInput, SubmitButton } from '$lib/components';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Toaster } from 'svelte-french-toast';

	export let submitFunction: SubmitFunction | undefined;
</script>

<Toaster />
<Form actionName="register" {submitFunction}>
	<FormInput name="email" type="email" />
	<FormInput name="password" type="password" />
	<SubmitButton text="register" />
	<label for="link" class="label mt-3">
		<span id="link">
			Already have an account? <a href="/login" class="link link-hover link-primary"
				>Go to login page</a
			></span
		>
	</label>
</Form>
