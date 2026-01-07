import { expect } from '@wdio/globals';
import { BasePage } from './BasePage';

export class ContentViewPage extends BasePage {
  async waitForPageLoad(): Promise<void> {
    await expect(this.menuButton).toBeDisplayed({ 
      message: 'Menu button should be displayed on content view page' 
    });
  }
}

