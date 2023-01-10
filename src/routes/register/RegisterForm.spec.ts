import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import RegisterForm from './RegisterForm.svelte';

vi.mock("('$app/forms').enhance", async () => {
	const mod = await vi.importActual<any>("('$app/forms').enhance");
	return {
		...mod,
		fallback_callback: vi.fn(() => console.log(111))
		// enhance: vi.fn(() => true)
	};
});

describe('<RegisterForm />', () => {
	it.each`
		email              | expected
		${'test@test.com'} | ${1}
		${'invalid email'} | ${0}
	`('should call submit function $expected times on submit', async ({ email, expected }) => {
		const submitFunction = vi.fn();
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
