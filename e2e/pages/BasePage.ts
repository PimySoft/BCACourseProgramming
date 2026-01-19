import type { Browser } from 'webdriverio';
import { Util } from '../utils/Util';
import { APP_PACKAGE_NAME } from '../config/constants';

type WebdriverIOElement = ReturnType<Browser['$']>;

export class BasePage {
  protected driver: Browser;

  constructor(driver: Browser) {
    this.driver = driver;
  }

  get languageModalCloseButton() {
    return this.driver.$('android=new UiSelector().description("languageModalCloseButton")');
  }

  getPageTitleByText(titleText: string) {
    return this.driver.$(`android=new UiSelector().text("${titleText}")`);
  }

  async click(element: WebdriverIOElement, timeout: number = 10000): Promise<void> {
    await element.waitForExist({ timeout });
    await element.waitForDisplayed({ timeout });
    await element.click();
  }

  async swipeDown(): Promise<void> {
    await Util.swipeDown(this.driver);
  }

  async swipeUp(): Promise<void> {
    await Util.swipeUp(this.driver);
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

  async navigateToHome(): Promise<void> {
    await this.dismissExternalApps();
    
    await this.driver.terminateApp(APP_PACKAGE_NAME);
    await this.driver.activateApp(APP_PACKAGE_NAME);
    await this.dismissLanguageModal();
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
}
