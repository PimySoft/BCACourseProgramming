# Appium E2E Testing Framework

Appium 3 + TypeScript + WebdriverIO for Android testing with Allure reporting.

## Structure

```
e2e/
├── pages/           # Page Object Model
│   ├── BasePage.ts      # Base class with common methods
│   ├── HomePage.ts      # Home page elements and actions
│   ├── BlogPage.ts      # Blog page
│   ├── CompilerPage.ts  # Compiler page
│   ├── InterviewPage.ts # Interview page
│   ├── SemPage.ts       # Semester content page
│   ├── CodeViewPage.ts  # Code view page
│   └── MCQPage.ts       # MCQ page
├── specs/           # Test files
│   ├── home.spec.ts                    # Home page tests
│   ├── compiler.spec.ts                # Compiler page tests
│   ├── cross-feature-integration.spec.ts # Cross-feature navigation tests
│   └── semester-content-flow.spec.ts   # Semester content navigation tests
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
npm run test:e2e:android:compiler
npm run test:e2e:android:cross-feature-integration
npm run test:e2e:android:semester-content

# Generate and view Allure reports
npm run allure:generate
npm run allure:open
```

## Test Coverage

Current test suite includes:
- **Home Page Tests** (6 tests): Element display, navigation, scrolling, semester cards
- **Compiler Page Tests** (2 tests): Navigation to/from compiler page (no WebView interactions)
- **Cross-Feature Integration Tests** (5 tests): Navigation between home, blog, compiler, and interview pages
- **Semester Content Flow Tests** (4 tests): Semester navigation, tab verification, scrolling, menu functionality

**Total: 17 tests, all passing** ✅

All tests use UIAutomator selectors for reliable element location and avoid WebView interactions for stability.
