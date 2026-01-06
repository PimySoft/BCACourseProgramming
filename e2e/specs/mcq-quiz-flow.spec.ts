import { expect } from '@wdio/globals';
import { HomePage } from '../pages/HomePage';
import { SemPage } from '../pages/SemPage';
import { MCQPage } from '../pages/MCQPage';

/**
 * MCQ Quiz Complete Flow Test
 * 
 * This test demonstrates:
 * - Complex multi-step user journey
 * - Dynamic element handling
 * - State management across pages
 * - Result validation
 * - Navigation between questions
 * 
 * Perfect for showcasing senior QA skills in interview!
 * 
 * NOTE: All tests in this suite are currently skipped because the "Start Now" button
 * is not available in the current app state. The quiz tab is commented out in
 * TabContainer.js, which means the quiz state never becomes true and the Start Now
 * button is never rendered.
 * 
 * To re-enable these tests in the future:
 * 1. Uncomment the quiz tab in src/CommonComponents/TabContainer/TabContainer.js (lines 77-107)
 *    OR
 * 2. Add the Start Now button to the FlatList footer in src/Components/Sem/Sem.js
 *    so it's always visible regardless of the quiz tab state
 * 3. Ensure the button has testID="button-start-now" (generated from title "Start Now")
 * 4. Remove .skip from all test cases below
 */
describe.skip('MCQ Quiz Complete Flow', () => {
  let homePage: HomePage;
  let semPage: SemPage;
  let mcqPage: MCQPage;

  before(async () => {
    homePage = new HomePage(driver);
    semPage = new SemPage(driver);
    mcqPage = new MCQPage(driver);
  });

  beforeEach(async () => {
    // Dismiss any external apps (like Gmail) that might be open
    await homePage.dismissExternalApps();
    // Ensure we start from home page for each test
    await homePage.navigateToHome();
    await homePage.waitForPageLoad();
  });

  afterEach(async () => {
    // Clean up: return to home page after each test
    // This ensures tests run in isolation
    await homePage.navigateToHome();
  });

  it('should navigate from home to semester and start quiz', async () => {
    await homePage.openSemester(1);
    await semPage.waitForPageLoad();

    await expect(semPage.menuButton).toBeDisplayed({ 
      message: 'Menu button should be displayed on semester page' 
    });

    await expect(semPage.startNowButton).toBeDisplayed({ 
      message: 'Start Now button should be displayed on semester page' 
    });
    
    await semPage.click(semPage.startNowButton);
    await mcqPage.waitForPageLoad();

    await expect(mcqPage.exitButton).toBeDisplayed({ 
      message: 'Exit button should be displayed when quiz starts' 
    });
  });

  it('should switch between tabs on semester page before starting quiz', async () => {
    await homePage.openSemester(1);
    await semPage.waitForPageLoad();

    await expect(semPage.notesTab).toBeDisplayed({ 
      message: 'Notes tab should be displayed by default on semester page' 
    });

    await semPage.switchToCodeTab();
    await expect(semPage.codeTab).toBeDisplayed({ 
      message: 'Code tab should be displayed after switching to Code tab' 
    });

    await semPage.switchToNotesTab();
    await expect(semPage.notesTab).toBeDisplayed({ 
      message: 'Notes tab should be displayed after switching back from Code tab' 
    });
  });

  it('should answer questions and navigate between them', async () => {
    await homePage.openSemester(1);
    await semPage.waitForPageLoad();
    await semPage.click(semPage.startNowButton);
    await mcqPage.waitForPageLoad();

    // Answer first question
    const optionA = mcqPage.getOptionButton('A', 1);
    await expect(optionA).toBeDisplayed({ 
      message: 'Option A for question 1 should be displayed' 
    });
    await mcqPage.selectOption('A', 1);

    // Navigate to question 2 if available
    const question2Button = mcqPage.getQuestionNavigationButton(2);
    const isQuestion2Available = await mcqPage.isDisplayed(question2Button);
    
    if (isQuestion2Available) {
      await mcqPage.navigateToQuestion(2);
      const optionB = mcqPage.getOptionButton('B', 2);
      await expect(optionB).toBeDisplayed({ 
        message: 'Option B for question 2 should be displayed after navigation' 
      });
      await mcqPage.selectOption('B', 2);
    }
  });

  it('should exit quiz and return to semester page', async () => {
    await homePage.openSemester(1);
    await semPage.waitForPageLoad();
    await semPage.click(semPage.startNowButton);
    await mcqPage.waitForPageLoad();

    // Answer a question before exiting
    await mcqPage.selectOption('A', 1);

    // Exit quiz
    await mcqPage.exitQuiz();
    await semPage.waitForPageLoad();

    await expect(semPage.menuButton).toBeDisplayed({ 
      message: 'Should return to semester page after exiting quiz' 
    });
  });

  it('should display view results button when quiz is completed', async () => {
    await homePage.openSemester(1);
    await semPage.waitForPageLoad();
    await semPage.click(semPage.startNowButton);
    await mcqPage.waitForPageLoad();

    // Answer questions to complete quiz
    const optionA = mcqPage.getOptionButton('A', 1);
    await expect(optionA).toBeDisplayed({ 
      message: 'Option A for question 1 should be available to select' 
    });
    await mcqPage.selectOption('A', 1);
    
    // Check if quiz completion modal appears
    const isViewResultsDisplayed = await mcqPage.isDisplayed(mcqPage.viewResultsButton);
    
    if (isViewResultsDisplayed) {
      await expect(mcqPage.viewResultsButton).toBeDisplayed({ 
        message: 'View Results button should be displayed after quiz completion' 
      });
    } else {
      // If quiz is not complete, verify we're still on quiz page
      await expect(mcqPage.exitButton).toBeDisplayed({ 
        message: 'Exit button should still be visible if quiz is not complete' 
      });
    }
  });

  it('should verify quiz navigation and question selection', async () => {
    await homePage.openSemester(1);
    await semPage.waitForPageLoad();
    await semPage.click(semPage.startNowButton);

    await mcqPage.waitForPageLoad();

    // Verify quiz page elements
    await expect(mcqPage.exitButton).toBeDisplayed({ 
      message: 'Exit button should be displayed on MCQ quiz page' 
    });

    // Test question navigation - verify navigation buttons exist
    const question1Button = mcqPage.getQuestionNavigationButton(1);
    const isQuestionNavAvailable = await mcqPage.isDisplayed(question1Button);
    
    if (isQuestionNavAvailable) {
      // Navigate through multiple questions and verify each
      for (let i = 1; i <= 3; i++) {
        const questionButton = mcqPage.getQuestionNavigationButton(i);
        await expect(questionButton).toBeDisplayed({ 
          message: `Question ${i} navigation button should be displayed` 
        });
        
        await mcqPage.navigateToQuestion(i);
        // Navigation wait is handled inside navigateToQuestion()
        
        // Verify we can select options for this question
        const optionA = mcqPage.getOptionButton('A', i);
        await expect(optionA).toBeDisplayed({ 
          message: `Option A should be available for question ${i}` 
        });
      }
    } else {
      // If navigation buttons don't exist, verify we can still answer questions
      const optionA = mcqPage.getOptionButton('A', 1);
      await expect(optionA).toBeDisplayed({ 
        message: 'At least option A for question 1 should be available without navigation buttons' 
      });
    }

    // Exit quiz
    await expect(mcqPage.exitButton).toBeDisplayed({ 
      message: 'Exit button should still be available before exiting quiz' 
    });
    await mcqPage.exitQuiz();
  });
});

