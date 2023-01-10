import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/svelte';
import LoginForm from './LoginForm.svelte';
import { vi } from 'vitest';

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
});
