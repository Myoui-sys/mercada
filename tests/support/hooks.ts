import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  Status,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import { chromium, type Browser } from '@playwright/test';
import { MercattaWorld } from './world';

let browser: Browser;

setDefaultTimeout(20_000);

BeforeAll(async () => {
  browser = await chromium.launch({ headless: process.env.HEADED !== 'true' });
});

Before(async function (this: MercattaWorld) {
  this.context = await browser.newContext({ locale: 'pt-BR' });
  this.page = await this.context.newPage();
});

After(async function (this: MercattaWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    await this.attach(await this.page.screenshot({ fullPage: true }), 'image/png');
  }
  await this.context.close();
});

AfterAll(async () => {
  await browser?.close();
});
