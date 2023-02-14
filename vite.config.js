import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	test: {
		deps: {
			inline: ['@sveltejs/kit']
		},
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom',
		globals: true,
		mockReset: true,
		clearMocks: true,
		restoreMocks: true
	}
};

export default config;
