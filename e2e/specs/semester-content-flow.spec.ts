import { expect } from '@wdio/globals';
import { HomePage } from '../pages/HomePage';
import { SemPage } from '../pages/SemPage';
import { CodeViewPage } from '../pages/CodeViewPage';
import { ContentViewPage } from '../pages/ContentViewPage';

/**
 * Semester Content Navigation Flow Test
 * 
 * This test demonstrates:
 * - Deep navigation through app structure
 * - Tab switching functionality
 * - Content validation
 * - Multi-page integration
 * - Scroll and interaction handling
 * 
 * Great for showing navigation testing expertise!
 */
describe('Semester Content Navigation Flow', () => {
  let homePage: HomePage;
  let semPage: SemPage;

  before(async () => {
    homePage = new HomePage(driver);
    semPage = new SemPage(driver);
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

  it('should navigate through semester content and verify all tabs', async () => {
    // Step 1: Navigate to Semester 1
    await homePage.openSemester(1);
    await semPage.waitForPageLoad();

    // Step 2: Verify semester page loaded
    await expect(semPage.menuButton).toBeDisplayed({ 
      message: 'Menu button should be displayed on semester page' 
    });

    // Step 3: Verify Notes tab is displayed by default
    await expect(semPage.notesTab).toBeDisplayed({ 
      message: 'Notes tab should be displayed by default on semester page' 
    });

    // Step 4: Switch to Code tab
    await semPage.switchToCodeTab();
    // Wait is handled inside switchToCodeTab()

    // Step 5: Verify Code tab is active
    await expect(semPage.codeTab).toBeDisplayed({ 
      message: 'Code tab should be displayed after switching to Code tab' 
    });

    // Step 6: Switch back to Notes tab
    await semPage.switchToNotesTab();
    // Wait is handled inside switchToNotesTab()

    // Step 7: Verify Notes tab is active again
    await expect(semPage.notesTab).toBeDisplayed({ 
      message: 'Notes tab should be displayed after switching back from Code tab' 
    });

    // Step 8: Verify Start Quiz button is available
    // NOTE: This assertion is skipped because the Start Now button is not available
    // in the current app state (quiz tab is commented out in TabContainer.js).
    // To re-enable: Uncomment quiz tab OR add button to FlatList footer in Sem.js
    // await expect(semPage.startNowButton).toBeDisplayed({ 
    //   message: 'Start Now button should be available on semester page' 
    // });
  });

  it('should test scrolling functionality on semester page', async () => {
    await homePage.openSemester(1);
    await semPage.waitForPageLoad();

    // Test scroll down
    await semPage.swipeDown();

    // Test scroll up
    await semPage.swipeUp();

    // Verify page is still functional after scrolling
    await expect(semPage.menuButton).toBeDisplayed({ 
      message: 'Menu button should still be accessible after scrolling' 
    });
  });

  it('should navigate through multiple semesters and verify consistency', async () => {
    const semesters = [1, 2, 3] as const;

    for (const semester of semesters) {
      // Navigate to semester
      await homePage.openSemester(semester);
      await semPage.waitForPageLoad();

      // Verify common elements exist
      await expect(semPage.menuButton).toBeDisplayed({ 
        message: `Menu button should be displayed on Semester ${semester} page` 
      });

      await expect(semPage.notesTab).toBeDisplayed({ 
        message: `Notes tab should be displayed on Semester ${semester} page` 
      });

      await expect(semPage.codeTab).toBeDisplayed({ 
        message: `Code tab should be displayed on Semester ${semester} page` 
      });

      // Test tab switching
      await semPage.switchToCodeTab();
      // Wait is handled inside switchToCodeTab()
      await semPage.switchToNotesTab();
      // Wait is handled inside switchToNotesTab()

      // Navigate back to home - ensure clean state for next iteration
      await semPage.openMenu();
      await homePage.waitForPageLoad();
    }
  });

  it('should open menu on semester page', async () => {
    await homePage.openSemester(1);
    await semPage.waitForPageLoad();

    // Verify menu button is available before opening
    await expect(semPage.menuButton).toBeDisplayed({ 
      message: 'Menu button should be displayed before opening menu' 
    });

    // Open menu
    await semPage.openMenu();

    // Verify menu button is still accessible after opening
    // Note: Menu state verification depends on actual implementation
    // This demonstrates menu interaction testing
    await expect(semPage.menuButton).toBeDisplayed({ 
      message: 'Menu button should remain accessible after opening menu' 
    });
  });
});

