import { expect } from '@wdio/globals';
import { BasePage } from './BasePage';

export class InterviewPage extends BasePage {
  get pageTitle() {
    return this.getPageTitleByText('Interview Questions');
  }

  async waitForPageLoad(): Promise<void> {
    await this.dismissLanguageModal();
    await expect(this.pageTitle).toBeDisplayed({ 
      message: 'Page title "Interview Questions" should be displayed on interview page' 
    });
  }
}

