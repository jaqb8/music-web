import submitForm from './submitForm';
import { vi } from 'vitest';
import toast from 'svelte-french-toast';
import { loading } from '$lib/stores';

describe('submitLogin', () => {
	it('should toggle loading state', async () => {
		const input = {
			data: new Map([
				['email', 'email'],
				['password', 'password']
			]) as any,
			cancel: vi.fn()
		} as any;

		const loadingSpy = vi.spyOn(loading, 'set');
		const updateMock = vi.fn();

		const action = submitForm(input);

		expect(loadingSpy).toHaveBeenCalledTimes(1);
		expect(loadingSpy).toHaveBeenCalledWith(true);

		await action({ update: updateMock });

		expect(loadingSpy).toHaveBeenCalledTimes(2);
		expect(loadingSpy.mock.calls[1][0]).toBe(false);

		expect(updateMock).toHaveBeenCalledTimes(1);
	});
});
