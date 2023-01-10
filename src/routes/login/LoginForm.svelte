<script lang="ts">
	import { Form, FormInput, SubmitButton } from '$lib/components';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Toaster } from 'svelte-french-toast';

	export let submitFunction: SubmitFunction | undefined = undefined;
</script>

<Toaster />
<Form actionName="login" {submitFunction}>
	<FormInput name="email" type="email" />
	<FormInput name="password" type="password" />
	<label for="forgot-password" class="label">
		<a href="#!" id="forgot-password" class="label-text-alt link link-hover">Forgot password?</a>
	</label>
	<SubmitButton text="login" />
	<label for="link" class="label mt-3">
		<span id="link">
			Don't have an account yet? <a href="/register" class="link link-hover link-primary"
				>Register here!</a
			></span
		>
	</label>
</Form>
