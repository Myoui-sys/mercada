import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(
    query: QueryProductsDto,
  ): Promise<PaginatedResult<Product>> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 12;

    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isActive = :isActive', { isActive: true });

    if (query.search) {
      qb.andWhere(
        '(LOWER(product.name) LIKE :search OR LOWER(product.brand) LIKE :search)',
        { search: `%${query.search.toLowerCase()}%` },
      );
    }

    if (query.categoryId) {
      qb.andWhere('category.id = :categoryId', {
        categoryId: query.categoryId,
      });
    }

    switch (query.sortBy) {
      case 'price_asc':
        qb.orderBy('product.price', 'ASC');
        break;
      case 'price_desc':
        qb.orderBy('product.price', 'DESC');
        break;
      case 'newest':
      default:
        qb.orderBy('product.createdAt', 'DESC');
        break;
    }

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'reviews', 'reviews.user'],
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    return product;
  }

  create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create({
      ...dto,
      category: { id: dto.categoryId } as any,
    });

    return this.productRepository.save(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findById(id);

    const { categoryId, ...rest } = dto;

    Object.assign(product, rest);

    if (categoryId) {
      product.category = { id: categoryId } as any;
    }

    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findById(id);
    product.isActive = false;
    await this.productRepository.save(product);
  }

  /**
   * Usado internamente pelo módulo de pedidos para checar e decrementar
   * estoque de forma atômica o suficiente para o escopo deste simulador.
   */
  async decrementStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findById(id);

    if (product.stockQuantity < quantity) {
      throw new BadRequestException(
        `Estoque insuficiente para o produto "${product.name}".`,
      );
    }

    product.stockQuantity -= quantity;
    return this.productRepository.save(product);
  }
}
