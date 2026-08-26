import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import { ConfigModule } from '@nestjs/config';

/**
 * Testes e2e do fluxo principal: registrar conta, logar, listar produtos
 * e bloquear rotas administrativas para usuários comuns.
 *
 * Roda contra um banco SQLite em memória (":memory:"), isolado e
 * descartado a cada execução — não toca no arquivo de dados real.
 */
describe('Fluxo de autenticação e catálogo (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.DATABASE_PATH = ':memory:';
    process.env.JWT_SECRET = 'segredo-de-teste';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejeita registro com e-mail inválido', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'nao-e-email', password: 'senha123', fullName: 'Teste' })
      .expect(400);
  });

  it('rejeita registro com senha curta', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'curta@teste.com', password: '123', fullName: 'Teste' })
      .expect(400);
  });

  it('registra um novo usuário e retorna um token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'nova@teste.com',
        password: 'senha123',
        fullName: 'Usuária de Teste',
      })
      .expect(201);

    expect(response.body.accessToken).toBeDefined();
    expect(response.body.user.email).toBe('nova@teste.com');
  });

  it('rejeita registro duplicado para o mesmo e-mail', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'nova@teste.com',
        password: 'outrasenha',
        fullName: 'Outra Pessoa',
      })
      .expect(409);
  });

  it('faz login com credenciais corretas', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'nova@teste.com', password: 'senha123' })
      .expect(200);

    expect(response.body.accessToken).toBeDefined();
  });

  it('rejeita login com senha errada', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'nova@teste.com', password: 'senhaerrada' })
      .expect(401);
  });

  it('lista produtos publicamente, mesmo sem catálogo populado', async () => {
    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('total', 0);
  });

  it('bloqueia criação de categoria para usuário sem token', async () => {
    await request(app.getHttpServer())
      .post('/categories')
      .send({ name: 'Nova Categoria', slug: 'nova-categoria' })
      .expect(401);
  });

  it('bloqueia criação de categoria para usuário comum autenticado', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'nova@teste.com', password: 'senha123' });

    const token = loginResponse.body.accessToken;

    await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Nova Categoria', slug: 'nova-categoria' })
      .expect(403);
  });
});
