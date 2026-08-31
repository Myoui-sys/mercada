import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import type { BrowserContext, Page } from '@playwright/test';

export interface TestAccount {
  email: string;
  password: string;
}

export class MercattaWorld extends World {
  context!: BrowserContext;
  page!: Page;
  readonly baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';
  account: TestAccount = { email: 'maria@exemplo.com', password: 'senha123' };
  productName?: string;
  initialText?: string;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async open(path = '/') {
    await this.page.goto(new URL(path, this.baseUrl).toString());
  }
}

setWorldConstructor(MercattaWorld);
