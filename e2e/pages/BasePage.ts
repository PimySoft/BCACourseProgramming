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
    return this.driver.$('~menuButton');
  }

  async click(element: WebdriverIOElement, timeout: number = 10000): Promise<void> {
    await element.waitForDisplayed({ timeout });
    await element.click();
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
    const homeButton = this.driver.$('~Semester1');
    const exists = await homeButton.isExisting();
    if (!exists) {
      return false;
    }
    return await homeButton.isDisplayed();
  }

  async navigateToHome(): Promise<void> {
    await this.dismissExternalApps();
    
    if (await this.isOnHomePage()) {
      return;
    }

    await this.driver.activateApp(APP_PACKAGE_NAME);

    const homeButton = this.driver.$('~Semester1');
    const maxBackPresses = 10;
    
    for (let i = 0; i < maxBackPresses; i++) {
      if (await this.isOnHomePage()) {
        await expect(homeButton).toBeDisplayed({ 
          message: `Home page should be visible after ${i + 1} back button presses` 
        });
        return;
      }
      await this.driver.pressKeyCode(4);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (await this.isOnHomePage()) {
      return;
    }
    // Eccessive timeout to ensure home page is loaded. Team will need to improve performance.
    await homeButton.waitForDisplayed({ timeout: 40000 });
  }

  async dismissLanguageModal(): Promise<void> {
    const closeButton = this.driver.$('~languageModalCloseButton');
    const exists = await closeButton.isExisting();
    if (exists) {
      await closeButton.waitForDisplayed({ timeout: 10000 });
      await closeButton.click();
    }
  }

  async cleanup(): Promise<void> {
    await this.hideKeyboard();
    
    const contexts = await this.driver.getContexts();
    const currentContext = await this.driver.getContext();
    if (contexts.length > 1 && currentContext !== 'NATIVE_APP') {
      await this.driver.switchContext('NATIVE_APP');
    }

    if (await this.isOnHomePage()) {
      return;
    }

    const cleanupTimeout = 15000;
    const homeButton = this.driver.$('~Semester1');
    
    try {
      await Promise.race([
        this.navigateToHome(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Cleanup navigation timeout')), cleanupTimeout)
        )
      ]);
    } catch (error) {
      const isHome = await this.isOnHomePage();
      if (!isHome) {
        throw new Error(`Cleanup failed: Could not navigate to home page within ${cleanupTimeout}ms`);
      }
      return;
    }

    const isHome = await this.isOnHomePage();
    if (!isHome) {
      await expect(homeButton).toBeDisplayed({ 
        message: 'Home page should be visible after cleanup navigation' 
      });
    }
  }
}
