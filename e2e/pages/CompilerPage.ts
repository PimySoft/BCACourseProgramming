import { expect } from '@wdio/globals';
import { BasePage } from './BasePage';

export class CompilerPage extends BasePage {
  get pageTitle() {
    return this.getPageTitleByText('Compiler');
  }

  async waitForPageLoad(): Promise<void> {
    await this.dismissLanguageModal();
    await expect(this.pageTitle).toBeDisplayed({ 
      message: 'Page title "Compiler" should be displayed on compiler page' 
    });
  }
}

