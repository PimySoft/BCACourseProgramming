import type { Browser } from 'webdriverio';

export class Util {
  static async swipeDown(driver: Browser): Promise<void> {
    const { width, height } = await driver.getWindowSize();
    const startX = Math.round(width / 2);
    const startY = Math.round(height * 0.8);
    const endY = Math.round(height * 0.2);
    
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: startX, y: startY },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 300, x: startX, y: endY },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
    await driver.releaseActions();
  }

  static async swipeUp(driver: Browser): Promise<void> {
    const { width, height } = await driver.getWindowSize();
    const startX = Math.round(width / 2);
    const startY = Math.round(height * 0.2);
    const endY = Math.round(height * 0.8);
    
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: startX, y: startY },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 300, x: startX, y: endY },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
    await driver.releaseActions();
  }
}
