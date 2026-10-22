import { Page, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { PDFParse } from 'pdf-parse';
import { loginLocators, inventoryLocators, menuLocators, pageModels, bugLocators, checkoutLocators } from '../models/locators';
import type { CheckoutItem, CheckoutInfo, CheckoutTotals } from '../data/testData';

const SHORT = { timeout: 3000 };

export class NavigationPage {
  private readonly menu;
  private readonly inventory;
  private readonly models;
  private readonly bugs;

  constructor(private readonly page: Page) {
    this.bugs = bugLocators(page);
    this.menu = menuLocators(page);
    this.inventory = inventoryLocators(page);
    this.models = pageModels(page);
  }

  async openMenuOption(option: string) {
    const target = this.menu.options[option];
    if (!target) throw new Error(`Unknown menu option "${option}"`);
    const inSubmenu = ['Lazy Load', 'Spinner', 'Slider'].includes(option);
    const quick = { timeout: 3000 };
    // The whole sequence is retried from scratch if the menu closes underneath it.
    await expect(async () => {
      if ((await this.menu.menuPanel.getAttribute('aria-hidden')) !== 'false') await this.menu.menuButton.click(quick);
      await expect(this.menu.menuPanel).toHaveAttribute('aria-hidden', 'false', quick);
      if (inSubmenu) {
        if ((await this.menu.dynamicCatalog.getAttribute('aria-expanded')) !== 'true') await this.menu.dynamicCatalog.click(quick);
        await expect(this.menu.dynamicCatalogSubmenu).toBeVisible(quick);
      }
      await target.click(quick);
    }).toPass({ timeout: 30_000 });
  }

  async expectNoCodeText(field: string, text: string) {
    const texts = await this.bugs.inventoryTexts[field].allTextContents();
    expect(texts.filter(x => x.includes(text)), `${field} containing "${text}"`).toEqual([]);
  }

  async expectNoDuplicateLazyItems() {
    await expect(this.bugs.firstLazyItemName).toBeVisible();
    const names = (await this.bugs.lazyItemNames.allTextContents()).map(n => n.replace(/\s*\((XS|S|M|L|XL|XXL)\)$/, ''));
    expect(names.filter((n, i) => names.indexOf(n) !== i), 'repeated items').toEqual([]);
  }

  async expectLazyLoadStopsGrowing() {
    await expect(this.bugs.firstLazyItemName).toBeVisible();
    const before = await this.bugs.lazyItemNames.count();
    for (let i = 0; i < 3; i++) {
      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await this.page.waitForTimeout(1000);
    }
    expect(await this.bugs.lazyItemNames.count(), 'item count after scrolling').toBe(before);
  }

  async expectLazyItemOpensDetails() {
    await this.bugs.firstLazyItemName.click();
    await expect(this.page).toHaveURL(/inventory-item\.html/, SHORT);
  }

  async expectAddToCartOn(pageName: string) {
    const button = this.bugs.catalogContainers[pageName].getByRole('button', { name: /add to cart/i });
    await expect(button.first()).toBeVisible(SHORT);
  }

  async openProduct(name: string) {
    await this.inventory.productName(name).click();
  }

  async expectPage(name: string) {
    const model = this.models[name];
    if (!model) throw new Error(`Unknown page "${name}"`);
    await expect(this.page).toHaveURL(model.url);
    if (model.title) await expect(model.elements['title']).toHaveText(model.title);
  }

  async expectElements(name: string, elements: string) {
    const model = this.models[name];
    if (!model) throw new Error(`Unknown page "${name}"`);
    for (const key of elements.split(',').map(e => e.trim()).filter(Boolean)) {
      const locator = model.elements[key];
      if (!locator) throw new Error(`Unknown element "${key}" on page "${name}"`);
      await expect(locator, `${name}: ${key}`).toBeVisible();
    }
  }
}

export class CheckoutPage {
  private readonly el;
  private pdfText = '';

  constructor(private readonly page: Page) {
    this.el = checkoutLocators(page);
  }

  async openCart() {
    await this.el.cartLink.click();
    await expect(this.page).toHaveURL(/cart\.html/);
    await expect(this.el.title).toHaveText('Your Cart');
  }

  async expectCartItems(items: CheckoutItem[]) {
    await expect(this.el.itemNames).toHaveText(items.map(i => i.name));
    await expect(this.el.itemPrices).toHaveText(items.map(i => i.price));
    await expect(this.el.itemQuantities).toHaveText(items.map(() => '1'));
    await expect(this.el.removeButtons).toHaveCount(items.length);
    await expect(this.el.continueShopping).toBeVisible();
    await expect(this.el.checkout).toBeVisible();
  }

  async startCheckout() {
    await this.el.checkout.click();
    await expect(this.page).toHaveURL(/checkout-step-one\.html/);
    await expect(this.el.title).toHaveText('Checkout: Your Information');
    for (const field of [this.el.firstName, this.el.lastName, this.el.postalCode, this.el.cancel, this.el.continue]) {
      await expect(field).toBeVisible();
    }
  }

  async fillFormAndContinue(info: CheckoutInfo) {
    await this.el.firstName.fill(info.firstName);
    await this.el.lastName.fill(info.lastName);
    await this.el.postalCode.fill(info.postalCode);
    await this.el.continue.click();
  }

  async expectFormError(message: string) {
    await expect(this.el.error).toContainText(message);
    await expect(this.page).toHaveURL(/checkout-step-one\.html/);
  }

  async expectBlockedOnInfoPage() {
    await expect(this.el.error, 'invalid details should show a validation error').toBeVisible({ timeout: 3000 });
    await expect(this.page).toHaveURL(/checkout-step-one\.html/);
  }

  async expectOverview(items: CheckoutItem[], totals: CheckoutTotals) {
    await expect(this.page).toHaveURL(/checkout-step-two\.html/);
    await expect(this.el.title).toHaveText('Checkout: Overview');
    await expect(this.el.itemNames).toHaveText(items.map(i => i.name));
    await expect(this.el.itemPrices).toHaveText(items.map(i => i.price));
    await expect(this.el.paymentInfo).toHaveText('SauceCard #31337');
    await expect(this.el.shippingInfo).toHaveText('Free Pony Express Delivery!');
    await expect(this.el.subtotal).toHaveText(`Item total: ${totals.subtotal}`);
    await expect(this.el.tax).toHaveText(`Tax: ${totals.tax}`);
    await expect(this.el.total).toHaveText(`Total: ${totals.total}`);
    await expect(this.el.finish).toBeVisible();
  }

  async finish() {
    await this.el.finish.click();
  }

  async expectConfirmation() {
    await expect(this.page).toHaveURL(/checkout-complete\.html/);
    await expect(this.el.title).toHaveText('Checkout: Complete!');
    await expect(this.el.ponyImage).toBeVisible();
    await expect(this.el.completeText).toContainText('Your order has been dispatched');
    await expect(this.el.backHome).toBeVisible();
    await expect(this.el.generatePdf).toBeVisible();
  }

  async generatePdf() {
    const [download] = await Promise.all([this.page.waitForEvent('download'), this.el.generatePdf.click()]);
    expect(download.suggestedFilename()).toMatch(/^swag-labs-order-.*\.pdf$/);
    const file = await download.path();
    const parser = new PDFParse({ data: readFileSync(file) });
    this.pdfText = (await parser.getText()).text;
    await parser.destroy();
  }

  expectPdfContains(info: CheckoutInfo, items: CheckoutItem[], totals: CheckoutTotals) {
    const expected = [
      'Order Receipt',
      `${info.firstName} ${info.lastName}`,
      info.postalCode,
      ...items.flatMap(i => [i.name, i.price]),
      totals.subtotal,
      totals.tax,
      totals.total,
    ];
    for (const text of expected) expect(this.pdfText, `PDF should contain "${text}"`).toContain(text);
  }
}

export class LoginPage {
  private readonly el;

  constructor(private readonly page: Page) {
    this.el = loginLocators(page);
  }

  async open() {
    await this.page.goto('/');
  }

  async login(user: string, pass: string) {
    await this.el.username.fill(user);
    await this.el.password.fill(pass);
    await this.el.loginButton.click();
  }

  async expectVisible() {
    await expect(this.el.loginButton).toBeVisible();
  }

  async expectError(message: string) {
    await expect(this.el.error).toContainText(message);
    await expect(this.page).not.toHaveURL(InventoryPage.urlPattern);
  }
}

const sortValues: Record<string, string> = {
  'Name (A to Z)': 'az',
  'Name (Z to A)': 'za',
  'Price (low to high)': 'lohi',
  'Price (high to low)': 'hilo',
};

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export class InventoryPage {
  static readonly urlPattern = /inventory\.html/;
  private readonly el;

  constructor(private readonly page: Page) {
    this.el = inventoryLocators(page);
  }

  async addToCart(item: string) {
    await this.el.addToCartButton(slug(item)).click();
  }

  async removeFromCart(item: string) {
    await this.el.removeButton(slug(item)).click();
  }

  async sortBy(option: string) {
    await this.el.sortDropdown.selectOption(sortValues[option]);
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(InventoryPage.urlPattern);
    await expect(this.el.title).toHaveText('Products');
  }

  async expectCartCount(count: string) {
    await expect(this.el.cartBadge).toHaveText(count);
  }

  async expectPricesAscending() {
    const prices = (await this.el.itemPrices.allTextContents()).map(p => parseFloat(p.replace('$', '')));
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  }

  async expectNamesDescending() {
    const names = await this.el.itemNames.allTextContents();
    expect(names).toEqual([...names].sort().reverse());
  }
}
