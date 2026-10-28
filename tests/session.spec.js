const { test, expect } = require('../fixtures/fixtures');
const { USERS, MESSAGES } = require('../test-data/data');
test.describe('Session handling (REQ-11)', () => {
    test('TC-012 direct URL access without login is blocked', async ({ page, loginPage }) => {
        await page.goto('/inventory.html');
        await expect(page).toHaveURL(/saucedemo\.com\/$/);
        await expect(loginPage.error).toHaveText(MESSAGES.notLoggedIn);
    });
    test('TC-013 logout from menu returns to an empty login page', async ({ loginAs, inventoryPage, loginPage, page }) => {
        await loginAs(USERS.standard);
        await inventoryPage.logout();
        await expect(page).toHaveURL(/saucedemo\.com\/$/);
        await expect(loginPage.username).toHaveValue('');
        await expect(loginPage.password).toHaveValue('');
    });
    test('TC-014 Back button after logout does not show the protected page', async ({ loginAs, inventoryPage, loginPage, page }) => {
        await loginAs(USERS.standard);
        await inventoryPage.logout();
        await page.goBack();
        await expect(inventoryPage.items).toHaveCount(0);
        await expect(loginPage.error).toHaveText(MESSAGES.notLoggedIn);
    });
});
