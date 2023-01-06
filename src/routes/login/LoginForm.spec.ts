import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/svelte';
import LoginForm from './LoginForm.svelte';
import { vi } from 'vitest';

describe('<LoginForm />', () => {
	beforeAll(() => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: vi.fn().mockImplementation((query) => ({
				matches: false,
				media: query,
				onchange: null,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn()
			}))
		});
	});

	it('should call submit function on submit', async () => {
		const submitFunction = vi.fn();
		const { getByLabelText, getByText } = render(LoginForm as any, {
			submitFunction
		});

		const emailField = getByLabelText('Email');
		const passwordField = getByLabelText('Password');
		const submitButton = getByText('login');

		await fireEvent.input(emailField, {
			target: {
				value: 'test@test.com'
			}
		});
		await fireEvent.input(passwordField, {
			target: {
				value: '123456'
			}
		});

		await fireEvent.click(submitButton);

		expect(submitFunction).toHaveBeenCalledTimes(1);
	});
});
