import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import RegisterForm from './RegisterForm.svelte';
import { loading } from '$lib/stores';
import { tick } from 'svelte';

vi.mock('$lib/stores', async () => await vi.importActual('$lib/stores'));
const loadingMocked = vi.mocked(loading);

describe('<RegisterForm />', () => {
	it.each`
		email              | expected
		${'test@test.com'} | ${1}
		${'invalid email'} | ${0}
	`('should call submit function $expected times on submit', async ({ email, expected }) => {
		const submitFunction = vi.fn().mockResolvedValue(() => 'submitted');
		const { getByLabelText, getByText } = render(RegisterForm as any, {
			submitFunction
		});

		const emailField = getByLabelText('Email');
		const passwordField = getByLabelText('Password');
		const submitButton = getByText('register');

		await fireEvent.input(emailField, {
			target: {
				value: email
			}
		});
		await fireEvent.input(passwordField, {
			target: {
				value: '123456'
			}
		});

		await fireEvent.click(submitButton);

		expect(submitFunction).toHaveBeenCalledTimes(expected);
	});

	it('should disable submit button when component is loading', async () => {
		const { getByText } = render(RegisterForm as any);
		const submitButton = getByText('register');

		loadingMocked.set(true);
		await tick();

		expect(submitButton).toBeDisabled();
	});

	it('should enable submit button when component is not loading', async () => {
		const { getByText } = render(RegisterForm as any);
		const submitButton = getByText('register');

		loadingMocked.set(false);
		await tick();

		expect(submitButton).toBeEnabled();
	});
});
