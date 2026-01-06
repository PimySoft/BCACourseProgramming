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
    return this.getElementByTestId('my_button_testid');
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

## BasePage Methods

- `click(element, timeout?)` - Click element
- `typeText(element, text, clearFirst?)` - Type text
- `getText(element)` - Get text
- `isDisplayed(element)` - Check if displayed
- `swipeDown()` / `swipeUp()` - Scroll
- `hideKeyboard()` - Hide keyboard
- `waitForElement(element, timeout?)` - Wait for element to be displayed

## Running Tests

```bash
npm run test:e2e
npm run test:e2e:home
npm run allure:generate
npm run allure:open
```
