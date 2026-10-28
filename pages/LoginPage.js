const { PASSWORD } = require('../test-data/data');
class LoginPage {
    constructor(page) {
        this.page = page;
        this.username = page.getByTestId('username');
        this.password = page.getByTestId('password');
        this.loginButton = page.getByTestId('login-button');
        this.error = page.getByTestId('error');
        this.errorDismiss = page.getByTestId('error-button');
    }
    async goto() {
        await this.page.goto('/');
    }
    async login(user, password = PASSWORD) {
        await this.username.fill(user);
        await this.password.fill(password);
        await this.loginButton.click();
    }
    /** Open the login page and sign in in one step. */
    async loginAs(user, password = PASSWORD) {
        await this.goto();
        await this.login(user, password);
    }
}

module.exports = { LoginPage };
