import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

/**
 * Máquina de estados do pedido.
 *
 * Serve de propósito duplo: regra de negócio real e um exemplo pronto de
 * "transição de estados" para quem for aplicar essa técnica de teste no
 * projeto final (cada aresta aqui é um caso de teste válido; qualquer
 * transição fora desta lista deve ser rejeitada).
 */
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED],
  [OrderStatus.PAID]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [],
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cartService: CartService,
  ) {}

  async checkout(userId: string, dto: CreateOrderDto): Promise<Order> {
    const cart = await this.cartService.getOrCreateCart(userId);

    if (cart.items.length === 0) {
      throw new BadRequestException(
        'Não é possível finalizar um pedido com o carrinho vazio.',
      );
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const shippingAddress = dto.shippingAddress ?? user.shippingAddress;

    if (!shippingAddress) {
      throw new BadRequestException(
        'Informe um endereço de entrega (no pedido ou no seu perfil).',
      );
    }

    // Revalida estoque de todos os itens antes de confirmar o pedido —
    // evita condição de corrida grosseira entre o momento em que o item
    // foi colocado no carrinho e o checkout.
    for (const item of cart.items) {
      const product = await this.productRepository.findOne({
        where: { id: item.product.id },
      });

      if (!product || product.stockQuantity < item.quantity) {
        throw new BadRequestException(
          `Estoque insuficiente para "${item.product.name}" no momento do checkout.`,
        );
      }
    }

    const orderItems: OrderItem[] = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = await this.productRepository.findOne({
        where: { id: item.product.id },
      });

      product!.stockQuantity -= item.quantity;
      await this.productRepository.save(product!);

      totalAmount += Number(item.product.price) * item.quantity;

      orderItems.push(
        Object.assign(new OrderItem(), {
          product: item.product,
          quantity: item.quantity,
          unitPriceAtPurchase: item.product.price,
        }),
      );
    }

    const order = this.orderRepository.create({
      userId,
      status: OrderStatus.PENDING,
      totalAmount,
      shippingAddress,
      items: orderItems,
    });

    const savedOrder = await this.orderRepository.save(order);

    await this.cartService.clear(userId);

    return savedOrder;
  }

  findByUser(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(userId: string, orderId: string, isAdmin = false): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado.');
    }

    if (!isAdmin && order.userId !== userId) {
      throw new ForbiddenException('Este pedido não pertence a você.');
    }

    return order;
  }

  async updateStatus(
    orderId: string,
    dto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado.');
    }

    const allowedNextStates = VALID_TRANSITIONS[order.status];

    if (!allowedNextStates.includes(dto.status)) {
      throw new BadRequestException(
        `Transição inválida: pedido em "${order.status}" não pode ir para "${dto.status}". ` +
          `Transições permitidas a partir de "${order.status}": ${
            allowedNextStates.length > 0 ? allowedNextStates.join(', ') : 'nenhuma (estado final)'
          }.`,
      );
    }

    order.status = dto.status;
    return this.orderRepository.save(order);
  }
}
