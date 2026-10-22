import { Page, Locator } from '@playwright/test';

export const loginLocators = (page: Page) => ({
  username: page.locator('[data-test="username"]'),
  password: page.locator('[data-test="password"]'),
  loginButton: page.locator('[data-test="login-button"]'),
  error: page.locator('[data-test="error"]'),
});

export const inventoryLocators = (page: Page) => ({
  title: page.locator('[data-test="title"]'),
  sortDropdown: page.locator('[data-test="product-sort-container"]'),
  itemNames: page.locator('[data-test="inventory-item-name"]'),
  itemPrices: page.locator('[data-test="inventory-item-price"]'),
  cartBadge: page.locator('[data-test="shopping-cart-badge"]'),
  addToCartButton: (slug: string) => page.locator(`[data-test="add-to-cart-${slug}"]`),
  removeButton: (slug: string) => page.locator(`[data-test="remove-${slug}"]`),
  productName: (name: string) => page.locator('[data-test="inventory-item-name"]', { hasText: name }),
});

export const menuLocators = (page: Page) => ({
  menuButton: page.locator('#react-burger-menu-btn'),
  menuPanel: page.locator('.bm-menu-wrap'),
  dynamicCatalog: page.locator('[data-test="dynamic-catalog-sidebar-link"]'),
  dynamicCatalogSubmenu: page.locator('[data-test="dynamic-catalog-submenu"]'),
  options: {
    'All Items': page.locator('[data-test="inventory-sidebar-link"]'),
    'Lazy Load': page.locator('[data-test="dynamic-catalog-lazy-load-link"]'),
    'Spinner': page.locator('[data-test="dynamic-catalog-spinner-link"]'),
    'Slider': page.locator('[data-test="dynamic-catalog-slider-link"]'),
    'About': page.locator('[data-test="about-sidebar-link"]'),
    'Logout': page.locator('[data-test="logout-sidebar-link"]'),
    'Reset App State': page.locator('[data-test="reset-sidebar-link"]'),
  } as Record<string, Locator>,
});

export const bugLocators = (page: Page) => ({
  inventoryTexts: {
    name: page.locator('[data-test="inventory-item-name"]'),
    description: page.locator('[data-test="inventory-item-desc"]'),
  } as Record<string, Locator>,
  lazyItemNames: page.locator('[data-test^="lazy-load-item-"][data-test$="-name"]'),
  firstLazyItemName: page.locator('[data-test="lazy-load-item-0-name"]'),
  catalogContainers: {
    'Lazy Load': page.locator('[data-test="dynamic-catalog-lazy-load-container"]'),
    'Slider': page.locator('[data-test="dynamic-catalog-slider-container"]'),
  } as Record<string, Locator>,
});

export const checkoutLocators = (page: Page) => {
  const byId = (id: string) => page.locator(`[data-test="${id}"]`);
  return {
    cartLink: byId('shopping-cart-link'),
    title: byId('title'),
    itemNames: byId('inventory-item-name'),
    itemPrices: byId('inventory-item-price'),
    itemQuantities: byId('item-quantity'),
    removeButtons: page.locator('[data-test^="remove-"]'),
    continueShopping: byId('continue-shopping'),
    checkout: byId('checkout'),
    firstName: byId('firstName'),
    lastName: byId('lastName'),
    postalCode: byId('postalCode'),
    cancel: byId('cancel'),
    continue: byId('continue'),
    error: byId('error'),
    paymentInfo: byId('payment-info-value'),
    shippingInfo: byId('shipping-info-value'),
    subtotal: byId('subtotal-label'),
    tax: byId('tax-label'),
    total: byId('total-label'),
    finish: byId('finish'),
    completeText: byId('complete-text'),
    ponyImage: byId('pony-express'),
    backHome: byId('back-to-products'),
    generatePdf: byId('generate-pdf-order'),
  };
};

const t = (page: Page, id: string) => page.locator(`[data-test="${id}"]`);

const header = (page: Page) => ({
  'menu button': page.locator('#react-burger-menu-btn'),
  'cart link': t(page, 'shopping-cart-link'),
});

const footer = (page: Page) => ({
  'footer': t(page, 'footer'),
  'social links': t(page, 'social-x'),
  'footer text': t(page, 'footer-copy'),
});

// Per-page expected URL, heading and elements, used by the navigation scenarios.
export const pageModels = (page: Page): Record<string, { url: RegExp; title?: string; elements: Record<string, Locator> }> => ({
  'Inventory': {
    url: /\/inventory\.html/,
    title: 'Products',
    elements: {
      ...header(page),
      'title': t(page, 'title'),
      'sort dropdown': t(page, 'product-sort-container'),
      'product list': t(page, 'inventory-list'),
      'first product name': t(page, 'inventory-item-name').first(),
      'first product price': t(page, 'inventory-item-price').first(),
      'first add to cart button': page.getByRole('button', { name: 'Add to cart' }).first(),
      ...footer(page),
    },
  },
  'Lazy Load': {
    url: /\/dynamic-catalog-lazy-load\.html/,
    title: 'Dynamic Catalog - Lazy Load',
    elements: {
      ...header(page),
      'title': t(page, 'title'),
      'catalog container': t(page, 'dynamic-catalog-lazy-load-container'),
      'first item image': t(page, 'lazy-load-item-0-img'),
      'first item name': t(page, 'lazy-load-item-0-name'),
      'first item price': t(page, 'lazy-load-item-0-price'),
    },
  },
  'Spinner': {
    url: /\/dynamic-catalog-spinner\.html/,
    title: 'Dynamic Catalog - Spinner',
    elements: {
      ...header(page),
      'title': t(page, 'title'),
      'catalog grid': t(page, 'dynamic-catalog-spinner-grid'),
      'first item image': t(page, 'spinner-item-0-img'),
      'first item name': t(page, 'spinner-item-0-name'),
      'first item price': t(page, 'spinner-item-0-price'),
      ...footer(page),
    },
  },
  'Slider': {
    url: /\/dynamic-catalog-slider\.html/,
    title: 'Dynamic Catalog - Slider',
    elements: {
      ...header(page),
      'title': t(page, 'title'),
      'slider item': t(page, 'dynamic-catalog-slider-item'),
      'item image': t(page, 'dynamic-catalog-slider-item-img'),
      'item name': t(page, 'dynamic-catalog-slider-item-name'),
      'item price': t(page, 'dynamic-catalog-slider-item-price'),
      'slider dots': t(page, 'dynamic-catalog-slider-dots'),
      'first dot': t(page, 'dynamic-catalog-slider-dot-0'),
      ...footer(page),
    },
  },
  'Product Details': {
    url: /\/inventory-item\.html\?id=\d+/,
    elements: {
      ...header(page),
      'back to products button': t(page, 'back-to-products'),
      'product image': page.locator('[data-test="inventory-container"] img').first(),
      'product name': t(page, 'inventory-item-name'),
      'product description': t(page, 'inventory-item-desc'),
      'product price': t(page, 'inventory-item-price'),
      'add to cart button': t(page, 'add-to-cart'),
      ...footer(page),
    },
  },
  'Login': {
    url: /saucedemo\.com\/?$/,
    elements: {
      'username field': t(page, 'username'),
      'password field': t(page, 'password'),
      'login button': t(page, 'login-button'),
      'credentials box': t(page, 'login-credentials'),
      'password hint': t(page, 'login-password'),
    },
  },
  'About': {
    url: /saucelabs\.com/,
    elements: {
      'page heading': page.getByRole('heading').first(),
    },
  },
});
