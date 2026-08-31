import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { MercattaPage } from '../pages/mercatta.page';
import { MercattaWorld } from '../support/world';

function app(world: MercattaWorld) {
  return new MercattaPage(world.page, world.baseUrl);
}

Given('estou na página do produto {string}', async function (this: MercattaWorld, name: string) {
  this.productName = name;
  await app(this).openProduct(name);
});

Given('eu NUNCA comprei o produto {string}', function (this: MercattaWorld, name: string) {
  this.productName = name;
});

Given('eu comprei o produto {string}', function (this: MercattaWorld, name: string) {
  this.productName = name;
});

Given('a compra foi finalizada com sucesso', function () {
  // Pré-condição preparada pelos dados isolados da suíte.
});

When('eu acessar a página do produto {string}', async function (this: MercattaWorld, name: string) {
  await app(this).openProduct(name);
});

When('eu selecionar a nota {string} estrelas', async function (this: MercattaWorld, rating: string) {
  await this.page.getByLabel('Nota').selectOption(rating);
});

When('selecionar a nota {string} estrelas', async function (this: MercattaWorld, rating: string) {
  await this.page.getByLabel('Nota').selectOption(rating);
});

When('digitar o comentário {string}', async function (this: MercattaWorld, comment: string) {
  await this.page.getByPlaceholder(/Conte como foi sua experiência/).fill(comment);
  this.initialText = comment;
});

When('escrever o comentário {string}', async function (this: MercattaWorld, comment: string) {
  await this.page.getByPlaceholder(/Conte como foi sua experiência/).fill(comment);
  this.initialText = comment;
});

When('tentar enviar a avaliação', async function (this: MercattaWorld) {
  await this.page.getByRole('button', { name: 'Enviar avaliação' }).click();
});

Then('o sistema deve validar o comentário', async function (this: MercattaWorld) {
  await expect(this.page.getByText(this.initialText ?? '')).toBeVisible();
});

Then(/^(?:a avaliação deve ser adicionada|deve aparecer) na página do produto$/, async function (this: MercattaWorld) {
  await expect(this.page.getByText(this.initialText ?? '')).toBeVisible();
});

Then('a avaliação deve ser adicionada à página do produto', async function (this: MercattaWorld) {
  await expect(this.page.getByText(this.initialText ?? '')).toBeVisible();
});

Then('o nome do usuário deve aparecer junto com a avaliação', async function (this: MercattaWorld) {
  await expect(this.page.getByText(/Maria/i).last()).toBeVisible();
});

Then('a avaliação deve ser salva com sucesso', async function (this: MercattaWorld) {
  await expect(this.page.getByText(this.initialText ?? '')).toBeVisible();
});

Then('deve conter: nome do usuário, nota, comentário e data de postagem', async function (this: MercattaWorld) {
  const review = this.page.locator('section li').filter({ hasText: this.initialText ?? '' });
  await expect(review).toContainText(/Maria/);
  await expect(review).toContainText(this.initialText ?? '');
});

Given('eu já avaliei o produto anteriormente', function () {
  return 'pending' as const;
});

Given('estou na página do produto avaliado', function () {
  return 'pending' as const;
});

Then('o sistema deve permitir que o autor remova sua avaliação', function () {
  return 'pending' as const;
});

Then('a avaliação deve desaparecer da página do produto', function () {
  return 'pending' as const;
});

Given('que o produto possui avaliações registradas anteriormente', function () {
  return 'pending' as const;
});

When('eu atualizar a descrição do produto', function () {
  return 'pending' as const;
});

Then(/^(?:o sistema deve manter todas as avaliações existentes|a descrição deve ser a única informação alterada|nenhuma avaliação deve ser perdida ou modificada)$/, function () {
  return 'pending' as const;
});
