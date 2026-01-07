import { expect } from '@wdio/globals';
import { BasePage } from './BasePage';

export class SemPage extends BasePage {
  get notesTab() {
    return this.driver.$('~Notes');
  }

  get codeTab() {
    return this.driver.$('~Code');
  }

  get startNowButton() {
    return this.driver.$('~button-start-now');
  }

  async waitForPageLoad(): Promise<void> {
    await this.dismissLanguageModal();
    await expect(this.menuButton).toBeDisplayed({ 
      message: 'Menu button should be displayed on semester page' 
    });
  }

  async switchToNotesTab(): Promise<void> {
    await this.click(this.notesTab);
    await this.notesTab.waitForDisplayed({ timeout: 10000 });
  }

  async switchToCodeTab(): Promise<void> {
    await this.click(this.codeTab);
    await this.codeTab.waitForDisplayed({ timeout: 10000 });
  }
}

