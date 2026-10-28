const { test: base, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const test = base.extend({
    loginPage: async ({ page }, use) => use(new LoginPage(page)),
    inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
    cartPage: async ({ page }, use) => use(new CartPage(page)),
    checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
    loginAs: async ({ loginPage, inventoryPage }, use) => {
        await use(async (user) => {
            await loginPage.loginAs(user);
            await expect(inventoryPage.title).toHaveText('Products');
        });
    },
});

module.exports = { expect, test };
