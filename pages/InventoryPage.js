class InventoryPage {
    constructor(page) {
        this.page = page;
        this.title = page.getByTestId('title');
        this.items = page.getByTestId('inventory-item');
        this.sortSelect = page.getByTestId('product-sort-container');
        this.cartBadge = page.getByTestId('shopping-cart-badge');
        this.cartLink = page.getByTestId('shopping-cart-link');
        this.menuButton = page.locator('#react-burger-menu-btn');
    }
    addButton(slug) {
        return this.page.getByTestId(`add-to-cart-${slug}`);
    }
    removeButton(slug) {
        return this.page.getByTestId(`remove-${slug}`);
    }
    async add(slug) {
        await this.addButton(slug).click();
    }
    async remove(slug) {
        await this.removeButton(slug).click();
    }
    async sortBy(option) {
        await this.sortSelect.selectOption(option);
    }
    async names() {
        return this.page.getByTestId('inventory-item-name').allTextContents();
    }
    async prices() {
        const raw = await this.page.getByTestId('inventory-item-price').allTextContents();
        return raw.map((p) => Number(p.replace('$', '')));
    }
    /** `src` of every product image, in display order. */
    async imageSources() {
        return this.page.locator('.inventory_item_img img').evaluateAll((imgs) => imgs.map((i) => i.getAttribute('src') ?? ''));
    }
    async openCart() {
        await this.cartLink.click();
    }
    async openProduct(name) {
        await this.page.getByTestId('inventory-item-name').filter({ hasText: name }).click();
    }
    async openMenu() {
        await this.menuButton.click();
    }
    async logout() {
        await this.openMenu();
        await this.page.getByTestId('logout-sidebar-link').click();
    }
    async resetAppState() {
        await this.openMenu();
        await this.page.getByTestId('reset-sidebar-link').click();
    }
}

module.exports = { InventoryPage };
