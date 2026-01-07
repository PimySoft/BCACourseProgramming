import { BasePage } from './BasePage';

export class SemPage extends BasePage {
  get notesTab() {
    return this.driver.$('~Notes');
  }

  get codeTab() {
    return this.driver.$('~Code');
  }

  // MainButton uses pattern: button-{title-lowercase-with-dashes}
  get startNowButton() {
    return this.driver.$('~button-start-now');
  }

  async waitForPageLoad(): Promise<void> {
    await this.menuButton.waitForDisplayed({ timeout: 15000 });
  }

  async switchToNotesTab(): Promise<void> {
    await this.click(this.notesTab);
    // Wait for Notes tab to be active/displayed
    await this.notesTab.waitForDisplayed({ timeout: 10000 });
  }

  async switchToCodeTab(): Promise<void> {
    await this.click(this.codeTab);
    // Wait for Code tab to be active/displayed
    await this.codeTab.waitForDisplayed({ timeout: 10000 });
  }

  // Dynamic selector - list items use pattern: sem-item-{cleaned-question}-{index}
  // Helper method to find list item by index (0-based)
  getListItem(index: number) {
    // Note: Since testIDs are generated from question text, use XPath or find by accessibility label
    // For now, this is a placeholder - in practice, you'd search by accessibility label
    return this.driver.$(`//*[contains(@content-desc, 'Semester item')][${index + 1}]`);
  }
}

