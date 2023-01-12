import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/svelte';
import LoginForm from './LoginForm.svelte';
import { vi } from 'vitest';
import { loading } from '$lib/stores';
import { tick } from 'svelte';

vi.mock('$lib/stores', async () => await vi.importActual('$lib/stores'));
const loadingMocked = vi.mocked(loading);

describe('<LoginForm />', () => {
	it.each`
		email              | expected
		${'test@test.com'} | ${1}
		${'invalid email'} | ${0}
	`('should call submit function $expected times on submit', async ({ email, expected }) => {
		const submitFunction = vi.fn().mockResolvedValue(() => 'submitted');
		const { getByLabelText, getByText } = render(LoginForm as any, {
			submitFunction
		});

		const emailField = getByLabelText('Email');
		const passwordField = getByLabelText('Password');
		const submitButton = getByText('login');

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
		const { getByText } = render(LoginForm as any);
		const submitButton = getByText('login');

		loadingMocked.set(true);
		await tick();

		expect(submitButton).toBeDisabled();
	});

	it('should enable submit button when component is not loading', async () => {
		const { getByText } = render(LoginForm as any);
		const submitButton = getByText('login');

		loadingMocked.set(false);
		await tick();

		expect(submitButton).toBeEnabled();
	});
});
