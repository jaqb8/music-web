import { expect, test } from '@playwright/test';

test.describe('login page', () => {
	test.beforeEach(async ({ context }) => {
		await context.route(/.css/, (route) => route.abort());
	});

	test('login page has correct URL', async ({ page }) => {
		await page.goto('/');

		await page.getByRole('link', { name: 'Sign In' }).click();

		await expect(page).toHaveURL(/.*login/);
	});

	test('browser receives cookie after successful login', async ({ page, context }) => {
		await page.goto('/login');

		await page.locator('input[name="email"]').fill('test@test.com');

		await page.locator('input[name="password"]').fill('123456');

		const responsePromise = page.waitForResponse('http://localhost:4173/login?/login');
		await page.getByRole('button', { name: 'Login' }).click();
		await responsePromise;

		const cookies = await context.cookies();
		expect(cookies.length).toBeGreaterThan(0);
		expect(cookies.find((cookie) => cookie.name.includes('supabase'))).toBeTruthy();
	});
});
