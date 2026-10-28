const { test, expect } = require('../fixtures/fixtures');
const { USERS, BACKPACK, BIKE_LIGHT, MESSAGES, CHECKOUT_INFO, TAX_RATE, round2 } = require('../test-data/data');
const { knownDefect } = require('../utils/known-defect');
const SUBTOTAL = round2(BACKPACK.price + BIKE_LIGHT.price); // 39.98
const TAX = round2(SUBTOTAL * TAX_RATE); //  3.20
const TOTAL = round2(SUBTOTAL + TAX); // 43.18
test.describe('Checkout (REQ-08, REQ-09, REQ-10)', () => {
    test.beforeEach(async ({ loginAs, inventoryPage, cartPage }) => {
        await loginAs(USERS.standard);
        await inventoryPage.add(BACKPACK.slug);
        await inventoryPage.add(BIKE_LIGHT.slug);
        await inventoryPage.openCart();
        await cartPage.checkout();
    });
    test.describe('step one: your information', () => {
        test('TC-030 all checkout info valid', { tag: '@smoke' }, async ({ checkoutPage, page }) => {
            await checkoutPage.fillAndContinue();
            await expect(page).toHaveURL(/checkout-step-two/);
        });
        test('TC-031 first name empty', async ({ checkoutPage, page }) => {
            await checkoutPage.fillAndContinue({ ...CHECKOUT_INFO, firstName: '' });
            await expect(checkoutPage.error).toHaveText(MESSAGES.firstNameRequired);
            await expect(page).toHaveURL(/checkout-step-one/);
        });
        test('TC-032 last name empty', async ({ checkoutPage, page }) => {
            await checkoutPage.fillAndContinue({ ...CHECKOUT_INFO, lastName: '' });
            await expect(checkoutPage.error).toHaveText(MESSAGES.lastNameRequired);
            await expect(page).toHaveURL(/checkout-step-one/);
        });
        test('TC-033 postal code empty', async ({ checkoutPage, page }) => {
            await checkoutPage.fillAndContinue({ ...CHECKOUT_INFO, postalCode: '' });
            await expect(checkoutPage.error).toHaveText(MESSAGES.postalRequired);
            await expect(page).toHaveURL(/checkout-step-one/);
        });
        test('TC-034 all fields empty', async ({ checkoutPage }) => {
            await checkoutPage.continue();
            await expect(checkoutPage.error).toHaveText(MESSAGES.firstNameRequired);
        });
        test('TC-035 special characters and 256-character input are rejected or handled', async ({ checkoutPage, page }) => {
            knownDefect('BUG-002', 'form accepts 256+ characters and special characters without validation');
            await checkoutPage.fillAndContinue({
                firstName: 'A'.repeat(256),
                lastName: '<script>alert(1)</script>',
                postalCode: '!@#$%',
            });
            await expect(page).not.toHaveURL(/checkout-step-two/);
        });
        test('TC-036 cancel returns to cart with items intact', async ({ checkoutPage, cartPage, page }) => {
            await checkoutPage.cancelButton.click();
            await expect(page).toHaveURL(/\/cart\.html$/);
            await expect(cartPage.items).toHaveCount(2);
        });
    });
    test.describe('step two: overview', () => {
        test.beforeEach(async ({ checkoutPage }) => {
            await checkoutPage.fillAndContinue();
        });
        test('TC-037 item total equals the sum of item prices', async ({ checkoutPage }) => {
            expect(await checkoutPage.money(checkoutPage.subtotal)).toBe(SUBTOTAL);
        });
        test('TC-038 tax is calculated at 8%', async ({ checkoutPage }) => {
            expect(await checkoutPage.money(checkoutPage.tax)).toBe(TAX);
        });
        test('TC-039 grand total equals item total plus tax', async ({ checkoutPage }) => {
            expect(await checkoutPage.money(checkoutPage.total)).toBe(TOTAL);
        });
        test('TC-040 overview shows payment and shipping information', async ({ checkoutPage }) => {
            await expect(checkoutPage.paymentInfo).toContainText('SauceCard');
            await expect(checkoutPage.shippingInfo).toContainText('Free Pony Express');
        });
        test('TC-041 complete order', { tag: '@smoke' }, async ({ checkoutPage, inventoryPage }) => {
            await checkoutPage.finishButton.click();
            await expect(checkoutPage.completeHeader).toHaveText(MESSAGES.orderComplete);
            await expect(inventoryPage.cartBadge).toHaveCount(0);
        });
        test('TC-042 Back Home after order shows inventory with an empty cart', async ({ checkoutPage, inventoryPage, page }) => {
            await checkoutPage.finishButton.click();
            await checkoutPage.backHome.click();
            await expect(page).toHaveURL(/\/inventory\.html$/);
            await expect(inventoryPage.cartBadge).toHaveCount(0);
        });
    });
});
