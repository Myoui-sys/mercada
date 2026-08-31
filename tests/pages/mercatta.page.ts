import { expect, type Page } from '@playwright/test';

export class MercattaPage {
  constructor(private readonly page: Page, private readonly baseUrl: string) {}

  async open(path = '/') {
    await this.page.goto(new URL(path, this.baseUrl).toString());
  }

  async login(email: string, password: string) {
    await this.open('/login');
    await this.page.getByLabel('E-mail').fill(email);
    await this.page.getByLabel('Senha').fill(password);
    await this.page.getByRole('button', { name: 'Entrar' }).click();
    await expect(this.page.getByRole('button', { name: 'Sair' })).toBeVisible();
  }

  async search(term: string) {
    await this.page.getByRole('searchbox', { name: 'Buscar produtos' }).fill(term);
    await this.page.getByRole('button', { name: 'Buscar' }).click();
  }

  async openProduct(name: string) {
    await this.open('/');
    await this.search(name);
    await this.page.getByRole('link', { name: new RegExp(name, 'i') }).first().click();
    await expect(this.page.getByRole('heading', { name, exact: true })).toBeVisible();
  }

  async visibleProductNames() {
    return this.page.locator('main h3').allTextContents();
  }

  async addCurrentProduct(quantity = 1) {
    const select = this.page.getByLabel('Quantidade');
    if (await select.isVisible()) await select.selectOption(String(quantity));
    await this.page.getByRole('button', { name: /Adicionar ao carrinho/i }).click();
  }
}
