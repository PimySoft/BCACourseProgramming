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

  it('should navigate back to home from compiler page', async () => {
    await homePage.click(homePage.compiler);
    await compilerPage.waitForPageLoad();

    await expect(compilerPage.menuButton).toBeDisplayed({ 
      message: 'Menu button should be displayed on compiler page' 
    });

    await compilerPage.navigateToHome();
    await homePage.waitForPageLoad();

    await expect(homePage.menuButton).toBeDisplayed({ 
      message: 'Should return to home page after navigating from compiler' 
    });

    await expect(homePage.compiler).toBeDisplayed({ 
      message: 'Compiler button should be displayed after returning to home' 
    });
  });

  it('should display compiler page elements', async () => {
    await homePage.click(homePage.compiler);
    await compilerPage.waitForPageLoad();

    await expect(compilerPage.menuButton).toBeDisplayed({ 
      message: 'Menu button should be displayed on compiler page' 
    });
  });
});

