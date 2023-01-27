<script lang="ts">
	import { Form, FormInput, FormCheckbox, SubmitButton, Alert } from '$lib/components';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { loading } from '$lib/stores';
	import type { ActionData } from './$types';

	export let submitFunction: SubmitFunction | undefined = undefined;
	export let form: ActionData;

	$: emailError = form?.errors?.email?.at(0);
	$: emailValue = form?.data?.email.toString() ?? '';
	$: passwordError = form?.errors?.password?.at(0);
	$: passwordConfirmError = form?.errors?.passwordConfirm?.at(0);
	$: termsError = form?.errors?.terms?.at(0);
	$: termsChecked = form?.data?.terms === 'on';
</script>

<Form actionName="register" {submitFunction}>
	{#if form?.error}
		<Alert text={form?.error} />
	{/if}
	<FormInput value={emailValue} name="email" type="email" errorMessage={emailError} />
	<FormInput name="password" type="password" errorMessage={passwordError} />
	<FormInput
		name="passwordConfirm"
		type="password"
		errorMessage={passwordConfirmError}
		labelText="Confirm Password"
	/>
	<FormCheckbox name="terms" checked={termsChecked} errorMessage={termsError} />
	<SubmitButton text="register" disabled={$loading} />
	<label for="link" class="label mt-3">
		<span id="link">
			Already have an account? <a href="/login" class="link link-hover link-primary"
				>Go to login page</a
			></span
		>
	</label>
</Form>
