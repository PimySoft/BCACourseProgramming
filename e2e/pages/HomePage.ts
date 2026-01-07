import { expect } from '@wdio/globals';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  get semester1() {
    return this.driver.$('~Semester1');
  }

  get semester2() {
    return this.driver.$('~Semester2');
  }

  get semester3() {
    return this.driver.$('~Semester3');
  }

  get semester4() {
    return this.driver.$('~Semester4');
  }

  get semester5() {
    return this.driver.$('~Semester5');
  }

  get semester6() {
    return this.driver.$('~Semester6');
  }

  get interview() {
    return this.driver.$('~Interview');
  }

  get blog() {
    return this.driver.$('~Blog');
  }

  get compiler() {
    return this.driver.$('~Compiler');
  }

  get rateUs() {
    return this.driver.$('~RateUs');
  }

  get share() {
    return this.driver.$('~Share');
  }

  get contribute() {
    return this.driver.$('~Contribute');
  }

  async waitForPageLoad(): Promise<void> {
    await expect(this.menuButton).toBeDisplayed({ 
      message: 'Menu button should be displayed on home page' 
    });
  }

  async openSemester(semester: 1 | 2 | 3 | 4 | 5 | 6): Promise<void> {
    const semesterMap = {
      1: this.semester1,
      2: this.semester2,
      3: this.semester3,
      4: this.semester4,
      5: this.semester5,
      6: this.semester6,
    };
    await this.click(semesterMap[semester]);
  }
}
