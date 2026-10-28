# Automation Approach

## 1. Goal
Turn the manual SauceDemo suite (53 cases, 8 defects) into a fast, repeatable regression suite that runs on every push.

## 2. What to automate, and what not
Automate cases that are stable, repetitive and have a clear pass/fail: login validation, cart, checkout calculations, session rules, sorting, user-profile defects. Keep manual what needs human judgment: visual comparison (TC-048), exploratory sessions, first-time usability.

Selection used here:
1. Smoke tests first (`@smoke`: TC-001, 021, 030, 041), the fastest signal that the main purchase path works.
2. Everything High priority, then Medium and Low.
3. Known defects become expected-failure tests (section 5).

## 3. Stack
| Choice | Reason |
|--------|--------|
| Playwright + JavaScript | Built-in runner, auto-waiting (fewer flaky waits), parallel by default, trace viewer, HTML report |
| Page Object Model | Selectors live in one place; tests read like the manual steps |
| Fixtures | Pages and a `loginAs(user)` helper injected into tests, no setup duplication |
| GitHub Actions | Runs the suite on every push and pull request |

## 4. Design rules
- **One behavior per test, named with its manual TC ID** (`TC-021 add single item to cart`) so a failure points to the manual case and requirement.
- **Locators by `data-test` attribute** (`testIdAttribute: 'data-test'` in the config). Stable, readable, no CSS or XPath chains.
- **No fixed sleeps.** Assertions use Playwright's auto-retrying `expect`.
- **Independent tests.** Each test logs in itself; no test depends on another, so they run in parallel and in any order.
- **Test data in one place** (`test-data/data.js`): users, products, prices, expected messages, tax rate.
- **Computed expectations.** Totals come from product prices and the 8% tax rate, not hardcoded results.
- **Assertions in tests, actions in pages.** Page objects expose locators and actions, tests decide what to verify.

## 5. Handling known defects
The manual cycle found 8 bugs, and 7 of them are automated (BUG-003, the `visual_user` layout and prices, stays manual). Each failing behavior is automated as the **correct** behavior and marked with `knownDefect(bugId, summary)`, which wraps Playwright's `test.fail()`:
- Bug present: the assertions fail, the test is reported **passed** (expected failure), so the CI pipeline stays green.
- Bug fixed: the assertions pass, the test is reported **failed** with "expected to fail but passed". Remove the `knownDefect` call and the test becomes a normal regression test.

Every bug stays visible in the report through an annotation (`known-defect: BUG-00X`).

## 6. Cross-browser
Three projects match the manual cross-browser test (TC-046): Chromium (Chrome), Firefox and Edge (`channel: 'msedge'`). One run produces 156 test executions (52 tests × 3 browsers).

## 7. Reporting and CI
- Local: `npm run report` opens the HTML report with traces, screenshots and video for failures.
- CI: `.github/workflows/playwright.yml` installs the browsers, runs the suite and uploads the HTML report as an artifact (14 days).

## 8. Risks and limits
- The site is a public demo and may change; selectors can break.
- `performance_glitch_user` timing (TC-052) depends on the machine and network, so treat it as a smoke indicator, not a benchmark.
- The `visual_user` visual check stays manual; visual regression tooling could be added later.
- The About menu test (TC-047) leaves the app and depends on saucelabs.com being reachable.

## 9. Roadmap
1. ~~Run the suite and fix any selector or timing differences on the live site.Done: 156 of 156 passed on 10/27/2026(Chromium,Firefox, Edge)~~
2. Add API-level setup (skip UI login) and storage-state reuse to speed up runs.
3. Add visual snapshot tests for `visual_user` (BUG-003).
4. Add accessibility checks with `@axe-core/playwright`.
5. Add the API testing project as a second repository.
