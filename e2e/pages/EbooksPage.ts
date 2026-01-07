import { BasePage } from './BasePage';

export class EbooksPage extends BasePage {
  async waitForPageLoad(): Promise<void> {
    await this.menuButton.waitForDisplayed({ timeout: 15000 });
  }

  // Dynamic selector - ebook items use pattern: ebook-{language}-{cleaned-book-name}-{index}
  // Helper method to find ebook item by language, index (0-based)
  getEbookItem(language: 'c' | 'cpp' | 'java' | 'sql', index: number) {
    // Note: Since testIDs are generated from book names, use XPath or find by accessibility label
    // For now, this is a placeholder - in practice, you'd search by accessibility label
    return this.driver.$(`//*[contains(@content-desc, 'Ebook')][${index + 1}]`);
  }
}

