import { test as base, createBdd } from 'playwright-bdd';
import { LoginPage, InventoryPage, NavigationPage, CheckoutPage } from '../pages/pages';

export const test = base.extend<{
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  navigationPage: NavigationPage;
  checkoutPage: CheckoutPage;
}>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  navigationPage: async ({ page }, use) => use(new NavigationPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
});

export const { Given, When, Then } = createBdd(test);
