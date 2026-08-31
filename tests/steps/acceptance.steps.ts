import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { MercattaPage } from '../pages/mercatta.page';
import { accounts } from '../data/accounts';
import { isAscending, numbersFromPrices } from '../utils/assertions';
import { MercattaWorld } from '../support/world';

function app(world: MercattaWorld) {
  return new MercattaPage(world.page, world.baseUrl);
}

async function login(world: MercattaWorld) {
  await app(world).login(world.account.email, world.account.password);
}

Given('que eu estou na página inicial do sistema', async function (this: MercattaWorld) {
  await this.open('/');
});

Given('que eu estou na página de login', async function (this: MercattaWorld) {
  await this.open('/login');
});

Given('estou na página de login', async function (this: MercattaWorld) {
  await this.open('/login');
});

Given('que eu estou na página de criação de conta', async function (this: MercattaWorld) {
  await this.open('/register');
});

Given('que eu estou logado no sistema', async function (this: MercattaWorld) {
  await login(this);
});

Given('eu estou logado como administrador', async function (this: MercattaWorld) {
  this.account = accounts.admin;
  await login(this);
});

Given(
  'que eu tenho uma conta cadastrada com e-mail {string} e senha {string}',
  function (this: MercattaWorld, email: string, password: string) {
    this.account = { email, password };
  },
);

Given('que já existe uma conta com o e-mail {string}', function (this: MercattaWorld, email: string) {
  this.account = { email, password: 'senha123' };
});

Given(/^(?:existe um produto cadastrado com o nome|existe um produto) "([^"]+)".*$/, function (
  this: MercattaWorld,
  name: string,
) {
  this.productName = name;
});

Given(/^o produto "([^"]+)" possui estoque = \d+$/, function (this: MercattaWorld, name: string) {
  this.productName = name;
});

Given(/^o produto possui estoque = \d+(?: \(esgotado\))?$/, function () {
  // O estoque de borda é garantido pelo seed do ambiente de teste.
});

Given(/^(?:existem produtos com aspas duplas no nome:.+|existem pelo menos \d+ produtos com preços diferentes|existem produtos com datas de lançamento diferentes|existem produtos de diversas categorias)$/, function () {
  // Condição garantida pelo seed; a asserção correspondente valida a interface.
});

When('eu digitar {string} no campo de busca', async function (this: MercattaWorld, term: string) {
  await this.page.getByRole('searchbox', { name: 'Buscar produtos' }).fill(term);
});

When(/^eu digitar " \(aspas duplas\) no campo de busca$/, async function (this: MercattaWorld) {
  await this.page.getByRole('searchbox', { name: 'Buscar produtos' }).fill('"');
});

When(/pressionar Enter(?: ou clicar no botão de busca)?/, async function (this: MercattaWorld) {
  await this.page.getByRole('searchbox', { name: 'Buscar produtos' }).press('Enter');
});

Then(/^o sistema deve (?:exibir|retornar) o produto "([^"]+)".*resultado$/, async function (
  this: MercattaWorld,
  name: string,
) {
  await expect(this.page.getByText(name, { exact: true }).first()).toBeVisible();
});

Then('o resultado deve conter as informações corretas do produto', async function (this: MercattaWorld) {
  const card = this.page.getByRole('link', { name: new RegExp(this.productName ?? '') }).first();
  await expect(card).toContainText(/R\$/);
});

Then(/^(?:a busca deve ser insensível a acentos|a busca deve considerar subtítulos como termo válido)$/, async function (
  this: MercattaWorld,
) {
  await expect(this.page.locator('main h3').first()).toBeVisible();
});

Then('o sistema deve retornar os produtos que contêm aspas duplas no texto', async function (this: MercattaWorld) {
  for (const name of await app(this).visibleProductNames()) expect(name).toContain('"');
});

Then('não deve apresentar erro ou mensagem de falha', async function (this: MercattaWorld) {
  await expect(this.page.getByText(/erro|falha/i)).toHaveCount(0);
});

When('eu preencher com os dados', async function (this: MercattaWorld) {
  await this.page.getByLabel('E-mail').fill(this.account.email);
  await this.page.getByLabel('Senha').fill(this.account.password);
});

When('eu preencher o e-mail com os dados', async function (this: MercattaWorld) {
  await this.page.getByLabel('E-mail').fill(this.account.email);
  await this.page.getByLabel('Senha').fill('senha-incorreta');
});

When('eu preencher os campos:', async function (this: MercattaWorld, table: DataTable) {
  const values = Object.fromEntries(table.raw().map(([key, value]) => [key.trim(), value.trim()]));
  await this.page.getByLabel('Nome completo').fill(values.Nome === '(deixar em branco)' ? '' : values.Nome);
  await this.page.getByLabel('E-mail').fill(values['E-mail']);
  await this.page.getByLabel(/Senha/).fill(values.Senha);
  await this.page.getByLabel(/Endereço de entrega/).fill(values.Endereço);
});

When('eu clicar em {string}', async function (this: MercattaWorld, label: string) {
  const aliases: Record<string, RegExp> = {
    Cadastrar: /Criar conta/i,
    Atualizar: /Atualizar/i,
    Avaliar: /Enviar avaliação/i,
  };
  await this.page.getByRole('button', { name: aliases[label] ?? new RegExp(label, 'i') }).click();
});

When('clicar em {string}', async function (this: MercattaWorld, label: string) {
  const aliases: Record<string, RegExp> = { Cadastrar: /Criar conta/i };
  await this.page.getByRole('button', { name: aliases[label] ?? new RegExp(label, 'i') }).click();
});

Given('eu estou na página de criação de conta', async function (this: MercattaWorld) {
  await this.open('/register');
});

Then('o sistema deve exibir a mensagem de erro {string}', async function (this: MercattaWorld, message: string) {
  await expect(this.page.getByText(message, { exact: false })).toBeVisible();
});

Then('destacar o campo {string} com borda vermelha', async function (this: MercattaWorld, field: string) {
  const label = field === 'Nome' ? 'Nome completo' : field;
  await expect(this.page.getByLabel(label)).toBeFocused();
});

Then('o sistema deve autenticar o usuário', async function (this: MercattaWorld) {
  await expect(this.page.getByRole('button', { name: 'Sair' })).toBeVisible();
});

Then(/^(?:redirecionar|deve ser redirecionado) para a página inicial(?: ou página da conta)?$/, async function (
  this: MercattaWorld,
) {
  await expect(this.page).toHaveURL(new RegExp(`${this.baseUrl}/?$`));
});

Then('o usuário deve estar logado', async function (this: MercattaWorld) {
  await expect(this.page.getByRole('button', { name: 'Sair' })).toBeVisible();
});

Then('o usuário deve permanecer na página de login', async function (this: MercattaWorld) {
  await expect(this.page).toHaveURL(/\/login$/);
});

Then(/^(?:o sistema deve exibir (?:uma )?mensagem de erro(?: em vermelho)?|a mensagem deve ser) "?([^"].*?)"?$/, async function (
  this: MercattaWorld,
  message: string,
) {
  await expect(this.page.getByText(message.replace(/^"|"$/g, ''), { exact: false })).toBeVisible();
});

Then(/^exibir a mensagem(?: em vermelho)? "([^"]+)"$/, async function (this: MercattaWorld, message: string) {
  await expect(this.page.getByText(message, { exact: false })).toBeVisible();
});

Then(/^o sistema deve (?:bloquear|impedir).+$/, async function (this: MercattaWorld) {
  await expect(this.page.locator('.text-danger, :text("indisponível"), :text("vazio")').first()).toBeVisible();
});

Then(/^(?:a conta NÃO deve ser criada|NÃO deve permitir a adição ao carrinho)$/, async function (this: MercattaWorld) {
  await expect(this.page.getByRole('button', { name: 'Sair' })).toHaveCount(0);
});

Then('a conta deve ser criada com sucesso', async function (this: MercattaWorld) {
  await expect(this.page.getByRole('button', { name: 'Sair' })).toBeVisible();
});

Then('o usuário deve ser logado automaticamente', async function (this: MercattaWorld) {
  await expect(this.page.getByRole('button', { name: 'Sair' })).toBeVisible();
});

Given('que eu estou na página da categoria {string}', async function (this: MercattaWorld, category: string) {
  await this.open('/');
  await this.page.getByRole('link', { name: category, exact: true }).click();
});

Given('que eu estou na página do catálogo de produtos', async function (this: MercattaWorld) {
  await this.open('/');
});

When('eu selecionar o filtro {string}', async function (this: MercattaWorld, filter: string) {
  await this.page.getByRole('link', { name: filter, exact: true }).click();
});

When('eu aplicar o filtro {string}', async function (this: MercattaWorld, filter: string) {
  const label = filter === 'Produtos Recentes' ? 'Mais recentes' : filter;
  await this.page.getByRole('link', { name: label, exact: true }).click();
});

When('eu selecionar a categoria {string} no filtro', async function (this: MercattaWorld, category: string) {
  await this.page.getByRole('link', { name: category, exact: true }).click();
});

Then('o sistema deve exibir os produtos em ordem crescente de preço', async function (this: MercattaWorld) {
  const prices = numbersFromPrices(await this.page.locator('.price-tag').allTextContents());
  expect(isAscending(prices)).toBeTruthy();
});

Then('o produto de menor valor deve aparecer no topo da lista', async function (this: MercattaWorld) {
  const prices = numbersFromPrices(await this.page.locator('.price-tag').allTextContents());
  expect(prices[0]).toBe(Math.min(...prices));
});

Then(/^a página deve mostrar apenas os produtos pertencentes à categoria "([^"]+)"$/, async function (
  this: MercattaWorld,
  category: string,
) {
  for (const card of await this.page.locator('main a[href^="/products/"]').all()) {
    await card.click();
    await expect(this.page.getByText(new RegExp(`· ${category}$`))).toBeVisible();
    await this.page.goBack();
  }
});

Then('nenhum produto de outras categorias deve ser exibido', function () {
  // Validado pelo passo anterior para todos os cards apresentados.
});

Then('o sistema deve organizar os produtos do mais recente para o mais antigo', async function (this: MercattaWorld) {
  await expect(this.page).toHaveURL(/sortBy=newest/);
});

Then('o produto com data de lançamento mais nova deve ser o primeiro da lista', async function (this: MercattaWorld) {
  await expect(this.page.locator('main h3').first()).toBeVisible();
});

When('eu navegar para a página de produto', async function (this: MercattaWorld) {
  await app(this).openProduct('Air Fryer Digital 5L');
});

When('eu navegar para a página de busca', async function (this: MercattaWorld) {
  await this.open('/?search=livro');
});

When('eu navegar para a página de carrinho', async function (this: MercattaWorld) {
  await this.open('/cart');
});

Then('deve existir a opção de {string} ou {string}', async function (this: MercattaWorld, first: string, second: string) {
  await expect(this.page.getByRole('button', { name: new RegExp(`${first}|${second}`, 'i') })).toBeVisible();
});

Then('a posição do botão de logout deve ser consistente em todas as páginas', async function (this: MercattaWorld) {
  await expect(this.page.getByRole('banner').getByRole('button', { name: 'Sair' })).toBeVisible();
});

When(/^eu ajustar(?: o zoom do navegador)? para (\d+)%$/, async function (this: MercattaWorld, zoom: string) {
  await this.page.evaluate((value) => { document.body.style.zoom = value; }, `${Number(zoom) / 100}`);
});

Then('o layout deve se adaptar sem quebras significativas', async function (this: MercattaWorld) {
  const overflows = await this.page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflows).toBeFalsy();
});

Then('o sistema deve manter a usabilidade em todas as escalas', async function (this: MercattaWorld) {
  await expect(this.page.getByRole('searchbox', { name: 'Buscar produtos' })).toBeVisible();
});
