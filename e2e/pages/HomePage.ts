import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Semester cards
  getSemester(number: 1 | 2 | 3 | 4 | 5 | 6) {
    return this.driver.$(`android=new UiSelector().description("Semester${number}")`);
  }

  // Navigation buttons
  get interview() { return this.driver.$('android=new UiSelector().description("Interview")'); }
  get blog() { return this.driver.$('android=new UiSelector().description("Blog")'); }
  get compiler() { return this.driver.$('android=new UiSelector().description("Compiler")'); }

  // Action buttons
  get rateUs() { return this.driver.$('android=new UiSelector().description("RateUs")'); }
  get share() { return this.driver.$('android=new UiSelector().description("Share")'); }
  get contribute() { return this.driver.$('android=new UiSelector().description("Contribute")'); }

  async openSemester(semester: 1 | 2 | 3 | 4 | 5 | 6): Promise<void> {
    await this.click(this.getSemester(semester));
  }
}
