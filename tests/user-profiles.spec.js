const { test, expect } = require('../fixtures/fixtures');
const { USERS, PRODUCTS, BACKPACK, CHECKOUT_INFO } = require('../test-data/data');
const { knownDefect } = require('../utils/known-defect');
/**
 * Special user profiles. Every test below describes the CORRECT behavior and is marked as a
 * known defect (see utils/known-defect.js), so it is reported as passed while the bug exists
 * and turns red the moment the bug is fixed.
 */
test.describe('problem_user (REQ-04, REQ-05, REQ-08)', () => {
    test.beforeEach(async ({ loginAs }) => {
        await loginAs(USERS.problem);
    });
    test('TC-049a every product shows its own image', async ({ inventoryPage }) => {
        knownDefect('BUG-004', 'all products show the same image');
        expect(new Set(await inventoryPage.imageSources()).size).toBe(6);
    });
    test('TC-049b all six items can be added to the cart', async ({ inventoryPage }) => {
        knownDefect('BUG-004', 'Add to cart does not work for more than two products');
        for (const p of PRODUCTS)
            await inventoryPage.add(p.slug).catch(() => undefined);
        await expect(inventoryPage.cartBadge).toHaveText('6', { timeout: 3_000 });
    });
    test('TC-050 sorting reorders the products', async ({ inventoryPage }) => {
        knownDefect('BUG-005', 'sorting does not change the product order');
        await inventoryPage.sortBy('lohi');
        const prices = await inventoryPage.prices();
        expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });
    test('TC-051 checkout fields keep what is typed', async ({ inventoryPage, cartPage, checkoutPage }) => {
        knownDefect('BUG-006', 'Last Name text goes into the First Name field');
        await inventoryPage.add(BACKPACK.slug);
        await inventoryPage.openCart();
        await cartPage.checkout();
        await checkoutPage.fillInfo();
        await expect(checkoutPage.firstName).toHaveValue(CHECKOUT_INFO.firstName);
        await expect(checkoutPage.lastName).toHaveValue(CHECKOUT_INFO.lastName);
    });
});
test.describe('performance_glitch_user (REQ-14)', () => {
    test('TC-052 inventory loads within 3 seconds after login', async ({ loginPage, inventoryPage }) => {
        knownDefect('BUG-007', 'inventory takes about 5 s to load (LCP 5.06 s)');
        test.setTimeout(60_000);
        await loginPage.goto();
        const start = Date.now();
        await loginPage.login(USERS.performanceGlitch);
        await expect(inventoryPage.title).toBeVisible({ timeout: 20_000 });
        expect(Date.now() - start).toBeLessThan(3_000);
    });
});
test.describe('error_user (REQ-10)', () => {
    test('TC-053 checkout can be completed', async ({ loginAs, inventoryPage, cartPage, checkoutPage }) => {
        knownDefect('BUG-008', 'Finish button cannot be clicked, order cannot be completed');
        await loginAs(USERS.error);
        await inventoryPage.add(BACKPACK.slug);
        await inventoryPage.openCart();
        await cartPage.checkout();
        await checkoutPage.fillAndContinue();
        await checkoutPage.finishButton.click({ timeout: 5_000 });
        await expect(checkoutPage.completeHeader).toBeVisible({ timeout: 5_000 });
    });
});
