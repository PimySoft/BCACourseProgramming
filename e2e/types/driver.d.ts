import { Browser } from 'webdriverio';

declare global {
  namespace WebdriverIO {
    interface Browser {
      // Add any custom browser methods here
    }
  }

  // Global driver instance available in test files
  const driver: Browser<'async'>;
}

export {};

