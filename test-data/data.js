const PASSWORD = 'secret_sauce';
const USERS = {
    standard: 'standard_user',
    lockedOut: 'locked_out_user',
    problem: 'problem_user',
    performanceGlitch: 'performance_glitch_user',
    error: 'error_user',
    visual: 'visual_user',
};
/** The six products. `slug` is used in the add-to-cart / remove data-test ids. */
const PRODUCTS = [
    { slug: 'sauce-labs-backpack', name: 'Sauce Labs Backpack', price: 29.99 },
    { slug: 'sauce-labs-bike-light', name: 'Sauce Labs Bike Light', price: 9.99 },
    { slug: 'sauce-labs-bolt-t-shirt', name: 'Sauce Labs Bolt T-Shirt', price: 15.99 },
    { slug: 'sauce-labs-fleece-jacket', name: 'Sauce Labs Fleece Jacket', price: 49.99 },
    { slug: 'sauce-labs-onesie', name: 'Sauce Labs Onesie', price: 7.99 },
    { slug: 'test.allthethings()-t-shirt-(red)', name: 'Test.allTheThings() T-Shirt (Red)', price: 15.99 },
];
const BACKPACK = PRODUCTS[0];
const BIKE_LIGHT = PRODUCTS[1];
const MESSAGES = {
    mismatch: 'Epic sadface: Username and password do not match any user in this service',
    usernameRequired: 'Epic sadface: Username is required',
    passwordRequired: 'Epic sadface: Password is required',
    lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
    notLoggedIn: "Epic sadface: You can only access '/inventory.html' when you are logged in.",
    firstNameRequired: 'Error: First Name is required',
    lastNameRequired: 'Error: Last Name is required',
    postalRequired: 'Error: Postal Code is required',
    orderComplete: 'Thank you for your order!',
};
const CHECKOUT_INFO = { firstName: 'Jane', lastName: 'Doe', postalCode: '27701' };
const TAX_RATE = 0.08;
/** Money helper: avoids floating point noise (39.98 + 3.2). */
const round2 = (n) => Math.round(n * 100) / 100;

module.exports = { PASSWORD, USERS, PRODUCTS, BACKPACK, BIKE_LIGHT, MESSAGES, CHECKOUT_INFO, TAX_RATE, round2 };
