import { expect } from '@wdio/globals';
import { BasePage } from './BasePage';

export class BlogPage extends BasePage {
  async waitForPageLoad(): Promise<void> {
    await expect(this.menuButton).toBeDisplayed({ 
      message: 'Menu button should be displayed on blog page' 
    });
  }

  // Dynamic selector - blog items use pattern: blog-item-{cleaned-title}-{index}
  // Helper method to find blog item by index (0-based)
  getBlogItem(index: number) {
    // Note: Since testIDs are generated from titles, use XPath or find by accessibility label
    // For now, this is a placeholder - in practice, you'd search by accessibility label
    return this.driver.$(`//*[contains(@content-desc, 'Blog item')][${index + 1}]`);
  }
}

