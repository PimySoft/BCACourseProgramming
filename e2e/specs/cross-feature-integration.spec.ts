import { expect } from '@wdio/globals';
import { HomePage } from '../pages/HomePage';
import { BlogPage } from '../pages/BlogPage';
import { CompilerPage } from '../pages/CompilerPage';
import { InterviewPage } from '../pages/InterviewPage';
import { SemPage } from '../pages/SemPage';

describe('Cross-Feature Integration Tests', () => {
  let homePage: HomePage;
  let blogPage: BlogPage;
  let compilerPage: CompilerPage;
  let interviewPage: InterviewPage;
  let semPage: SemPage;

  before(async () => {
    homePage = new HomePage(driver);
    blogPage = new BlogPage(driver);
    compilerPage = new CompilerPage(driver);
    interviewPage = new InterviewPage(driver);
    semPage = new SemPage(driver);
  });

  beforeEach(async () => {
    await homePage.navigateToHome();
    await homePage.waitForPageLoad();
  });

  afterEach(async () => {
    await homePage.cleanup();
  });

  it('should navigate from home to blog and back', async () => {
    await expect(homePage.menuButton).toBeDisplayed({ 
      message: 'Menu button should be displayed on home page' 
    });

    await homePage.click(homePage.blog);
    await blogPage.waitForPageLoad();

    await expect(blogPage.menuButton).toBeDisplayed({ 
      message: 'Menu button should be displayed on blog page' 
    });

    await blogPage.swipeDown();
    await blogPage.swipeUp();

    await blogPage.navigateToHome();
    await homePage.waitForPageLoad();

    await expect(homePage.menuButton).toBeDisplayed({ 
      message: 'Should return to home page after navigating from blog' 
    });
  });

  it('should navigate from home to compiler and back', async () => {
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
  });

  it('should navigate from home to interview page', async () => {
    await homePage.click(homePage.interview);
    await interviewPage.waitForPageLoad();

    await expect(interviewPage.menuButton).toBeDisplayed({ 
      message: 'Menu button should be displayed on interview page' 
    });

    await interviewPage.swipeDown();

    await interviewPage.navigateToHome();
    await homePage.waitForPageLoad();

    await expect(homePage.menuButton).toBeDisplayed({ 
      message: 'Should return to home page after navigating from interview' 
    });
  });

  it('should verify all main navigation elements are accessible from home', async () => {
    await homePage.waitForPageLoad();

    await expect(homePage.compiler).toBeDisplayed({ 
      message: 'Compiler button should be displayed on home page' 
    });

    await expect(homePage.blog).toBeDisplayed({ 
      message: 'Blog button should be displayed on home page' 
    });

    await expect(homePage.interview).toBeDisplayed({ 
      message: 'Interview button should be displayed on home page' 
    });

    await expect(homePage.getSemester(1)).toBeDisplayed({ 
      message: 'Semester 1 card should be displayed on home page' 
    });

    await expect(homePage.getSemester(2)).toBeDisplayed({ 
      message: 'Semester 2 card should be displayed on home page' 
    });
  });

  it('should test navigation persistence and state management', async () => {
    await homePage.openSemester(1);
    await semPage.waitForPageLoad();

    await semPage.switchToCodeTab();

    await semPage.navigateToHome();

    await homePage.waitForPageLoad();
    await homePage.openSemester(1);
    await semPage.waitForPageLoad();

    await expect(semPage.menuButton).toBeDisplayed({ 
      message: 'Menu button should be displayed when returning to semester page' 
    });
  });
});

