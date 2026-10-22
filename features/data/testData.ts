// @ts-ignore Node.js typings are not configured in this project.
import { readFileSync } from 'fs';

export interface CheckoutItem { name: string; price: string }
export interface CheckoutInfo { firstName: string; lastName: string; postalCode: string }
export interface CheckoutTotals { subtotal: string; tax: string; total: string }

export interface TestCase {
  description: string;
  username: string;
  password: string;
  action?: { type: string; item: string };
  expected: { type: string; value?: string; field?: string; page?: string; elements?: string[] };
  checkout?: { items: CheckoutItem[]; info: CheckoutInfo; totals: CheckoutTotals; error?: string };
}

const data: Record<string, TestCase> = JSON.parse(
  readFileSync('features/data/testData.json', 'utf-8'),
);

export function getTestCase(id: string): TestCase {
  const testCase = data[id];
  if (!testCase) throw new Error(`Test case "${id}" not found in features/data/testData.json`);
  return testCase;
}

export function getCheckout(id: string) {
  const { checkout } = getTestCase(id);
  if (!checkout) throw new Error(`Test case "${id}" has no checkout data`);
  return checkout;
}
