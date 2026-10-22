import { Given, When, Then } from './fixtures';
import { getTestCase, getCheckout } from '../data/testData';

When('I add the items of test case {string} to the cart', async ({ inventoryPage }, id: string) => {
  const { items } = getCheckout(id);
  for (const item of items) await inventoryPage.addToCart(item.name);
  await inventoryPage.expectCartCount(String(items.length));
});

When('I open the cart of test case {string}', async ({ checkoutPage }, id: string) => {
  await checkoutPage.openCart();
  await checkoutPage.expectCartItems(getCheckout(id).items);
});

When('I start the checkout', async ({ checkoutPage }) => {
  await checkoutPage.startCheckout();
});

When('I fill the checkout form of test case {string} and continue', async ({ checkoutPage }, id: string) => {
  await checkoutPage.fillFormAndContinue(getCheckout(id).info);
});

Then('I should see the checkout error of test case {string}', async ({ checkoutPage }, id: string) => {
  await checkoutPage.expectFormError(getCheckout(id).error!);
});

Then('I should not be able to proceed with the invalid details', async ({ checkoutPage }) => {
  await checkoutPage.expectBlockedOnInfoPage();
});

Then('I should see the order overview of test case {string}', async ({ checkoutPage }, id: string) => {
  const { items, totals } = getCheckout(id);
  await checkoutPage.expectOverview(items, totals);
});

When('I finish the order', async ({ checkoutPage }) => {
  await checkoutPage.finish();
});

Then('I should see the order confirmation', async ({ checkoutPage }) => {
  await checkoutPage.expectConfirmation();
});

When('I generate the PDF order', async ({ checkoutPage }) => {
  await checkoutPage.generatePdf();
});

Then('the PDF should contain the details of test case {string}', async ({ checkoutPage }, id: string) => {
  const { info, items, totals } = getCheckout(id);
  checkoutPage.expectPdfContains(info, items, totals);
});

Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.open();
});

When('I login with the credentials of test case {string}', async ({ loginPage }, id: string) => {
  const { username, password } = getTestCase(id);
  await loginPage.login(username, password);
});

Then('I should be on the products page', async ({ inventoryPage }) => {
  await inventoryPage.expectLoaded();
});

When('I perform the action of test case {string}', async ({ inventoryPage, navigationPage }, id: string) => {
  const { action } = getTestCase(id);
  if (!action) throw new Error(`Test case "${id}" has no action`);
  switch (action.type) {
    case 'add to cart':
      return inventoryPage.addToCart(action.item);
    case 'remove from cart':
      return inventoryPage.removeFromCart(action.item);
    case 'sort products by':
      return inventoryPage.sortBy(action.item);
    case 'open menu option':
      return navigationPage.openMenuOption(action.item);
    case 'open product':
      return navigationPage.openProduct(action.item);
    default:
      throw new Error(`Unknown action type "${action.type}" in test case "${id}"`);
  }
});

Then('I should see the expected result of test case {string}', async ({ loginPage, inventoryPage, navigationPage }, id: string) => {
  const { expected } = getTestCase(id);
  switch (expected.type) {
    case 'error':
      return loginPage.expectError(expected.value!);
    case 'cart count':
      return inventoryPage.expectCartCount(expected.value!);
    case 'prices ascending':
      return inventoryPage.expectPricesAscending();
    case 'names descending':
      return inventoryPage.expectNamesDescending();
    case 'no code text':
      return navigationPage.expectNoCodeText(expected.field!, expected.value!);
    case 'no duplicate lazy items':
      return navigationPage.expectNoDuplicateLazyItems();
    case 'lazy load stops growing':
      return navigationPage.expectLazyLoadStopsGrowing();
    case 'lazy item opens details':
      return navigationPage.expectLazyItemOpensDetails();
    case 'add to cart button':
      return navigationPage.expectAddToCartOn(expected.page!);
    case 'page':
      await navigationPage.expectPage(expected.page!);
      return navigationPage.expectElements(expected.page!, (expected.elements ?? []).join(','));
    default:
      throw new Error(`Unknown expected type "${expected.type}" in test case "${id}"`);
  }
});
