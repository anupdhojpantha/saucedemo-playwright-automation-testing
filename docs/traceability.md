# Manual -> Automated Traceability

Maps every case of the manual suite (see the manual testing repository) to its automated test.

**Legend:** `Auto` = automated, passes on a working app. `Known defect` = automated expected-failure test tied to a bug from the manual cycle (reported as passed while the bug exists, red when it is fixed). `Manual` = intentionally not automated.
| Manual TC | Requirement | Test case | Automated test (file) | Type |
|-----------|-------------|-----------|-----------------------|------|
| TC-001 | REQ-01 | Login with valid standard user | login.spec.js | Auto, @smoke |
| TC-002 | REQ-02 | Login with invalid password | login.spec.js | Auto |
| TC-003 | REQ-02 | Login with invalid username | login.spec.js | Auto |
| TC-004 | REQ-02 | Login with empty username | login.spec.js | Auto |
| TC-005 | REQ-02 | Login with empty password | login.spec.js | Auto |
| TC-006 | REQ-02 | Login with both fields empty | login.spec.js | Auto |
| TC-007 | REQ-02 | Username is case sensitive | login.spec.js | Auto |
| TC-008 | REQ-02 | Leading/trailing spaces in username | login.spec.js | Auto |
| TC-009 | REQ-02 | SQL injection string in username | login.spec.js | Auto |
| TC-010 | REQ-02 | Error message can be dismissed | login.spec.js | Auto |
| TC-011 | REQ-03 | Locked out user cannot login | login.spec.js | Auto |
| TC-012 | REQ-11 | Direct URL access without login | session.spec.js | Auto |
| TC-013 | REQ-11 | Logout from menu | session.spec.js | Auto |
| TC-014 | REQ-11 | Back button after logout | session.spec.js | Auto |
| TC-015 | REQ-04 | Inventory shows 6 products with details | inventory.spec.js | Auto |
| TC-016 | REQ-04 | Product images are correct per item | inventory.spec.js | Auto |
| TC-017 | REQ-05 | Sort by Name (A to Z) | inventory.spec.js | Auto |
| TC-018 | REQ-05 | Sort by Name (Z to A) | inventory.spec.js | Auto |
| TC-019 | REQ-05 | Sort by Price (low to high) | inventory.spec.js | Auto |
| TC-020 | REQ-05 | Sort by Price (high to low) | inventory.spec.js | Auto |
| TC-021 | REQ-06 | Add single item to cart | cart.spec.js | Auto, @smoke |
| TC-022 | REQ-06 | Add multiple items to cart | cart.spec.js | Auto |
| TC-023 | REQ-06 | Remove item from inventory page | cart.spec.js | Auto |
| TC-024 | REQ-06 | Add all 6 items (maximum) | cart.spec.js | Auto |
| TC-025 | REQ-07 | Cart page lists items with qty/price | cart.spec.js | Auto |
| TC-026 | REQ-07 | Remove item from cart page | cart.spec.js | Auto |
| TC-027 | REQ-07 | Continue Shopping returns to inventory | cart.spec.js | Auto |
| TC-028 | REQ-07 | Cart persists after page refresh | cart.spec.js | Auto |
| TC-029 | REQ-07 | Checkout with empty cart | cart.spec.js | Known defect (BUG-001) |
| TC-030 | REQ-08 | All checkout info valid | checkout.spec.js | Auto, @smoke |
| TC-031 | REQ-08 | First name empty | checkout.spec.js | Auto |
| TC-032 | REQ-08 | Last name empty | checkout.spec.js | Auto |
| TC-033 | REQ-08 | Postal code empty | checkout.spec.js | Auto |
| TC-034 | REQ-08 | All fields empty | checkout.spec.js | Auto |
| TC-035 | REQ-08 | Special characters and long input | checkout.spec.js | Known defect (BUG-002) |
| TC-036 | REQ-08 | Cancel from checkout step one | checkout.spec.js | Auto |
| TC-037 | REQ-09 | Item total equals sum of item prices | checkout.spec.js | Auto |
| TC-038 | REQ-09 | Tax calculated at 8% | checkout.spec.js | Auto |
| TC-039 | REQ-09 | Grand total = item total + tax | checkout.spec.js | Auto |
| TC-040 | REQ-09 | Overview shows payment and shipping info | checkout.spec.js | Auto |
| TC-041 | REQ-10 | Complete order | checkout.spec.js | Auto, @smoke |
| TC-042 | REQ-10 | Back Home after order | checkout.spec.js | Auto |
| TC-043 | REQ-12 | Open product detail page | product-and-ui.spec.js | Auto |
| TC-044 | REQ-12 | Add to cart from detail page | product-and-ui.spec.js | Auto |
| TC-045 | REQ-13 | Layout at mobile width (375px) | product-and-ui.spec.js | Auto |
| TC-046 | REQ-13 | Cross-browser: Chrome/Firefox/Edge | playwright.config.js (3 browser projects) | Auto, by configuration |
| TC-047 | REQ-13 | Menu items work | product-and-ui.spec.js | Auto |
| TC-048 | REQ-13 | Visual check with visual_user | none | Manual (BUG-003) |
| TC-049 | REQ-04 | problem_user: images and add to cart | user-profiles.spec.js (049a, 049b) | Known defect (BUG-004) |
| TC-050 | REQ-05 | problem_user: sorting | user-profiles.spec.js | Known defect (BUG-005) |
| TC-051 | REQ-08 | problem_user: checkout field entry | user-profiles.spec.js | Known defect (BUG-006) |
| TC-052 | REQ-14 | performance_glitch_user login time | user-profiles.spec.js | Known defect (BUG-007) |
| TC-053 | REQ-10 | error_user: complete checkout | user-profiles.spec.js | Known defect (BUG-008) |

**Summary:** 51 of 53 manual cases have dedicated tests (52 tests per browser, because TC-049 is split in two). TC-046 (cross-browser) is covered by the three browser projects, and TC-048 (visual check) stays manual. One run produces 156 test executions (52 tests × 3 browsers).
