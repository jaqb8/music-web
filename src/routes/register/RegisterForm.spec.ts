import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import RegisterForm from './RegisterForm.svelte';

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
});
