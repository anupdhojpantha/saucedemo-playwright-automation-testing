const { test, expect } = require('../fixtures/fixtures');
const { USERS, PRODUCTS, BACKPACK, BIKE_LIGHT } = require('../test-data/data');
const { knownDefect } = require('../utils/known-defect');
test.describe('Add / remove items and cart management (REQ-06, REQ-07)', () => {
    test.beforeEach(async ({ loginAs }) => {
        await loginAs(USERS.standard);
    });
    test('TC-021 add single item to cart', { tag: '@smoke' }, async ({ inventoryPage }) => {
        await inventoryPage.add(BACKPACK.slug);
        await expect(inventoryPage.removeButton(BACKPACK.slug)).toBeVisible();
        await expect(inventoryPage.cartBadge).toHaveText('1');
    });
    test('TC-022 add multiple items to cart', async ({ inventoryPage }) => {
        for (const p of PRODUCTS.slice(0, 3))
            await inventoryPage.add(p.slug);
        await expect(inventoryPage.cartBadge).toHaveText('3');
        for (const p of PRODUCTS.slice(0, 3))
            await expect(inventoryPage.removeButton(p.slug)).toBeVisible();
    });
    test('TC-023 remove item from inventory page', async ({ inventoryPage }) => {
        await inventoryPage.add(BACKPACK.slug);
        await inventoryPage.remove(BACKPACK.slug);
        await expect(inventoryPage.cartBadge).toHaveCount(0);
        await expect(inventoryPage.addButton(BACKPACK.slug)).toBeVisible();
    });
    test('TC-024 add all 6 items (maximum)', async ({ inventoryPage }) => {
        for (const p of PRODUCTS)
            await inventoryPage.add(p.slug);
        await expect(inventoryPage.cartBadge).toHaveText('6');
        for (const p of PRODUCTS)
            await expect(inventoryPage.removeButton(p.slug)).toBeVisible();
    });
    test('TC-025 cart page lists items with quantity and price', async ({ inventoryPage, cartPage }) => {
        await inventoryPage.add(BACKPACK.slug);
        await inventoryPage.add(BIKE_LIGHT.slug);
        await inventoryPage.openCart();
        await expect(cartPage.items).toHaveCount(2);
        expect(await cartPage.names()).toEqual([BACKPACK.name, BIKE_LIGHT.name]);
        expect(await cartPage.prices()).toEqual([BACKPACK.price, BIKE_LIGHT.price]);
        expect(await cartPage.quantities()).toEqual(['1', '1']);
    });
    test('TC-026 remove item from cart page', async ({ inventoryPage, cartPage }) => {
        await inventoryPage.add(BACKPACK.slug);
        await inventoryPage.add(BIKE_LIGHT.slug);
        await inventoryPage.openCart();
        await cartPage.removeButton(BACKPACK.slug).click();
        await expect(cartPage.items).toHaveCount(1);
        await expect(inventoryPage.cartBadge).toHaveText('1');
        expect(await cartPage.names()).toEqual([BIKE_LIGHT.name]);
    });
    test('TC-027 Continue Shopping returns to inventory with cart preserved', async ({ inventoryPage, cartPage, page }) => {
        await inventoryPage.add(BACKPACK.slug);
        await inventoryPage.openCart();
        await cartPage.continueShopping.click();
        await expect(page).toHaveURL(/\/inventory\.html$/);
        await expect(inventoryPage.cartBadge).toHaveText('1');
    });
    test('TC-028 cart persists after page refresh', async ({ inventoryPage, page }) => {
        await inventoryPage.add(BACKPACK.slug);
        await page.reload();
        await expect(inventoryPage.cartBadge).toHaveText('1');
        await expect(inventoryPage.removeButton(BACKPACK.slug)).toBeVisible();
    });
    test('TC-029 checkout with an empty cart is blocked', async ({ inventoryPage, cartPage, page }) => {
        knownDefect('BUG-001', 'checkout form opens with an empty cart and no warning');
        await inventoryPage.openCart();
        await expect(cartPage.items).toHaveCount(0);
        await cartPage.checkout();
        await expect(page).not.toHaveURL(/checkout-step-one/);
    });
});
