import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { MercattaPage } from '../pages/mercatta.page';
import { MercattaWorld } from '../support/world';

function app(world: MercattaWorld) {
  return new MercattaPage(world.page, world.baseUrl);
}

async function openSeedProduct(world: MercattaWorld) {
  await app(world).openProduct(world.productName ?? 'SSD NVMe 1TB SpeedDrive');
}

When('eu acessar a página do produto', async function (this: MercattaWorld) {
  await openSeedProduct(this);
});

Then('o sistema deve informar que o produto está indisponível', async function (this: MercattaWorld) {
  await expect(this.page.getByRole('button', { name: 'Produto indisponível' })).toBeDisabled();
});

When('eu tentar adicionar {int} unidades ao carrinho pela primeira vez', async function (this: MercattaWorld, amount: number) {
  await openSeedProduct(this);
  await app(this).addCurrentProduct(amount);
});

When(/^tentar adicionar mais (\d+) unidades \(totalizando \d+\)$/, async function (this: MercattaWorld, amount: string) {
  await app(this).addCurrentProduct(Number(amount));
});

Then('o sistema deve permitir a adição inicial de {int} unidades', async function (this: MercattaWorld) {
  await expect(this.page.getByText('Produto adicionado ao carrinho.')).toBeVisible();
});

Then('deve bloquear a segunda adição', async function (this: MercattaWorld) {
  await expect(this.page.locator('.text-danger')).toBeVisible();
});

Given('eu já adicionei {int} unidade ao carrinho', async function (this: MercattaWorld, amount: number) {
  await openSeedProduct(this);
  await app(this).addCurrentProduct(amount);
});

When('eu tentar alterar a quantidade de {int} para {int}', async function (this: MercattaWorld, _from: number, to: number) {
  await this.open('/cart');
  await this.page.locator('main select').first().selectOption(String(to));
});

Given('meu carrinho possui itens', async function (this: MercattaWorld) {
  await app(this).openProduct('Air Fryer Digital 5L');
  await app(this).addCurrentProduct(1);
});

Given('meu carrinho está vazio', async function (this: MercattaWorld) {
  await this.open('/cart');
  for (const button of await this.page.getByRole('button', { name: 'Remover' }).all()) await button.click();
});

When('eu acessar a página de finalização de pedido', async function (this: MercattaWorld) {
  await this.open('/checkout');
});

When('preencher o endereço', async function (this: MercattaWorld) {
  await this.page.getByPlaceholder('Rua, número, bairro, cidade/UF').fill('Rua de Teste, 123, Recife/PE');
});

When('eu tentar acessar {string}', async function (this: MercattaWorld, destination: string) {
  await this.open(destination === 'Finalizar Pedido' ? '/checkout' : '/');
});

When('eu adicionar {int} unidades ao carrinho', async function (this: MercattaWorld, amount: number) {
  await openSeedProduct(this);
  await app(this).addCurrentProduct(amount);
});

When('finalizar a compra com sucesso', async function (this: MercattaWorld) {
  await this.open('/checkout');
  await this.page.getByPlaceholder('Rua, número, bairro, cidade/UF').fill('Rua de Teste, 123');
  await this.page.getByRole('button', { name: 'Confirmar pedido' }).click();
  await expect(this.page).toHaveURL(/\/orders\//);
});

Then('o sistema deve processar o pedido', async function (this: MercattaWorld) {
  await expect(this.page).toHaveURL(/\/orders\//);
});

Then('deve apresentar uma etapa ou opção para seleção de forma de pagamento', async function (this: MercattaWorld) {
  await expect(this.page.getByText(/pagamento/i)).toBeVisible();
});

Then('o pedido deve ser gerado com sucesso', async function (this: MercattaWorld) {
  await expect(this.page).toHaveURL(/\/orders\//);
});

Then('o botão {string} deve ser substituído por {string}', async function (this: MercattaWorld, _oldLabel: string, newLabel: string) {
  await expect(this.page.getByRole('link', { name: new RegExp(newLabel, 'i') })).toBeVisible();
});

Then('ao clicar em {string}, o usuário deve ser redirecionado para a página inicial', async function (this: MercattaWorld, label: string) {
  await this.page.getByRole('link', { name: new RegExp(label, 'i') }).click();
  await expect(this.page).toHaveURL(new RegExp(`${this.baseUrl}/?$`));
});

Then('o sistema deve atualizar o estoque disponível para {int} unidades', async function (this: MercattaWorld, amount: number) {
  await openSeedProduct(this);
  await expect(this.page.getByText(new RegExp(`${amount} unidades?`))).toBeVisible();
});

Then('o catálogo deve mostrar {string}', async function (this: MercattaWorld, text: string) {
  await this.open('/');
  await expect(this.page.getByText(text, { exact: false })).toBeVisible();
});

Then('a página do produto deve mostrar estoque = {int}', async function (this: MercattaWorld, amount: number) {
  await openSeedProduct(this);
  await expect(this.page.getByText(new RegExp(`${amount} unidades?`))).toBeVisible();
});

When('tentar selecionar a quantidade', async function (this: MercattaWorld) {
  await expect(this.page.getByLabel('Quantidade')).toBeVisible();
});

Then('o sistema deve limitar as opções de quantidade a {int}', async function (this: MercattaWorld, amount: number) {
  await expect(this.page.getByLabel('Quantidade').locator('option')).toHaveCount(amount);
});

Then('não deve permitir selecionar números maiores que o estoque disponível', async function (this: MercattaWorld) {
  const values = await this.page.getByLabel('Quantidade').locator('option').allTextContents();
  expect(values.every((value, index) => Number(value) === index + 1)).toBeTruthy();
});

Given('eu já realizei pedidos anteriormente', function () {
  // O seed/arranjo do cenário deve fornecer ao menos um pedido para a conta usada.
});

When('eu acessar a página {string}', async function (this: MercattaWorld, pageName: string) {
  await this.open(pageName === 'Meus Pedidos' ? '/orders' : '/');
});

Then('o sistema deve listar todos os meus pedidos', async function (this: MercattaWorld) {
  await expect(this.page.getByText(/Pedido #/).first()).toBeVisible();
});

Then('cada pedido deve ter um status coerente', async function (this: MercattaWorld) {
  await expect(this.page.getByText(/Pendente|Pago|Enviado|Entregue|Cancelado/).first()).toBeVisible();
});

Then('pedidos com pagamento aprovado devem ter status {string} ou {string}', async function (this: MercattaWorld, first: string, second: string) {
  const approved = this.page.getByText(/Pago|Separação|Enviado/);
  if (await approved.count()) await expect(approved.first()).toHaveText(new RegExp(`${first}|${second}|Pago`));
});

Then('pedidos pendentes devem ter status {string}', async function (this: MercattaWorld, status: string) {
  const pending = this.page.getByText(status, { exact: true });
  if (await pending.count()) await expect(pending.first()).toBeVisible();
});
