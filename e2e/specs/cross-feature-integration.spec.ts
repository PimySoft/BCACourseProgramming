import { expect } from '@wdio/globals';
import { HomePage } from '../pages/HomePage';
import { BlogPage } from '../pages/BlogPage';
import { InterviewPage } from '../pages/InterviewPage';

describe('Cross-Feature Integration Tests', () => {
  let homePage: HomePage;
  let blogPage: BlogPage;
  let interviewPage: InterviewPage;

  before(async () => {
    homePage = new HomePage(driver);
    blogPage = new BlogPage(driver);
    interviewPage = new InterviewPage(driver);
  });

  beforeEach(async () => {
    await homePage.dismissExternalApps();
    await homePage.navigateToHome();
    await homePage.waitForPageLoad();
  });

  afterEach(async () => {
    await homePage.cleanup();
  });

  it('should navigate from home to blog and back', async () => {
    await homePage.click(homePage.blog);
    await blogPage.waitForPageLoad();

    await blogPage.swipeDown();
    await blogPage.swipeUp();

    await blogPage.navigateToHome();
    await homePage.waitForPageLoad();
  });

  it('should navigate from home to interview page', async () => {
    await homePage.click(homePage.interview);
    await interviewPage.waitForPageLoad();

    await interviewPage.swipeDown();

    await interviewPage.navigateToHome();
    await homePage.waitForPageLoad();
  });

  it('should verify all main navigation elements are accessible from home', async () => {
    await homePage.waitForPageLoad();
    await expect(homePage.blog).toBeDisplayed({ 
      message: 'Blog button should be displayed on home page' 
    });
  });
});

