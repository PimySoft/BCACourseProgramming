import { expect } from '@wdio/globals';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  get interview() { return this.driver.$('~Interview'); }
  get blog() { return this.driver.$('~Blog'); }
  get compiler() { return this.driver.$('~Compiler'); }

  get pageTitle() {
    return this.getPageTitleByText('BCA Course Programming');
  }

  async waitForPageLoad(): Promise<void> {
    await this.dismissLanguageModal();
    await expect(this.pageTitle).toBeDisplayed({ 
      message: 'Page title "BCA Course Programming" should be displayed on home page' 
    });
  }
}
