const { test, expect } = require('../fixtures/fixtures');
const { USERS, BACKPACK } = require('../test-data/data');
test.describe('Product detail page (REQ-12)', () => {
    test.beforeEach(async ({ loginAs }) => {
        await loginAs(USERS.standard);
    });
    test('TC-043 product detail page shows the same name, description, price and image', async ({ inventoryPage, page }) => {
        const card = inventoryPage.items.filter({ hasText: BACKPACK.name });
        const description = await card.getByTestId('inventory-item-desc').textContent();
        const imageSrc = await card.locator('img').getAttribute('src');
        await inventoryPage.openProduct(BACKPACK.name);
        await expect(page).toHaveURL(/inventory-item\.html\?id=/);
        await expect(page.getByTestId('inventory-item-name')).toHaveText(BACKPACK.name);
        await expect(page.getByTestId('inventory-item-desc')).toHaveText(description ?? '');
        await expect(page.getByTestId('inventory-item-price')).toHaveText(`$${BACKPACK.price}`);
        await expect(page.locator('.inventory_details_img')).toHaveAttribute('src', imageSrc ?? '');
    });
    test('TC-044 add to cart from detail page', async ({ inventoryPage, page }) => {
        await inventoryPage.openProduct(BACKPACK.name);
        await page.getByTestId('add-to-cart').click();
        await expect(inventoryPage.cartBadge).toHaveText('1');
        await page.getByTestId('back-to-products').click();
        await expect(inventoryPage.removeButton(BACKPACK.slug)).toBeVisible();
    });
});
test.describe('UI, menu and responsive layout (REQ-13)', () => {
    test('TC-047 menu items work', async ({ loginAs, inventoryPage, page }) => {
        await loginAs(USERS.standard);
        await inventoryPage.add(BACKPACK.slug);
        await inventoryPage.resetAppState();
        await expect(inventoryPage.cartBadge).toHaveCount(0);
        await inventoryPage.openCart();
        await inventoryPage.openMenu();
        await page.getByTestId('inventory-sidebar-link').click();
        await expect(page).toHaveURL(/\/inventory\.html$/);
        await inventoryPage.openMenu();
        await page.getByTestId('about-sidebar-link').click();
        await expect(page).toHaveURL(/saucelabs\.com/);
    });
    test.describe('mobile width 375px', () => {
        test.use({ viewport: { width: 375, height: 812 } });
        test('TC-045 layout at 375px: controls visible and no horizontal scroll', async ({ loginAs, inventoryPage, cartPage, checkoutPage, page }) => {
            const noHorizontalScroll = async () => expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
            await loginAs(USERS.standard);
            await expect(inventoryPage.sortSelect).toBeVisible();
            await expect(inventoryPage.addButton(BACKPACK.slug)).toBeVisible();
            await noHorizontalScroll();
            await inventoryPage.add(BACKPACK.slug);
            await inventoryPage.openCart();
            await expect(cartPage.checkoutButton).toBeVisible();
            await noHorizontalScroll();
            await cartPage.checkout();
            await expect(checkoutPage.continueButton).toBeVisible();
            await noHorizontalScroll();
        });
    });
});
