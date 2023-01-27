import type { SubmitFunction } from '@sveltejs/kit';
import { loading } from '$lib/stores';

const submitForm: SubmitFunction = () => {
	loading.set(true);

	return async ({ update }) => {
		await update();
		loading.set(false);
	};
};

export default submitForm;
