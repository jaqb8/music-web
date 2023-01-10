import type { SubmitFunction } from '@sveltejs/kit';
import toast from 'svelte-french-toast';

export const submitForm: SubmitFunction = ({ data, cancel }) => {
	for (const field of data) {
		if (field[1].length === 0) {
			toast.error(`Enter ${field[0]}`);
			cancel();
			break;
		}
	}

	return async ({ result, update }) => {
		if (result.type === 'failure' && result.data) {
			toast.error(result.data.error);
		}
		await update();
	};
};
