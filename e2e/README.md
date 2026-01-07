# Appium E2E Testing Framework

Appium 3 + TypeScript + WebdriverIO for Android testing with Allure reporting.

## Structure

```
e2e/
├── pages/           # Page Object Model
│   ├── BasePage.ts  # Base class
│   └── HomePage.ts  # Home page
├── specs/           # Test files
│   └── home.spec.ts
├── utils/           # Helper functions
│   └── Util.ts
└── types/
    └── driver.d.ts
```

## Usage

### Page Object

```typescript
import { BasePage } from './BasePage';

export class MyPage extends BasePage {
  get myButton() {
    return this.driver.$('~my_button_testid');
  }

  async clickMyButton() {
    await this.click(this.myButton);
  }
}
```

### Test

```typescript
import { expect } from '@wdio/globals';
import { MyPage } from '../pages/MyPage';

describe('My Tests', () => {
  let myPage: MyPage;

  before(async () => {
    myPage = new MyPage(driver);
    await myPage.waitForPageLoad();
  });

  it('should click button', async () => {
    await myPage.clickMyButton();
    // assertions
  });
});
```

### Adding testIDs

In React Native components:
```typescript
<TouchableOpacity testID="my_button_testid">
  <Text>Click Me</Text>
</TouchableOpacity>
```

### Using UIAutomator Selectors

UIAutomator selectors can be more reliable than accessibility IDs in some cases, especially when elements are not immediately available or accessibility labels are not set. The `BasePage` class now includes fallback logic using UIAutomator selectors.

**UIAutomator Selector Examples:**

```typescript
// By content-desc (accessibility label)
this.driver.$('android=new UiSelector().description("Semester1")')

// By text content
this.driver.$('android=new UiSelector().text("Semester 1")')
this.driver.$('android=new UiSelector().textContains("Semester")')

// By resource ID
this.driver.$('android=new UiSelector().resourceId("com.example:id/semester1")')

// By class name
this.driver.$('android=new UiSelector().className("android.widget.Button")')

// Combined selectors
this.driver.$('android=new UiSelector().text("Semester 1").clickable(true)')
```

**When to use UIAutomator:**
- When accessibility IDs are unreliable or not set
- When you need to find elements by visible text
- When you need more complex selector logic (combining multiple criteria)
- As a fallback strategy when primary selectors fail

**Note:** The `BasePage.navigateToHome()` method now automatically tries UIAutomator selectors as a fallback if the primary accessibility ID selector fails.

## BasePage Methods

- `click(element, timeout?)` - Click element (waits for element to be displayed)
- `isDisplayed(element)` - Check if element is displayed
- `swipeDown()` / `swipeUp()` - Scroll down/up on the page
- `hideKeyboard()` - Hide the keyboard if visible
- `openMenu()` - Open the app menu
- `dismissExternalApps()` - Dismiss external apps (like Gmail) and return to app
- `isOnHomePage()` - Check if currently on the home page
- `navigateToHome()` - Navigate to the home page (handles navigation from any page)
- `dismissLanguageModal()` - Dismiss language selection modal if present
- `cleanup()` - Clean up state and navigate to home page

## Running Tests

All tests are for Android. iOS tests may be added in the future:

```bash
# Run all Android E2E tests
npm run test:e2e:android

# Run specific Android test suites
npm run test:e2e:android:home
npm run test:e2e:android:cross-feature-integration
npm run test:e2e:android:semester-content

# Generate and view Allure reports
npm run allure:generate
npm run allure:open
```

## Known Issues

### Cross-Feature Integration Test Failures

**Status:** ⚠️ 2 failures in setup/teardown hooks

The `cross-feature-integration.spec.ts` test suite fails in `beforeEach` and `afterEach` hooks when `navigateToHome()` times out after 40 seconds trying to locate the `Semester1` element. This prevents the actual test cases from running.

**Error:** `element ("~Semester1") still not displayed after 40000ms` at `BasePage.ts:105`

**Root Cause:** The app may be in an unexpected state after test runs, or the navigation logic needs improvement to handle edge cases.

**Impact:** 10 tests passing, 2 failing (both in hooks). Other test suites pass successfully.

**Suggestions for Developers:**

1. **Navigation Reliability:** Add robust state detection, explicit waits for app transitions, and retry logic with exponential backoff
2. **App State Management:** Ensure proper reset between tests and add logging for state transitions
3. **Timeout Configuration:** Review 40s timeout, make it configurable, add intermediate checks to fail fast
4. **Alternative Strategies:** UIAutomator selectors have been added as fallback (see UIAutomator Selectors section). Also consider deep links or app-specific navigation instead of back button presses
5. **Test Isolation:** Ensure clean state between tests, test different execution orders
6. **Debugging:** Add screenshots at failure points, log app package/activity, use Appium Inspector

**Workaround:** Run passing test suites individually:
```bash
npm run test:e2e:android:home
npm run test:e2e:android:semester-content
```
