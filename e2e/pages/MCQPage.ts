import { BasePage } from './BasePage';

export class MCQPage extends BasePage {
  get exitButton() {
    return this.driver.$('~mcqExit');
  }

  // MainButton elements in test complete modal
  // MainButton uses pattern: button-{title-lowercase-with-dashes}
  get viewResultsButton() {
    return this.driver.$('~button-view-results');
  }

  get challengeFriendsButton() {
    return this.driver.$('~button-challenge-friends');
  }

  async waitForPageLoad(): Promise<void> {
    await this.exitButton.waitForDisplayed({ timeout: 15000 });
  }

  async exitQuiz(): Promise<void> {
    await this.click(this.exitButton);
    // Wait for navigation back to previous page (semester page)
    // The exit button should no longer be displayed
    const isExitButtonStillVisible = await this.isDisplayed(this.exitButton);
    if (isExitButtonStillVisible) {
      await this.exitButton.waitForDisplayed({ timeout: 5000, reverse: true });
    }
    // If button is already gone, navigation was successful
  }

  // Dynamic selectors - use helper methods
  getOptionButton(option: 'A' | 'B' | 'C' | 'D', questionIndex: number) {
    return this.driver.$(`~mcq-option-${option}-${questionIndex}`);
  }

  async selectOption(option: 'A' | 'B' | 'C' | 'D', questionIndex: number): Promise<void> {
    const optionButton = this.getOptionButton(option, questionIndex);
    await this.click(optionButton);
    // Wait for selection to register - verify option is still displayed or check for selection state
    await optionButton.waitForDisplayed({ timeout: 5000 });
  }

  getQuestionNavigationButton(questionNumber: number) {
    // questionNumber is 1-based (display number)
    return this.driver.$(`~mcq-question-${questionNumber}`);
  }

  async navigateToQuestion(questionNumber: number): Promise<void> {
    const questionButton = this.getQuestionNavigationButton(questionNumber);
    await this.click(questionButton);
    // Wait for question to load - verify option buttons are available
    const optionA = this.getOptionButton('A', questionNumber);
    await optionA.waitForDisplayed({ timeout: 10000 });
  }
}

