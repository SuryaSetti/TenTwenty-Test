import { Given, When, Then } from './fixtures';
import { getTestCase, getCheckout } from '../data/testData';

When('I add the items of test case {string} to the cart', async ({ inventoryPage, snap }, id: string) => {
  const { items } = getCheckout(id);
  for (const item of items) await inventoryPage.addToCart(item.name);
  await inventoryPage.expectCartCount(String(items.length));
  await snap('items added to cart');
});

When('I open the cart of test case {string}', async ({ checkoutPage, snap }, id: string) => {
  await checkoutPage.openCart();
  await checkoutPage.expectCartItems(getCheckout(id).items);
  await snap('cart');
});

When('I start the checkout', async ({ checkoutPage, snap }) => {
  await checkoutPage.startCheckout();
  await snap('checkout started');
});

When('I fill the checkout form of test case {string} and continue', async ({ checkoutPage, snap }, id: string) => {
  await checkoutPage.fillFormAndContinue(getCheckout(id).info);
  await snap('checkout form submitted');
});

Then('I should see the checkout error of test case {string}', async ({ checkoutPage, snap }, id: string) => {
  await checkoutPage.expectFormError(getCheckout(id).error!);
  await snap('checkout error');
});

Then('I should not be able to proceed with the invalid details', async ({ checkoutPage, snap }) => {
  await checkoutPage.expectBlockedOnInfoPage();
  await snap('blocked on info page');
});

Then('I should see the order overview of test case {string}', async ({ checkoutPage, snap }, id: string) => {
  const { items, totals } = getCheckout(id);
  await checkoutPage.expectOverview(items, totals);
  await snap('order overview');
});

When('I finish the order', async ({ checkoutPage, snap }) => {
  await checkoutPage.finish();
  await snap('order finished');
});

Then('I should see the order confirmation', async ({ checkoutPage, snap }) => {
  await checkoutPage.expectConfirmation();
  await snap('order confirmation');
});

When('I generate the PDF order', async ({ checkoutPage, snap }) => {
  await checkoutPage.generatePdf();
  await snap('pdf generated');
});

Then('the PDF should contain the details of test case {string}', async ({ checkoutPage, snap }, id: string) => {
  const { info, items, totals } = getCheckout(id);
  checkoutPage.expectPdfContains(info, items, totals);
  await snap('pdf verified');
});

Given('I am on the login page', async ({ loginPage, snap }) => {
  await loginPage.open();
  await snap('login page');
});

When('I login with the credentials of test case {string}', async ({ loginPage, snap }, id: string) => {
  const { username, password } = getTestCase(id);
  await loginPage.login(username, password);
  await snap('after login');
});

Then('I should be on the products page', async ({ inventoryPage, snap }) => {
  await inventoryPage.expectLoaded();
  await snap('products page');
});

When('I perform the action of test case {string}', async ({ inventoryPage, navigationPage, snap }, id: string) => {
  const { action } = getTestCase(id);
  if (!action) throw new Error(`Test case "${id}" has no action`);
  switch (action.type) {
    case 'add to cart':
      await inventoryPage.addToCart(action.item);
      break;
    case 'remove from cart':
      await inventoryPage.removeFromCart(action.item);
      break;
    case 'sort products by':
      await inventoryPage.sortBy(action.item);
      break;
    case 'open menu option':
      await navigationPage.openMenuOption(action.item);
      break;
    case 'open product':
      await navigationPage.openProduct(action.item);
      break;
    default:
      throw new Error(`Unknown action type "${action.type}" in test case "${id}"`);
  }
  await snap(`action: ${action.type}`);
});

Then('I should see the expected result of test case {string}', async ({ loginPage, inventoryPage, navigationPage, snap }, id: string) => {
  const { expected } = getTestCase(id);
  switch (expected.type) {
    case 'error':
      await loginPage.expectError(expected.value!);
      break;
    case 'cart count':
      await inventoryPage.expectCartCount(expected.value!);
      break;
    case 'prices ascending':
      await inventoryPage.expectPricesAscending();
      break;
    case 'names descending':
      await inventoryPage.expectNamesDescending();
      break;
    case 'no code text':
      await navigationPage.expectNoCodeText(expected.field!, expected.value!);
      break;
    case 'no duplicate lazy items':
      await navigationPage.expectNoDuplicateLazyItems();
      break;
    case 'lazy load stops growing':
      await navigationPage.expectLazyLoadStopsGrowing();
      break;
    case 'lazy item opens details':
      await navigationPage.expectLazyItemOpensDetails();
      break;
    case 'add to cart button':
      await navigationPage.expectAddToCartOn(expected.page!);
      break;
    case 'page':
      await navigationPage.expectPage(expected.page!);
      await navigationPage.expectElements(expected.page!, (expected.elements ?? []).join(','));
      break;
    default:
      throw new Error(`Unknown expected type "${expected.type}" in test case "${id}"`);
  }
  await snap(`expected: ${expected.type}`);
});