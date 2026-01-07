import { BasePage } from './BasePage';

export class CodeViewPage extends BasePage {
  get copyButton() {
    return this.driver.$('~copyButton');
  }
}

