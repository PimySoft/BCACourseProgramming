import type { Browser } from 'webdriverio';
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
    try {
      return await element.isDisplayed();
    } catch {
      return false;
    }
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
    try {
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
    } catch (error) {
      try {
        await this.driver.activateApp(APP_PACKAGE_NAME);
      } catch {
        // Ignore
      }
    }
  }

  async navigateToHome(): Promise<void> {
    try {
      await this.dismissExternalApps();

      const homeButton = this.driver.$('~Semester1');
      const isHomePage = await this.isDisplayed(homeButton);
      
      if (isHomePage) {
        await homeButton.waitForDisplayed({ timeout: 5000 });
        return;
      }

      for (let i = 0; i < 10; i++) {
        await this.driver.pressKeyCode(4);
        
        try {
          await homeButton.waitForDisplayed({ timeout: 2000 });
          const isNowHome = await this.isDisplayed(homeButton);
          if (isNowHome) {
            return;
          }
        } catch {
          // Continue
        }
      }

      await this.driver.activateApp(APP_PACKAGE_NAME);
      await homeButton.waitForDisplayed({ timeout: 10000 });
    } catch (error) {
      console.log('Navigation to home failed, attempting app reactivation');
      try {
        await this.driver.activateApp(APP_PACKAGE_NAME);
        const homeButton = this.driver.$('~Semester1');
        await homeButton.waitForDisplayed({ timeout: 10000 });
      } catch (reactivateError) {
        throw new Error(`Failed to navigate to home page: ${reactivateError instanceof Error ? reactivateError.message : String(reactivateError)}`);
      }
    }
  }
}
