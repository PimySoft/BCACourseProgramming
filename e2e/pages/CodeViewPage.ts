import { BasePage } from './BasePage';

export class CodeViewPage extends BasePage {
  get copyButton() {
    return this.driver.$('~copyButton');
  }

  async waitForPageLoad(): Promise<void> {
    await this.menuButton.waitForDisplayed({ timeout: 15000 });
  }
}

