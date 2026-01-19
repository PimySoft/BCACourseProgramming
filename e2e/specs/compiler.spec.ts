import { expect } from '@wdio/globals';
import { HomePage } from '../pages/HomePage';
import { CompilerPage } from '../pages/CompilerPage';

describe('Compiler Page Tests', () => {
  let homePage: HomePage;
  let compilerPage: CompilerPage;

  before(async () => {
    homePage = new HomePage(driver);
    compilerPage = new CompilerPage(driver);
  });

  beforeEach(async () => {
    await homePage.dismissExternalApps();
    await homePage.navigateToHome();
    await homePage.waitForPageLoad();
  });

  afterEach(async () => {
    await homePage.cleanup();
  });

  it('should navigate to compiler page from home', async () => {
    await homePage.click(homePage.compiler);
    await compilerPage.waitForPageLoad();
  });

  it('should navigate back from compiler page to home', async () => {
    await homePage.click(homePage.compiler);
    await compilerPage.waitForPageLoad();

    await driver.pressKeyCode(4);
    await homePage.waitForPageLoad();
  });
});

