import { expect } from '@wdio/globals';
import { BasePage } from './BasePage';

export class InterviewPage extends BasePage {
  async waitForPageLoad(): Promise<void> {
    await expect(this.menuButton).toBeDisplayed({ 
      message: 'Menu button should be displayed on interview page' 
    });
  }

  // Dynamic selector - interview items use pattern: interview-item-{cleaned-title}-{index}
  // Helper method to find interview item by index (0-based)
  getInterviewItem(index: number) {
    // Note: Since testIDs are generated from titles, use XPath or find by accessibility label
    // For now, this is a placeholder - in practice, you'd search by accessibility label
    return this.driver.$(`//*[contains(@content-desc, 'Interview question')][${index + 1}]`);
  }
}

