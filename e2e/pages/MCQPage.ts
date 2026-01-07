import { expect } from '@wdio/globals';
import { BasePage } from './BasePage';

export class MCQPage extends BasePage {
  get exitButton() {
    return this.driver.$('~mcqExit');
  }

  get viewResultsButton() {
    return this.driver.$('~button-view-results');
  }

  get challengeFriendsButton() {
    return this.driver.$('~button-challenge-friends');
  }

  async waitForPageLoad(): Promise<void> {
    await expect(this.exitButton).toBeDisplayed({ 
      message: 'Exit button should be displayed on MCQ quiz page' 
    });
  }

  async exitQuiz(): Promise<void> {
    await this.click(this.exitButton);
    const isExitButtonStillVisible = await this.isDisplayed(this.exitButton);
    if (isExitButtonStillVisible) {
      await this.exitButton.waitForDisplayed({ timeout: 5000, reverse: true });
    }
  }

  getOptionButton(option: 'A' | 'B' | 'C' | 'D', questionIndex: number) {
    return this.driver.$(`~mcq-option-${option}-${questionIndex}`);
  }

  async selectOption(option: 'A' | 'B' | 'C' | 'D', questionIndex: number): Promise<void> {
    const optionButton = this.getOptionButton(option, questionIndex);
    await this.click(optionButton);
    await optionButton.waitForDisplayed({ timeout: 5000 });
  }

  getQuestionNavigationButton(questionNumber: number) {
    return this.driver.$(`~mcq-question-${questionNumber}`);
  }

  async navigateToQuestion(questionNumber: number): Promise<void> {
    const questionButton = this.getQuestionNavigationButton(questionNumber);
    await this.click(questionButton);
    const optionA = this.getOptionButton('A', questionNumber);
    await optionA.waitForDisplayed({ timeout: 10000 });
  }
}

