import { test, expect, Page } from '@playwright/test';

const PASSWORD = 'secret_sauce';
const MISMATCH = 'Username and password do not match any user in this service';

async function login(page: Page, user: string, pass: string) {
  await page.goto('/');
  await page.locator('[data-test="username"]').fill(user);
  await page.locator('[data-test="password"]').fill(pass);
  await page.locator('[data-test="login-button"]').click();
}

test.describe('Login with different credentials', () => {
  const validUsers = ['standard_user', 'problem_user', 'performance_glitch_user', 'error_user', 'visual_user'];

  for (const user of validUsers) {
    test(`valid user "${user}" can log in`, async ({ page }) => {
      await login(page, user, PASSWORD);
      await expect(page).toHaveURL(/inventory\.html/);
    });
  }

  const invalid = [
    { name: 'locked out user', user: 'locked_out_user', pass: PASSWORD, error: 'Sorry, this user has been locked out.' },
    { name: 'wrong password', user: 'standard_user', pass: 'wrong_pass', error: MISMATCH },
    { name: 'unknown user', user: 'nobody', pass: PASSWORD, error: MISMATCH },
    { name: 'empty username', user: '', pass: PASSWORD, error: 'Username is required' },
    { name: 'empty password', user: 'standard_user', pass: '', error: 'Password is required' },
    { name: 'both empty', user: '', pass: '', error: 'Username is required' },
    { name: 'case-sensitive username', user: 'Standard_User', pass: PASSWORD, error: MISMATCH },
  ];

  for (const c of invalid) {
    test(`rejects ${c.name}`, async ({ page }) => {
      await login(page, c.user, c.pass);
      await expect(page.locator('[data-test="error"]')).toContainText(c.error);
      await expect(page).not.toHaveURL(/inventory\.html/);
    });
  }
});
