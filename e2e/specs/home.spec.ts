import { expect } from '@wdio/globals';
import { HomePage } from '../pages/HomePage';
import { BlogPage } from '../pages/BlogPage';

describe('Home Page Tests', () => {
  let homePage: HomePage;
  let blogPage: BlogPage;

  before(async () => {
    homePage = new HomePage(driver);
    blogPage = new BlogPage(driver);
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
    await expect(homePage.blog).toBeDisplayed({ 
      message: 'Blog button should be displayed on home page' 
    });
  });

  it('should scroll on home page and maintain functionality', async () => {
    await expect(homePage.pageTitle).toBeDisplayed({ 
      message: 'Page title should be displayed before scrolling' 
    });
    
    await homePage.swipeDown();
    await homePage.swipeUp();
    
    await expect(homePage.pageTitle).toBeDisplayed({ 
      message: 'Page title should remain accessible after scrolling' 
    });
  });

  it('should navigate to blog page', async () => {
    await homePage.click(homePage.blog);
    await blogPage.waitForPageLoad();
  });
});

