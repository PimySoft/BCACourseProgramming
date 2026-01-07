import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Semester cards
  get semester1() { return this.driver.$('android=new UiSelector().description("Semester1")'); }
  get semester2() { return this.driver.$('android=new UiSelector().description("Semester2")'); }
  get semester3() { return this.driver.$('android=new UiSelector().description("Semester3")'); }
  get semester4() { return this.driver.$('android=new UiSelector().description("Semester4")'); }
  get semester5() { return this.driver.$('android=new UiSelector().description("Semester5")'); }
  get semester6() { return this.driver.$('android=new UiSelector().description("Semester6")'); }

  // Navigation buttons
  get interview() { return this.driver.$('android=new UiSelector().description("Interview")'); }
  get blog() { return this.driver.$('android=new UiSelector().description("Blog")'); }
  get compiler() { return this.driver.$('android=new UiSelector().description("Compiler")'); }

  // Action buttons
  get rateUs() { return this.driver.$('android=new UiSelector().description("RateUs")'); }
  get share() { return this.driver.$('android=new UiSelector().description("Share")'); }
  get contribute() { return this.driver.$('android=new UiSelector().description("Contribute")'); }

  async openSemester(semester: 1 | 2 | 3 | 4 | 5 | 6): Promise<void> {
    const semesterMap = {
      1: this.semester1, 2: this.semester2, 3: this.semester3,
      4: this.semester4, 5: this.semester5, 6: this.semester6,
    };
    await this.click(semesterMap[semester]);
  }
}
