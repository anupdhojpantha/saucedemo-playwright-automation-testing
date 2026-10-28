class CartPage {
    constructor(page) {
        this.page = page;
        this.items = page.getByTestId('inventory-item');
        this.checkoutButton = page.getByTestId('checkout');
        this.continueShopping = page.getByTestId('continue-shopping');
    }
    async goto() {
        await this.page.goto('/cart.html');
    }
    removeButton(slug) {
        return this.page.getByTestId(`remove-${slug}`);
    }
    async names() {
        return this.page.getByTestId('inventory-item-name').allTextContents();
    }
    async prices() {
        const raw = await this.page.getByTestId('inventory-item-price').allTextContents();
        return raw.map((p) => Number(p.replace('$', '')));
    }
    async quantities() {
        return this.page.getByTestId('item-quantity').allTextContents();
    }
    async checkout() {
        await this.checkoutButton.click();
    }
}

module.exports = { CartPage };
