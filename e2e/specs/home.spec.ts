import { expect } from '@wdio/globals';
import { HomePage } from '../pages/HomePage';
import { BlogPage } from '../pages/BlogPage';
import { CompilerPage } from '../pages/CompilerPage';
import { SemPage } from '../pages/SemPage';

describe('Home Page Tests', () => {
  let homePage: HomePage;
  let blogPage: BlogPage;
  let compilerPage: CompilerPage;
  let semPage: SemPage;

  before(async () => {
    homePage = new HomePage(driver);
    blogPage = new BlogPage(driver);
    compilerPage = new CompilerPage(driver);
    semPage = new SemPage(driver);
  });

  beforeEach(async () => {
    await homePage.dismissExternalApps();
    await homePage.navigateToHome();
    await homePage.waitForPageLoad();
  });

  afterEach(async () => {
    await homePage.cleanup();
  });

  it('should display home page elements', async () => {
    await expect(homePage.menuButton).toBeDisplayed({ 
      message: 'Menu button should be displayed on home page' 
    });

    await expect(homePage.compiler).toBeDisplayed({ 
      message: 'Compiler button should be displayed on home page' 
    });
  });

  it('should navigate to blog page', async () => {
    await homePage.click(homePage.blog);
    await blogPage.waitForPageLoad();
    await expect(blogPage.menuButton).toBeDisplayed({ 
      message: 'Should navigate to blog page successfully' 
    });
  });

  it('should scroll on home page and maintain functionality', async () => {
    await expect(homePage.menuButton).toBeDisplayed({ 
      message: 'Menu button should be displayed before scrolling' 
    });
    
    await homePage.swipeDown();
    await homePage.swipeUp();
    
    await expect(homePage.menuButton).toBeDisplayed({ 
      message: 'Menu button should remain accessible after scrolling' 
    });
  });

  it('should navigate to compiler page', async () => {
    await homePage.click(homePage.compiler);
    await compilerPage.waitForPageLoad();
    await expect(compilerPage.menuButton).toBeDisplayed({ 
      message: 'Should navigate to compiler page successfully' 
    });
  });

  it('should display semester cards', async () => {
    await expect(homePage.getSemester(1)).toBeDisplayed({ 
      message: 'Semester 1 card should be displayed on home page' 
    });

    await expect(homePage.getSemester(2)).toBeDisplayed({ 
      message: 'Semester 2 card should be displayed on home page' 
    });
  });

  it('should navigate to semester 1 page', async () => {
    await homePage.openSemester(1);
    await semPage.waitForPageLoad();
    await expect(semPage.menuButton).toBeDisplayed({ 
      message: 'Should navigate to semester 1 page successfully' 
    });
  });
});

