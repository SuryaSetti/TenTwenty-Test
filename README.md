# TenTwenty-Test

## What is this project?

This project checks that a demo online shop, [Swag Labs](https://www.saucedemo.com), works the way a shopper would expect. A computer program does the checking for us. It opens a web browser, clicks buttons, types into forms and compares what it sees with what should happen. It does this the same way every time, and much faster than a person.

It was made for the TenTwenty technical assessment for a Software Quality Assurance (SQA) role.

## Simple glossary

| Term | Meaning |
|------|---------|
| **Test case** | One check, such as "log in with a wrong password". Each has a number (TC01, TC02 and so on). |
| **Bug** | Something on the website that does not work as it should. |
| **Standard user** | A normal demo shopper account on the site. Most tests use it. |
| **Known bug test** | A test written to catch a bug we already found. |

## What do we check?

| What | Test cases | In plain words |
|------|-----------|----------------|
| **Logging in** | TC01–TC07 | Different valid users can log in and then do things: add or remove an item from the cart, sort products, open the menu, open a product. |
| **Logging in the wrong way** | TC15–TC20 | The site refuses blocked users, wrong passwords, unknown users, empty fields, and a username typed with the wrong capital letters. |
| **Moving around the site** | TC08–TC14 | Every menu page (Products, Lazy Load, Spinner, Slider, About, Logout and a product's detail page) opens and shows what it should. |
| **Buying something** | TC28–TC29 | Add items to the cart, fill in the details, review the order, finish it, and download the PDF receipt. We check the receipt shows the right name, items and prices. |
| **Checkout form rules** | TC30–TC32 | The site asks for a first name, a last name and a postal code, and shows a message if one is missing. |

## Bugs we found

These are problems with the demo website itself. Each has a test that **fails on purpose** until the website is fixed.

| Test cases | The problem |
|-----------|-------------|
| TC21–TC22 | The Products page shows strange computer code (`allTheThings()`) in a product's name and description. |
| TC23–TC24 | The Lazy Load page repeats the same items in different sizes, and keeps adding items forever when you scroll. |
| TC25–TC26 | On the Lazy Load page, clicking an item does not open its detail page, and there is no "Add to cart" button. |
| TC27 | The Slider page has no "Add to cart" button. |
| TC33 | The checkout form accepts numbers (like "123") as a first or last name, and you can still continue to pay. |
| TC34 | The checkout form accepts words (like "Test") as a postal code, and you can still continue to pay. |

**Why do the bug tests "fail" on purpose?** Each one checks for the *correct* behaviour. While the bug exists, the check fails, and we have marked that as expected, so the overall result still shows as passed. Once the website is fixed, the test starts passing and we are told, so we can remove the mark.

## How to run the tests

You need [Node.js](https://nodejs.org) installed. Then open a terminal in this folder and follow these steps.

1. **Install what the project needs** (one time only):
   ```
   npm install
   npx playwright install chromium
   ```
2. **Run all the checks:**
   ```
   npm run test:bdd
   ```
3. **Optional: watch it happen on screen.** This opens a visible browser and runs slowly:
   ```
   npm run test:bdd:headed
   ```

When it finishes you get a summary of how many checks passed.

## How the project is organised

You don't need to read the code to use it. If you are curious, here is what each part does.

| File or folder | What it holds |
|----------------|---------------|
| `features/Sauce_Demo.feature` | The checks, written in plain English (for example "When I finish the order"). Start here to see what is tested. |
| `features/data/testData.json` | The details used by each test case: which user, what to type, and what should happen. |
| `features/models/locators.ts` | The "address book" of the page: where each button, box and message is. |
| `features/pages/pages.ts` | The actions for each page, such as logging in or filling in the form. |
| `features/steps/` | The link between the plain-English sentences and the actions. |
| `tests/Login.spec.ts` | An earlier set of simple login tests. |
| `playwright.config.ts` | Settings, such as the time limit for each test. |

## How the project was built

1. Wrote tests for logging in with different user names and passwords, then kept only those.
2. Rewrote the checks in plain English so anyone can read them.
3. Kept the "where things are on the page" information in one place, so changes are easy.
4. Added checks for every menu page.
5. Gave every test a number (TC01, TC02 and so on) and moved the details into one data file.
6. Added a time limit for each test, and an option to slow things down so you can watch.
7. Added a short description to every test case explaining why it exists.
8. Added tests for the bugs found on the Products, Lazy Load and Slider pages.
9. Added the full buying flow, including checking the PDF receipt.
10. Added checks for the checkout form rules and for the invalid names and postal codes it wrongly accepts.
