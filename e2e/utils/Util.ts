import type { Browser } from 'webdriverio';

type WebdriverIOElement = ReturnType<Browser['$']>;

export class Util {
  static async swipeDown(driver: Browser): Promise<void> {
    const { width, height } = await driver.getWindowSize();
    const startX = Math.round(width / 2);
    const startY = Math.round(height * 0.8);
    const endY = Math.round(height * 0.2);
    
    try {
      // Try Appium mobile:swipe command first (more reliable for Appium)
      await driver.execute('mobile: swipe', {
        startX,
        startY,
        endX: startX,
        endY,
        duration: 0.5,
      });
    } catch {
      // Fallback to W3C performActions if mobile:swipe is not available
      await driver.performActions([
        {
          type: 'pointer',
          id: 'finger1',
          parameters: { pointerType: 'touch' },
          actions: [
            { type: 'pointerMove', duration: 0, x: startX, y: startY },
            { type: 'pointerDown', button: 0 },
            { type: 'pause', duration: 500 },
            { type: 'pointerMove', duration: 300, x: startX, y: endY },
            { type: 'pointerUp', button: 0 },
          ],
        },
      ]);
      await driver.releaseActions();
    }
  }

  static async swipeUp(driver: Browser): Promise<void> {
    const { width, height } = await driver.getWindowSize();
    const startX = Math.round(width / 2);
    const startY = Math.round(height * 0.2);
    const endY = Math.round(height * 0.8);
    
    try {
      // Try Appium mobile:swipe command first (more reliable for Appium)
      await driver.execute('mobile: swipe', {
        startX,
        startY,
        endX: startX,
        endY,
        duration: 0.5,
      });
    } catch {
      // Fallback to W3C performActions if mobile:swipe is not available
      await driver.performActions([
        {
          type: 'pointer',
          id: 'finger1',
          parameters: { pointerType: 'touch' },
          actions: [
            { type: 'pointerMove', duration: 0, x: startX, y: startY },
            { type: 'pointerDown', button: 0 },
            { type: 'pause', duration: 500 },
            { type: 'pointerMove', duration: 300, x: startX, y: endY },
            { type: 'pointerUp', button: 0 },
          ],
        },
      ]);
      await driver.releaseActions();
    }
  }

  static async hideKeyboard(driver: Browser): Promise<void> {
    try {
      await driver.hideKeyboard();
    } catch {
      // Keyboard not visible
    }
  }

  static async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
