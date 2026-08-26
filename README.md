# Mercatta — simulador de e-commerce

Sistema de e-commerce completo e funcional, estilo "loja de tudo um pouco",
construído para servir como **sistema-alvo** em projetos de teste de
software. Não é uma maquete: cadastro, login, catálogo com busca e filtro,
carrinho, checkout com baixa real de estoque, histórico de pedidos e
avaliações de produto funcionam de ponta a ponta.

## Stack

| Camada     | Tecnologia                                          |
|------------|------------------------------------------------------|
| Backend    | NestJS + TypeScript + TypeORM + SQLite               |
| Frontend   | Next.js (App Router) + TypeScript + Tailwind CSS     |
| Autenticação | JWT (passport-jwt)                                 |
| Documentação da API | Swagger (`/api/docs`)                       |

Todo o código — back e front — é TypeScript.

## Estrutura do repositório

```
amazon-simulator/
├── backend/           # API NestJS
│   ├── src/
│   │   ├── modules/   # auth, users, categories, products, cart, orders, reviews
│   │   ├── common/    # guards, decorators, filtro global de exceção
│   │   ├── config/    # configuração via variáveis de ambiente
│   │   └── database/seeds/  # script de popular o banco
│   └── test/          # testes e2e
├── frontend/           # Next.js (App Router)
│   └── src/
│       ├── app/        # páginas (catálogo, produto, carrinho, checkout...)
│       ├── components/ # componentes de UI, produto, layout
│       ├── context/     # auth e carrinho (React Context)
│       └── lib/         # cliente de API e formatação
└── docker-compose.yml  # 6 instâncias isoladas (uma por grupo de alunos)
```

## Rodando localmente (sem Docker)

Requer Node.js 20+.

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed        # popula o banco com produtos, categorias e usuários de teste
npm run start:dev   # http://localhost:3001
```

Documentaçcão interativa da API: `http://localhost:3001/api/docs`

### 2. Frontend

Em outro terminal:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev          # http://localhost:3000
```

### Usuários de teste (criados pelo seed)

| E-mail                  | Senha      | Papel     | Observação                          |
|--------------------------|------------|-----------|--------------------------------------|
| admin@amazonsim.com      | senha123   | admin     | Pode criar/editar produtos e categorias |
| maria@exemplo.com        | senha123   | cliente   | Tem endereço cadastrado              |
| joao@exemplo.com         | senha123   | cliente   | **Sem** endereço cadastrado (propositalmente — bom caso de teste para checkout) |

## Rodando com Docker (recomendado para a turma)

O `docker-compose.yml` já sobe **6 pares backend+frontend totalmente
isolados** — um por grupo — cada um com seu próprio banco SQLite (volume
Docker separado). Ninguém esbarra nos dados de outro grupo, mas todos usam
exatamente o mesmo sistema.

```bash
docker compose up --build -d
```

Cada instância roda o seed automaticamente na primeira subida (se o banco
daquele grupo ainda não existir).

| Grupo | Frontend                     | API                          |
|-------|-------------------------------|-------------------------------|
| 1     | http://localhost:3100         | http://localhost:3101         |
| 2     | http://localhost:3200         | http://localhost:3201         |
| 3     | http://localhost:3300         | http://localhost:3301         |
| 4     | http://localhost:3400         | http://localhost:3401         |
| 5     | http://localhost:3500         | http://localhost:3501         |
| 6     | http://localhost:3600         | http://localhost:3601         |

Para adicionar ou remover grupos, copie um bloco `backend-N`/`frontend-N`
no `docker-compose.yml` e ajuste a faixa de portas — está comentado lá.

## O que o sistema cobre (bom material para o projeto final)

- **Autenticação e autorização**: JWT, papéis `customer`/`admin`, rotas
  administrativas protegidas por `RolesGuard`.
- **Validação de entrada**: todos os DTOs usam `class-validator`; testar
  campos obrigatórios, formatos (e-mail, UUID) e limites (preço negativo,
  nota de 1 a 5) é direto.
- **Busca, filtro, ordenação e paginação** de produtos (`GET /products`).
- **Máquina de estados** no pedido (`pending → paid → shipped → delivered`,
  ou `cancelled` a partir de `pending`/`paid`) — pronta para exercitar a
  técnica de teste de transição de estados; transições fora do grafo são
  rejeitadas com `400`.
- **Casos de borda já no seed**: produto com estoque zero, produto com
  apenas 1 unidade, usuário sem endereço cadastrado, preço com centavos
  "quebrados", nome de produto bem longo.
- **Regra de negócio real no checkout**: revalida estoque no momento da
  finalização (não só na hora de adicionar ao carrinho), calcula total,
  decrementa estoque e limpa o carrinho.
- Exemplos de **testes automatizados** já no próprio repositório
  (`backend/src/modules/orders/orders.service.spec.ts` e
  `backend/test/auth.e2e-spec.ts`) — unitário e e2e, respectivamente.

## Rodando os testes do backend

```bash
cd backend
npm test          # testes unitários (ex: máquina de estados do pedido)
npm run test:e2e  # testes de ponta a ponta (auth, catálogo, permissões)
```

## Notas para quem for usar isso em sala

- O banco é SQLite: não precisa configurar um servidor de banco separado.
  Para reiniciar os dados de um grupo do zero, basta apagar o volume
  correspondente (`docker volume rm amazon-simulator_grupo-N-data`) e subir
  de novo.
- As fontes usadas no frontend são pilhas de fonte de sistema (não
  dependem de baixar nada do Google Fonts) — o build funciona mesmo em
  ambiente sem acesso à internet, o que importa para os containers.
- `synchronize: true` no TypeORM está OK para este uso (ambiente de estudo,
  banco descartável); não é recomendado em produção real.
