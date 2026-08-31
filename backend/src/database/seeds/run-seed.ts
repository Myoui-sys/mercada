import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { User, UserRole } from '../../modules/users/entities/user.entity';
import { Category } from '../../modules/categories/entities/category.entity';
import { Product } from '../../modules/products/entities/product.entity';
import { Review } from '../../modules/reviews/entities/review.entity';
import { Cart } from '../../modules/cart/entities/cart.entity';
import { CartItem } from '../../modules/cart/entities/cart-item.entity';
import { Order } from '../../modules/orders/entities/order.entity';
import { OrderItem } from '../../modules/orders/entities/order-item.entity';

dotenv.config();

/**
 * Popula o banco com um catálogo pequeno, mas realista: categorias,
 * produtos com preços/estoques variados (incluindo casos de borda como
 * estoque zero e preço quebrado), usuários de teste e algumas avaliações.
 *
 * Rodar com: npm run seed
 *
 * Este script é idempotente-ish: se rodado de novo sobre um banco já
 * populado, vai gerar duplicatas de produtos (não faz upsert). Para uma
 * instância nova por grupo, o fluxo normal é: banco vazio -> seed -> uso.
 */
async function runSeed() {
  const dataSource = new DataSource({
    type: 'sqlite',
    database: process.env.DATABASE_PATH ?? './data/mercatta.sqlite',
    entities: [User, Category, Product, Review, Cart, CartItem, Order, OrderItem],
    synchronize: true,
  });

  await dataSource.initialize();

  const userRepo = dataSource.getRepository(User);
  const categoryRepo = dataSource.getRepository(Category);
  const productRepo = dataSource.getRepository(Product);
  const reviewRepo = dataSource.getRepository(Review);

  console.log('Limpando dados existentes...');
  await dataSource.query('DELETE FROM reviews');
  await dataSource.query('DELETE FROM order_items');
  await dataSource.query('DELETE FROM orders');
  await dataSource.query('DELETE FROM cart_items');
  await dataSource.query('DELETE FROM carts');
  await dataSource.query('DELETE FROM products');
  await dataSource.query('DELETE FROM categories');
  await dataSource.query('DELETE FROM users');

  console.log('Criando usuários...');
  const passwordHash = await bcrypt.hash('senha123', 10);

  const admin = await userRepo.save(
    userRepo.create({
      email: 'admin@mercatta.com',
      passwordHash,
      fullName: 'Administrador da Loja',
      role: UserRole.ADMIN,
      shippingAddress: 'Depósito Central, Recife/PE',
    }),
  );

  const customer1 = await userRepo.save(
    userRepo.create({
      email: 'maria@exemplo.com',
      passwordHash,
      fullName: 'Maria Silva',
      role: UserRole.CUSTOMER,
      shippingAddress: 'Rua das Flores, 123 - Recife/PE',
    }),
  );

  const customer2 = await userRepo.save(
    userRepo.create({
      email: 'joao@exemplo.com',
      passwordHash,
      fullName: 'João Souza',
      role: UserRole.CUSTOMER,
      // Propositalmente sem shippingAddress: bom caso de teste para
      // "checkout sem endereço no perfil".
    }),
  );

  console.log('Criando categorias...');
  const categoriesData = [
    { name: 'Eletrônicos', slug: 'eletronicos', description: 'Celulares, fones, acessórios e mais.' },
    { name: 'Informática', slug: 'informatica', description: 'Notebooks, periféricos e componentes.' },
    { name: 'Livros', slug: 'livros', description: 'Livros físicos de diversos gêneros.' },
    { name: 'Casa e Cozinha', slug: 'casa-e-cozinha', description: 'Utensílios e eletrodomésticos.' },
    { name: 'Esporte e Lazer', slug: 'esporte-e-lazer', description: 'Equipamentos e roupas esportivas.' },
  ];

  const categories: Record<string, Category> = {};
  for (const data of categoriesData) {
    categories[data.slug] = await categoryRepo.save(categoryRepo.create(data));
  }

  console.log('Criando produtos...');
  const productsData = [
    // Eletrônicos
    { name: 'Fone de Ouvido Bluetooth XZ200', description: 'Fone com cancelamento de ruído ativo e 30h de bateria.', price: 199.9, stockQuantity: 50, brand: 'SoundMax', category: 'eletronicos', imageUrl: 'https://picsum.photos/seed/fone-xz200/400/400' },
    { name: 'Smartphone Galaxy Nova 12', description: 'Tela AMOLED 6.5", 128GB, câmera tripla de 50MP.', price: 1899.0, stockQuantity: 15, brand: 'Galaxtech', category: 'eletronicos', imageUrl: 'https://picsum.photos/seed/galaxy-nova-12/400/400' },
    { name: 'Smartwatch FitPulse 3', description: 'Monitor cardíaco, GPS integrado e resistência à água.', price: 349.5, stockQuantity: 0, brand: 'FitPulse', category: 'eletronicos', imageUrl: 'https://picsum.photos/seed/fitpulse-3/400/400' },
    { name: 'Caixa de Som Bluetooth Boom Mini', description: 'Portátil, à prova d\'água, 12h de autonomia.', price: 129.9, stockQuantity: 80, brand: 'Boom', category: 'eletronicos', imageUrl: 'https://picsum.photos/seed/boom-mini/400/400' },
    { name: 'Carregador Portátil 20000mAh', description: 'Power bank com carga rápida USB-C.', price: 89.9, stockQuantity: 120, brand: 'PowerGo', category: 'eletronicos', imageUrl: 'https://picsum.photos/seed/powergo-20000/400/400' },

    // Informática
    { name: 'Notebook UltraBook 14" i5', description: '16GB RAM, SSD 512GB, tela Full HD.', price: 3299.0, stockQuantity: 10, brand: 'CoreTech', category: 'informatica', imageUrl: 'https://picsum.photos/seed/ultrabook-14/400/400' },
    { name: 'Mouse Gamer Vortex RGB', description: '16000 DPI ajustável, 7 botões programáveis.', price: 149.9, stockQuantity: 60, brand: 'Vortex', category: 'informatica', imageUrl: 'https://picsum.photos/seed/vortex-rgb/400/400' },
    { name: 'Teclado Mecânico ClickPro', description: 'Switches azuis, iluminação RGB, ABNT2.', price: 259.0, stockQuantity: 35, brand: 'ClickPro', category: 'informatica', imageUrl: 'https://picsum.photos/seed/clickpro-teclado/400/400' },
    { name: 'Monitor 27" 144Hz UltraView', description: 'Painel IPS, tempo de resposta de 1ms, ideal para jogos.', price: 1199.0, stockQuantity: 8, brand: 'UltraView', category: 'informatica', imageUrl: 'https://picsum.photos/seed/ultraview-27/400/400' },
    { name: 'SSD NVMe 1TB SpeedDrive', description: 'Leitura de até 3500MB/s.', price: 379.9, stockQuantity: 1, brand: 'SpeedDrive', category: 'informatica', imageUrl: 'https://picsum.photos/seed/speeddrive-1tb/400/400' },

    // Livros
    { name: 'Clean Code: Habilidades Práticas do Agile Software', description: 'Um guia clássico de boas práticas de programação.', price: 89.9, stockQuantity: 40, brand: 'Editora Alta Books', category: 'livros', imageUrl: 'https://picsum.photos/seed/clean-code-book/400/400' },
    { name: 'O Poder do Hábito', description: 'Como os hábitos se formam e como mudá-los.', price: 44.9, stockQuantity: 55, brand: 'Editora Objetiva', category: 'livros', imageUrl: 'https://picsum.photos/seed/poder-habito/400/400' },
    { name: 'Introdução a Testes de Software', description: 'Fundamentos teóricos e práticos de QA para iniciantes.', price: 69.9, stockQuantity: 25, brand: 'Editora Casa do Código', category: 'livros', imageUrl: 'https://picsum.photos/seed/testes-software-book/400/400' },

    // Casa e Cozinha
    { name: 'Air Fryer Digital 5L', description: 'Fritadeira sem óleo com 8 funções pré-programadas.', price: 349.0, stockQuantity: 20, brand: 'HomeChef', category: 'casa-e-cozinha', imageUrl: 'https://picsum.photos/seed/airfryer-5l/400/400' },
    { name: 'Jogo de Panelas Antiaderente 5 Peças', description: 'Alumínio revestido, cabo termoisolante.', price: 219.9, stockQuantity: 30, brand: 'CozinhaPro', category: 'casa-e-cozinha', imageUrl: 'https://picsum.photos/seed/panelas-5pc/400/400' },
    { name: 'Aspirador de Pó Robô SmartClean', description: 'Mapeamento inteligente e controle via aplicativo.', price: 899.0, stockQuantity: 5, brand: 'SmartClean', category: 'casa-e-cozinha', imageUrl: 'https://picsum.photos/seed/smartclean-robo/400/400' },

    // Esporte e Lazer
    { name: 'Tapete de Yoga Antiderrapante', description: '6mm de espessura, material ecológico.', price: 59.9, stockQuantity: 100, brand: 'ZenFit', category: 'esporte-e-lazer', imageUrl: 'https://picsum.photos/seed/tapete-yoga/400/400' },
    { name: 'Bicicleta Ergométrica ProSpin', description: 'Ajuste de resistência magnética, monitor de treino.', price: 799.0, stockQuantity: 6, brand: 'ProSpin', category: 'esporte-e-lazer', imageUrl: 'https://picsum.photos/seed/prospin-bike/400/400' },
    { name: 'Kit Halteres Ajustáveis 20kg', description: 'Par de halteres com anilhas removíveis.', price: 249.9, stockQuantity: 18, brand: 'IronFit', category: 'esporte-e-lazer', imageUrl: 'https://picsum.photos/seed/halteres-20kg/400/400' },
    // Caso de borda proposital: preço com centavos "quebrados" e nome longo
    { name: 'Garrafa Térmica Inox 1.5L com Filtro de Gelo Removível Edição Especial', description: 'Mantém temperatura por até 24h.', price: 79.97, stockQuantity: 42, brand: 'ThermoMax', category: 'esporte-e-lazer', imageUrl: 'https://picsum.photos/seed/garrafa-termica/400/400' },
  ];

  const savedProducts: Product[] = [];
  for (const data of productsData) {
    const { category: categorySlug, ...rest } = data;
    const product = await productRepo.save(
      productRepo.create({ ...rest, category: categories[categorySlug] }),
    );
    savedProducts.push(product);
  }

  console.log('Criando avaliações...');
  const findProduct = (name: string) =>
    savedProducts.find((p) => p.name === name)!;

  await reviewRepo.save([
    reviewRepo.create({
      user: customer1,
      product: findProduct('Fone de Ouvido Bluetooth XZ200'),
      rating: 5,
      comment: 'Excelente qualidade de som, recomendo muito!',
    }),
    reviewRepo.create({
      user: customer2,
      product: findProduct('Fone de Ouvido Bluetooth XZ200'),
      rating: 4,
      comment: 'Bom custo-benefício, mas a bateria dura um pouco menos do que anunciado.',
    }),
    reviewRepo.create({
      user: customer1,
      product: findProduct('Notebook UltraBook 14" i5'),
      rating: 5,
      comment: 'Rápido e silencioso, ótimo para trabalho.',
    }),
    reviewRepo.create({
      user: customer2,
      product: findProduct('Clean Code: Habilidades Práticas do Agile Software'),
      rating: 5,
      comment: 'Leitura obrigatória para quem programa.',
    }),
  ]);

  console.log('');
  console.log('Seed concluído com sucesso!');
  console.log('');
  console.log('Usuários de teste criados:');
  console.log(`  Admin:    ${admin.email} / senha123`);
  console.log(`  Cliente:  ${customer1.email} / senha123`);
  console.log(`  Cliente:  ${customer2.email} / senha123 (sem endereço cadastrado)`);
  console.log('');
  console.log(`${savedProducts.length} produtos e ${categoriesData.length} categorias criados.`);

  await dataSource.destroy();
}

runSeed().catch((error) => {
  console.error('Erro ao rodar o seed:', error);
  process.exit(1);
});
