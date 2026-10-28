const { CHECKOUT_INFO } = require('../test-data/data');
class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.firstName = page.getByTestId('firstName');
        this.lastName = page.getByTestId('lastName');
        this.postalCode = page.getByTestId('postalCode');
        this.continueButton = page.getByTestId('continue');
        this.cancelButton = page.getByTestId('cancel');
        this.error = page.getByTestId('error');
        this.subtotal = page.getByTestId('subtotal-label');
        this.tax = page.getByTestId('tax-label');
        this.total = page.getByTestId('total-label');
        this.paymentInfo = page.getByTestId('payment-info-value');
        this.shippingInfo = page.getByTestId('shipping-info-value');
        this.finishButton = page.getByTestId('finish');
        this.completeHeader = page.getByTestId('complete-header');
        this.backHome = page.getByTestId('back-to-products');
    }
    async fillInfo(info = CHECKOUT_INFO) {
        await this.firstName.fill(info.firstName);
        await this.lastName.fill(info.lastName);
        await this.postalCode.fill(info.postalCode);
    }
    async continue() {
        await this.continueButton.click();
    }
    async fillAndContinue(info) {
        await this.fillInfo(info);
        await this.continue();
    }
    /** "Item total: $39.98" -> 39.98 */
    async money(label) {
        const text = (await label.textContent()) ?? '';
        return Number(text.replace(/[^0-9.]/g, ''));
    }
}

module.exports = { CheckoutPage };
