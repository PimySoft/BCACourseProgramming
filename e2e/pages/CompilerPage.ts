import { BasePage } from './BasePage';

export class CompilerPage extends BasePage {
  async waitForPageLoad(): Promise<void> {
    await this.menuButton.waitForDisplayed({ timeout: 15000 });
  }
}

