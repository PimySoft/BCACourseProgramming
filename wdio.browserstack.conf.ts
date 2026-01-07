import type { Options } from '@wdio/types';
import * as fs from 'fs';
import * as path from 'path';

// BrowserStack configuration
const browserstackConfig = {
  user: process.env.BROWSERSTACK_USERNAME || '',
  key: process.env.BROWSERSTACK_ACCESS_KEY || '',
  app: process.env.BROWSERSTACK_APP_ID || '',
  buildName: process.env.BUILD_NAME || `Build-${new Date().toISOString()}`,
  projectName: process.env.PROJECT_NAME || 'BCACourseProgramming',
  sessionName: process.env.SESSION_NAME || 'E2E Test Session',
  debug: process.env.BROWSERSTACK_DEBUG === 'true',
  networkLogs: true,
  consoleLogs: 'info',
  video: true,
  local: false,
};

// Device configuration from environment or defaults
const deviceConfig = {
  deviceName: process.env.DEVICE_NAME || 'Samsung Galaxy S23',
  osVersion: process.env.OS_VERSION || '13.0',
  platformName: 'Android',
};

export const config: Options.Testrunner = {
  runner: 'local',
  hostname: 'hub.browserstack.com',
  port: 443,
  path: '/wd/hub',
  protocol: 'https',
  
  specs: [
    './e2e/specs/**/*.ts'
  ],
  
  exclude: [],
  
  maxInstances: 1,
  
  capabilities: [
    {
      'bstack:options': {
        userName: browserstackConfig.user,
        accessKey: browserstackConfig.key,
        buildName: browserstackConfig.buildName,
        projectName: browserstackConfig.projectName,
        sessionName: `${browserstackConfig.sessionName} - ${deviceConfig.deviceName}`,
        debug: browserstackConfig.debug,
        networkLogs: browserstackConfig.networkLogs,
        consoleLogs: browserstackConfig.consoleLogs,
        video: browserstackConfig.video,
        local: browserstackConfig.local,
        idleTimeout: 300,
      },
      platformName: deviceConfig.platformName,
      'appium:platformVersion': deviceConfig.osVersion,
      'appium:deviceName': deviceConfig.deviceName,
      'appium:app': browserstackConfig.app,
      'appium:appPackage': 'technark.bca_courprogramming',
      'appium:appActivity': 'com.bcafresh.MainActivity',
      'appium:automationName': 'UiAutomator2',
      'appium:noReset': false,
      'appium:fullReset': false,
      'appium:newCommandTimeout': 300,
      'appium:autoGrantPermissions': true,
      'appium:autoAcceptAlerts': true,
    }
  ],
  
  logLevel: 'info',
  
  bail: 0,
  
  waitforTimeout: 10000,
  
  connectionRetryTimeout: 120000,
  
  connectionRetryCount: 3,
  
  services: [],
  
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
  
  beforeSession: async function (config, capabilities, specs) {
    if (!browserstackConfig.user || !browserstackConfig.key) {
      throw new Error('BrowserStack credentials required. Set BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY');
    }
    if (!browserstackConfig.app) {
      throw new Error('BrowserStack App ID required. Set BROWSERSTACK_APP_ID or upload app first');
    }
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
  
  onComplete: function(exitCode, config, capabilities, results) {
    console.log('✅ Test execution completed');
    console.log(`📊 Total tests: ${results.tests}`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    
    if (browserstackConfig.user && browserstackConfig.key) {
      console.log('\n🔗 View test results on BrowserStack:');
      console.log(`   https://app-automate.browserstack.com/dashboard/v2/builds`);
    }
  }
};

