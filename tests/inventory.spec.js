const { test, expect } = require('../fixtures/fixtures');
const { USERS, PRODUCTS } = require('../test-data/data');
test.describe('Inventory display and sorting (REQ-04, REQ-05)', () => {
    test.beforeEach(async ({ loginAs }) => {
        await loginAs(USERS.standard);
    });
    test('TC-015 inventory shows 6 products with image, name, description, price and button', async ({ inventoryPage }) => {
        await expect(inventoryPage.items).toHaveCount(6);
        for (const item of await inventoryPage.items.all()) {
            await expect(item.locator('img')).toBeVisible();
            await expect(item.getByTestId('inventory-item-name')).not.toBeEmpty();
            await expect(item.getByTestId('inventory-item-desc')).not.toBeEmpty();
            await expect(item.getByTestId('inventory-item-price')).toContainText('$');
            await expect(item.getByRole('button', { name: 'Add to cart' })).toBeVisible();
        }
        expect((await inventoryPage.names()).sort()).toEqual(PRODUCTS.map((p) => p.name).sort());
    });
    test('TC-016 each product shows its own distinct image', async ({ inventoryPage }) => {
        const sources = await inventoryPage.imageSources();
        expect(sources).toHaveLength(6);
        expect(new Set(sources).size).toBe(6);
    });
    test('TC-017 sort by name A to Z', async ({ inventoryPage }) => {
        await inventoryPage.sortBy('az');
        const names = await inventoryPage.names();
        expect(names).toEqual([...names].sort());
    });
    test('TC-018 sort by name Z to A', async ({ inventoryPage }) => {
        await inventoryPage.sortBy('za');
        const names = await inventoryPage.names();
        expect(names).toEqual([...names].sort().reverse());
    });
    test('TC-019 sort by price low to high', async ({ inventoryPage }) => {
        await inventoryPage.sortBy('lohi');
        const prices = await inventoryPage.prices();
        expect(prices).toEqual([...prices].sort((a, b) => a - b));
        expect(prices[0]).toBe(7.99);
        expect(prices[prices.length - 1]).toBe(49.99);
    });
    test('TC-020 sort by price high to low', async ({ inventoryPage }) => {
        await inventoryPage.sortBy('hilo');
        const prices = await inventoryPage.prices();
        expect(prices).toEqual([...prices].sort((a, b) => b - a));
        expect(prices[0]).toBe(49.99);
        expect(prices[prices.length - 1]).toBe(7.99);
    });
});
