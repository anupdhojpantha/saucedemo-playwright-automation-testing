const { defineConfig, devices } = require('@playwright/test');
const isCI = !!process.env.CI;
module.exports = defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 1 : 0,
    workers: isCI ? 2 : undefined,
    timeout: 30_000,
    expect: { timeout: 7_000 },
    reporter: [['list'], ['html', { open: 'never' }]],
    use: {
        baseURL: 'https://www.saucedemo.com',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        testIdAttribute: 'data-test',
    },
    // Same three browsers as the manual cross-browser test (TC-046)
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
    ],
});
