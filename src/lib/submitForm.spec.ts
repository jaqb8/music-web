import { submitForm } from './submitForm';
import { vi } from 'vitest';
import toast from 'svelte-french-toast';

describe('submitLogin', () => {
	it.each`
		email              | password    | expected
		${'test@test.com'} | ${'123456'} | ${0}
		${'test@test.com'} | ${''}       | ${1}
		${''}              | ${'123456'} | ${1}
		${''}              | ${''}       | ${1}
	`(
		'should call cancel function and display error toast $expected times',
		({ email, password, expected }) => {
			const input = {
				data: new Map([
					['email', email],
					['password', password]
				]) as any,
				cancel: vi.fn()
			} as any;
			const toastSpy = vi.spyOn(toast, 'error');

			submitForm(input);

			expect(input.cancel).toHaveBeenCalledTimes(expected);
			expect(toastSpy).toHaveBeenCalledTimes(expected);
		}
	);
});
