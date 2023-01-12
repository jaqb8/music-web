import type { SubmitFunction } from '@sveltejs/kit';
import toast from 'svelte-french-toast';
import { loading } from '$lib/stores';

const submitForm: SubmitFunction = ({ data, cancel }) => {
	loading.set(true);

	for (const field of data) {
		if (field[1].length === 0) {
			toast.error(`Enter ${field[0]}`);
			cancel();
			loading.set(false);
			break;
		}
	}

	return async ({ result, update }) => {
		if (result.type === 'failure' && result.data) {
			toast.error(result.data.error);
		}
		await update();
		loading.set(false);
	};
};

export default submitForm;
