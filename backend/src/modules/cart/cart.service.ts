import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({ where: { userId } });

    if (!cart) {
      cart = this.cartRepository.create({ userId, items: [] });
      cart = await this.cartRepository.save(cart);
    }

    return cart;
  }

  async addItem(userId: string, dto: AddItemDto): Promise<Cart> {
    const product = await this.productRepository.findOne({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    if (product.stockQuantity < dto.quantity) {
      throw new BadRequestException(
        `Estoque insuficiente. Disponível: ${product.stockQuantity}.`,
      );
    }

    const cart = await this.getOrCreateCart(userId);

    const existingItem = cart.items.find(
      (item) => item.product.id === dto.productId,
    );

    if (existingItem) {
      existingItem.quantity += dto.quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      const newItem = this.cartItemRepository.create({
        cart,
        product,
        quantity: dto.quantity,
      });
      await this.cartItemRepository.save(newItem);
    }

    return this.getOrCreateCart(userId);
  }

  async updateItem(
    userId: string,
    itemId: string,
    dto: UpdateItemDto,
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException('Item não encontrado no carrinho.');
    }

    if (item.product.stockQuantity < dto.quantity) {
      throw new BadRequestException(
        `Estoque insuficiente. Disponível: ${item.product.stockQuantity}.`,
      );
    }

    item.quantity = dto.quantity;
    await this.cartItemRepository.save(item);

    return this.getOrCreateCart(userId);
  }

  async removeItem(userId: string, itemId: string): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException('Item não encontrado no carrinho.');
    }

    await this.cartItemRepository.remove(item);

    return this.getOrCreateCart(userId);
  }

  async clear(userId: string): Promise<void> {
    const cart = await this.getOrCreateCart(userId);

    if (cart.items.length > 0) {
      await this.cartItemRepository.remove(cart.items);
    }
  }
}
