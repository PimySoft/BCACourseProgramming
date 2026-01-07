import type { Options } from '@wdio/types';
import * as fs from 'fs';
import * as path from 'path';

export const config: Options.Testrunner = {
  runner: 'local',
  port: 4723,
  path: '/',
  
  specs: [
    './e2e/specs/**/*.ts'
  ],
  
  exclude: [],
  
  maxInstances: 1,
  
  capabilities: [
    {
      platformName: 'Android',
      'appium:platformVersion': '16', // Match your emulator version
      'appium:deviceName': 'Android Emulator',
      'appium:app': './android/app/build/outputs/apk/debug/app-debug.apk',
      'appium:appPackage': 'technark.bca_courprogramming',
      'appium:appActivity': 'com.bcafresh.MainActivity',
      'appium:automationName': 'UiAutomator2',
      'appium:noReset': false,
      'appium:fullReset': true, // Clear app data to avoid update modals
      'appium:newCommandTimeout': 300,
      'appium:connectHardwareKeyboard': true,
    }
  ],
  
  logLevel: 'info',
  
  bail: 0,
  
  baseUrl: 'http://localhost:4723',
  
  waitforTimeout: 10000,
  
  connectionRetryTimeout: 120000,
  
  connectionRetryCount: 3,
  
  services: [
    ['appium', {
      args: {
        address: 'localhost',
        port: 4723,
        relaxedSecurity: true
      },
      logPath: './logs'
    }]
  ],
  
  framework: 'mocha',
  
  reporters: [
    'spec',
    ['allure', {
      outputDir: 'allure-results',
      disableWebdriverStepsReporting: false,
      disableWebdriverScreenshotsReporting: false,
    }],
    ['junit', {
      outputDir: './test-results',
      outputFileFormat: function(options: any) {
        return `results-${options.cid}.xml`
      }
    }]
  ],
  
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  },
  
  before: async function (capabilities, specs) {
    // Add any setup before tests run
  },
  
  beforeSpec: async function (spec, capabilities) {
    // Add any setup before each spec
  },
  
  afterSpec: async function (spec, capabilities, result) {
    // Add any cleanup after each spec
  },
  
  afterTest: async function (test, context, { error, result, duration, passed, retries }) {
    // Take screenshot on failure
    if (!passed) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const testName = test.title.replace(/\s+/g, '_');
      const filename = `screenshot_${testName}_${timestamp}.png`;
      const screenshotDir = path.join(process.cwd(), 'screenshots');
      const filepath = path.join(screenshotDir, filename);
      
      try {
        // Create screenshots directory if it doesn't exist
        if (!fs.existsSync(screenshotDir)) {
          fs.mkdirSync(screenshotDir, { recursive: true });
        }
        
        // Take screenshot
        await driver.saveScreenshot(filepath);
        console.log(`📸 Screenshot saved: ${filepath}`);
        
        // Attach screenshot to Allure report
        const { addAttachment } = await import('@wdio/allure-reporter');
        const screenshotBuffer = fs.readFileSync(filepath);
        addAttachment('Failure Screenshot', screenshotBuffer, 'image/png');
      } catch (screenshotError) {
        console.error(`❌ Failed to take screenshot: ${screenshotError}`);
      }
    }
  },
  
  after: async function (result, capabilities, specs) {
    // Add any cleanup after all tests
  },
  
  onComplete: function(exitCode, config, capabilities, results) {
    // Add any final cleanup
  }
};

