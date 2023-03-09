<script lang="ts">
	import { Form, FormInput, SubmitButton, Alert } from '$lib/components';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { loading } from '$lib/stores';
	import type { ActionData } from './$types';
	import { page } from '$app/stores';

	export let submitFunction: SubmitFunction | undefined = undefined;
	export let form: ActionData;

	$: emailError = form?.errors?.email?.at(0);
	$: emailValue = form?.data?.email?.toString() ?? '';
	$: passwordError = form?.errors?.password?.at(0);
	$: passwordValue = form?.data?.password?.toString() ?? '';
</script>

<Form actionName="login&redirectTo={$page.url.searchParams.get('redirectTo')}" {submitFunction}>
	{#if form?.error}
		<Alert text={form.error} />
	{/if}
	<FormInput name="email" type="email" value={emailValue} errorMessage={emailError} />
	<FormInput name="password" type="password" value={passwordValue} errorMessage={passwordError} />
	<label for="forgot-password" class="label">
		<a href="#!" id="forgot-password" class="label-text-alt link link-hover">Forgot password?</a>
	</label>
	<SubmitButton text="login" disabled={$loading} />
	<label for="link" class="label mt-3">
		<span id="link">
			Don't have an account yet? <a href="/register" class="link link-hover link-primary"
				>Register here!</a
			></span
		>
	</label>
</Form>
