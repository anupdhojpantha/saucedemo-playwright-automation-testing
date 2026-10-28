const { test, expect } = require('../fixtures/fixtures');
const { USERS, PASSWORD, MESSAGES } = require('../test-data/data');
test.describe('Login (REQ-01, REQ-02, REQ-03)', () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.goto();
    });
    test('TC-001 login with valid standard user', { tag: '@smoke' }, async ({ loginPage, inventoryPage, page }) => {
        await loginPage.login(USERS.standard);
        await expect(page).toHaveURL(/\/inventory\.html$/);
        await expect(inventoryPage.items).toHaveCount(6);
    });
    test('TC-002 login with invalid password', async ({ loginPage, page }) => {
        await loginPage.login(USERS.standard, 'wrong123');
        await expect(loginPage.error).toHaveText(MESSAGES.mismatch);
        await expect(page).toHaveURL(/saucedemo\.com\/$/);
    });
    test('TC-003 login with invalid username', async ({ loginPage }) => {
        await loginPage.login('fakeuser', PASSWORD);
        await expect(loginPage.error).toHaveText(MESSAGES.mismatch);
    });
    test('TC-004 login with empty username', async ({ loginPage }) => {
        await loginPage.login('', PASSWORD);
        await expect(loginPage.error).toHaveText(MESSAGES.usernameRequired);
    });
    test('TC-005 login with empty password', async ({ loginPage }) => {
        await loginPage.login(USERS.standard, '');
        await expect(loginPage.error).toHaveText(MESSAGES.passwordRequired);
    });
    test('TC-006 login with both fields empty', async ({ loginPage }) => {
        await loginPage.login('', '');
        await expect(loginPage.error).toHaveText(MESSAGES.usernameRequired);
    });
    test('TC-007 username is case sensitive', async ({ loginPage }) => {
        await loginPage.login('STANDARD_USER', PASSWORD);
        await expect(loginPage.error).toHaveText(MESSAGES.mismatch);
    });
    test('TC-008 trailing space in username is rejected', async ({ loginPage }) => {
        await loginPage.login('standard_user ', PASSWORD);
        await expect(loginPage.error).toHaveText(MESSAGES.mismatch);
    });
    test('TC-009 SQL injection string in username is rejected', async ({ loginPage, page }) => {
        await loginPage.login("' OR '1'='1", 'anything');
        await expect(loginPage.error).toHaveText(MESSAGES.mismatch);
        await expect(page).toHaveURL(/saucedemo\.com\/$/);
    });
    test('TC-010 error message can be dismissed', async ({ loginPage }) => {
        await loginPage.login(USERS.standard, 'wrong123');
        await expect(loginPage.error).toBeVisible();
        await loginPage.errorDismiss.click();
        await expect(loginPage.error).toHaveCount(0);
    });
    test('TC-011 locked out user cannot login', async ({ loginPage, page }) => {
        await loginPage.login(USERS.lockedOut, PASSWORD);
        await expect(loginPage.error).toHaveText(MESSAGES.lockedOut);
        await expect(page).toHaveURL(/saucedemo\.com\/$/);
    });
});
