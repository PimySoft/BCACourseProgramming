import { expect } from '@wdio/globals';
import { HomePage } from '../pages/HomePage';
import { SemPage } from '../pages/SemPage';

describe('Semester Content Navigation Flow', () => {
  let homePage: HomePage;
  let semPage: SemPage;

  before(async () => {
    homePage = new HomePage(driver);
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

  it('should navigate through semester content and verify all tabs', async () => {
    await homePage.openSemester(1);
    await semPage.waitForPageLoad();

    await expect(semPage.menuButton).toBeDisplayed({ 
      message: 'Menu button should be displayed on semester page' 
    });

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

  it('should test scrolling functionality on semester page', async () => {
    await homePage.openSemester(1);
    await semPage.waitForPageLoad();

    await semPage.swipeDown();
    await semPage.swipeUp();

    await expect(semPage.menuButton).toBeDisplayed({ 
      message: 'Menu button should still be accessible after scrolling' 
    });
  });

  it('should navigate through multiple semesters and verify consistency', async () => {
    const semesters = [1, 2] as const;

    for (const semester of semesters) {
      await homePage.openSemester(semester);
      await semPage.waitForPageLoad();

      await expect(semPage.menuButton).toBeDisplayed({ 
        message: `Menu button should be displayed on Semester ${semester} page` 
      });

      await expect(semPage.notesTab).toBeDisplayed({ 
        message: `Notes tab should be displayed on Semester ${semester} page` 
      });

      await expect(semPage.codeTab).toBeDisplayed({ 
        message: `Code tab should be displayed on Semester ${semester} page` 
      });

      await semPage.switchToCodeTab();
      await semPage.switchToNotesTab();

      await semPage.navigateToHome();
      await homePage.waitForPageLoad();
      await homePage.semester1.waitForDisplayed({ timeout: 10000 });
    }
  });

  it('should open menu on semester page', async () => {
    await homePage.openSemester(1);
    await semPage.waitForPageLoad();

    await expect(semPage.menuButton).toBeDisplayed({ 
      message: 'Menu button should be displayed before opening menu' 
    });

    await semPage.openMenu();

    await expect(semPage.menuButton).toBeDisplayed({ 
      message: 'Menu button should remain accessible after opening menu' 
    });
  });
});

