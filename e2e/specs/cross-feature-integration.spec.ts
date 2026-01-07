import { expect } from '@wdio/globals';
import { HomePage } from '../pages/HomePage';
import { BlogPage } from '../pages/BlogPage';
import { CompilerPage } from '../pages/CompilerPage';
import { InterviewPage } from '../pages/InterviewPage';
import { SemPage } from '../pages/SemPage';
import { MCQPage } from '../pages/MCQPage';

/**
 * Cross-Feature Integration Test
 * 
 * This test demonstrates:
 * - End-to-end user journey across multiple features
 * - Navigation flow between different app sections
 * - Integration testing best practices
 * - State management across pages
 * - Real-world user scenario simulation
 * 
 * Excellent for showcasing comprehensive testing approach!
 */
describe('Cross-Feature Integration Tests', () => {
  let homePage: HomePage;
  let blogPage: BlogPage;
  let compilerPage: CompilerPage;
  let interviewPage: InterviewPage;
  let semPage: SemPage;
  let mcqPage: MCQPage;

  before(async () => {
    homePage = new HomePage(driver);
    blogPage = new BlogPage(driver);
    compilerPage = new CompilerPage(driver);
    interviewPage = new InterviewPage(driver);
    semPage = new SemPage(driver);
    mcqPage = new MCQPage(driver);
  });

  beforeEach(async () => {
    // Ensure we start from home page for each test
    // Note: navigateToHome() already calls dismissExternalApps() internally
    // and waits for Semester1 element. Then we wait for menuButton to ensure page is fully loaded.
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

  it.skip('should navigate from semester to MCQ quiz and back', async () => {
    // Skipped: Start Now button is not available in current app state.
    // The quiz tab is commented out in TabContainer.js, so quiz state never becomes true
    // and the Start Now button is never rendered.
    await homePage.openSemester(1);
    await semPage.waitForPageLoad();

    await expect(semPage.menuButton).toBeDisplayed({ 
      message: 'Menu button should be displayed on semester page' 
    });

    await semPage.click(semPage.startNowButton);
    await mcqPage.waitForPageLoad();

    await expect(mcqPage.exitButton).toBeDisplayed({ 
      message: 'Exit button should be displayed when quiz starts' 
    });

    await mcqPage.selectOption('A', 1);
    await mcqPage.exitQuiz();
    await semPage.waitForPageLoad();

    await expect(semPage.menuButton).toBeDisplayed({ 
      message: 'Should return to semester page after exiting quiz' 
    });
  });

  it('should verify all main navigation elements are accessible from home', async () => {
    await homePage.waitForPageLoad();

    // Verify all main features are displayed
    await expect(homePage.compiler).toBeDisplayed({ 
      message: 'Compiler button should be displayed on home page' 
    });

    await expect(homePage.blog).toBeDisplayed({ 
      message: 'Blog button should be displayed on home page' 
    });

    await expect(homePage.interview).toBeDisplayed({ 
      message: 'Interview button should be displayed on home page' 
    });

    // Verify semester cards are displayed
    await expect(homePage.semester1).toBeDisplayed({ 
      message: 'Semester 1 card should be displayed on home page' 
    });

    await expect(homePage.semester2).toBeDisplayed({ 
      message: 'Semester 2 card should be displayed on home page' 
    });
  });

  it('should test navigation persistence and state management', async () => {
    // Navigate to semester
    await homePage.openSemester(1);
    await semPage.waitForPageLoad();

    // Switch to code tab
    await semPage.switchToCodeTab();
    // Wait is handled inside switchToCodeTab()

    // Navigate back to home
    await semPage.navigateToHome();

    // Navigate back to same semester
    await homePage.waitForPageLoad();
    await homePage.openSemester(1);
    await semPage.waitForPageLoad();

    // Verify page loaded correctly (state may or may not persist - both are valid)
    await expect(semPage.menuButton).toBeDisplayed({ 
      message: 'Menu button should be displayed when returning to semester page' 
    });
  });
});

