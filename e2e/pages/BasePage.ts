import type { Browser } from 'webdriverio';
import { expect } from '@wdio/globals';
import { Util } from '../utils/Util';
import { APP_PACKAGE_NAME } from '../config/constants';

type WebdriverIOElement = ReturnType<Browser['$']>;

export class BasePage {
  protected driver: Browser;

  constructor(driver: Browser) {
    this.driver = driver;
  }

  get menuButton() {
    return this.driver.$('android=new UiSelector().description("menuButton")');
  }

  get homeButton() {
    return this.driver.$('android=new UiSelector().description("Semester1")');
  }

  get languageModalCloseButton() {
    return this.driver.$('android=new UiSelector().description("languageModalCloseButton")');
  }

  async click(element: WebdriverIOElement, timeout: number = 10000): Promise<void> {
    await element.waitForDisplayed({ timeout });
    
    // Dismiss language modal if present (can block interactions on BrowserStack)
    await this.dismissLanguageModal();
    
    // Use touch actions directly for BrowserStack compatibility
    // BrowserStack sometimes doesn't register regular clicks on real devices
    const location = await element.getLocation();
    const size = await element.getSize();
    const x = location.x + (size.width / 2);
    const y = location.y + (size.height / 2);
    
    await this.driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: Math.round(x), y: Math.round(y) },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 150 },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
    await this.driver.releaseActions();
    
    // Small pause after click to let UI respond
    await this.driver.pause(300);
  }

  async isDisplayed(element: WebdriverIOElement): Promise<boolean> {
    const exists = await element.isExisting();
    if (!exists) {
      return false;
    }
    return await element.isDisplayed();
  }

  async swipeDown(): Promise<void> {
    await Util.swipeDown(this.driver);
  }

  async swipeUp(): Promise<void> {
    await Util.swipeUp(this.driver);
  }

  async hideKeyboard(): Promise<void> {
    await Util.hideKeyboard(this.driver);
  }

  async openMenu(): Promise<void> {
    await this.click(this.menuButton);
  }

  async dismissExternalApps(): Promise<void> {
    const currentPackage = await this.driver.getCurrentPackage();
    if (currentPackage && currentPackage.includes('gmail')) {
      await this.driver.pressKeyCode(4);
      await this.driver.activateApp(APP_PACKAGE_NAME);
      return;
    }

    const contexts = await this.driver.getContexts();
    const currentContext = await this.driver.getContext();
    if (contexts.length > 1 && currentContext !== 'NATIVE_APP') {
      await this.driver.switchContext('NATIVE_APP');
      await this.driver.pressKeyCode(4);
      await this.driver.activateApp(APP_PACKAGE_NAME);
    }
  }

  async isOnHomePage(): Promise<boolean> {
    return await this.isDisplayed(this.homeButton);
  }

  async navigateToHome(): Promise<void> {
    await this.dismissExternalApps();
    
    if (await this.isOnHomePage()) {
      await this.dismissLanguageModal();
      return;
    }

    await this.driver.activateApp(APP_PACKAGE_NAME);
    
    // Dismiss language modal that may appear on fresh installs (BrowserStack)
    await this.dismissLanguageModal();

    const homePageLoaded = await this.isOnHomePage();
    if (homePageLoaded) {
      return;
    }

    await this.driver.pressKeyCode(4);
    
    // Dismiss language modal again after navigation
    await this.dismissLanguageModal();
    
    // Excessive timeout to ensure home page is loaded. Team will need to improve performance.
    await this.homeButton.waitForDisplayed({ timeout: 40000 });
  }

  async dismissLanguageModal(): Promise<void> {
    const exists = await this.languageModalCloseButton.isExisting();
    if (exists) {
      await this.languageModalCloseButton.waitForDisplayed({ timeout: 10000 });
      await this.languageModalCloseButton.click();
    }
  }

  // Resets app state by activating app (resets to main activity).
  async cleanup(): Promise<void> {
    await this.driver.activateApp(APP_PACKAGE_NAME);
  }

  async waitForPageLoad(): Promise<void> {
    await expect(this.menuButton).toBeDisplayed({ 
      message: 'Menu button should be displayed on page' 
    });
  }
}
