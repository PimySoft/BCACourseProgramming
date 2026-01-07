import { expect } from '@wdio/globals';
import { BasePage } from './BasePage';

export class CodeViewPage extends BasePage {
  get copyButton() {
    return this.driver.$('~copyButton');
  }

  async waitForPageLoad(): Promise<void> {
    await expect(this.menuButton).toBeDisplayed({ 
      message: 'Menu button should be displayed on code view page' 
    });
  }
}

