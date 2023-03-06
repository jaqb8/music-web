import type { SubmitFunction } from '@sveltejs/kit';
import { loading } from '$lib/stores';
import { applyAction } from '$app/forms';

const submitForm: SubmitFunction = () => {
	loading.set(true);

	return async ({ result }) => {
		console.log('result', result);
		await applyAction(result);
		loading.set(false);
	};
};

export default submitForm;
