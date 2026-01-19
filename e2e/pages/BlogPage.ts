import { expect } from '@wdio/globals';
import { BasePage } from './BasePage';

export class BlogPage extends BasePage {
  get pageTitle() {
    return this.getPageTitleByText('Career Guidance');
  }

  async waitForPageLoad(): Promise<void> {
    await this.dismissLanguageModal();
    await expect(this.pageTitle).toBeDisplayed({ 
      message: 'Page title "Career Guidance" should be displayed on blog page' 
    });
  }
}

