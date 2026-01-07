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
    return await this.isDisplayed(this.homeButton);
  }

  async navigateToHome(): Promise<void> {
    await this.dismissExternalApps();
    await this.driver.activateApp(APP_PACKAGE_NAME);
    
    if (!(await this.isOnHomePage())) {
      await this.driver.pressKeyCode(4);
      await this.homeButton.waitForDisplayed({ timeout: 10000 });
    }
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
