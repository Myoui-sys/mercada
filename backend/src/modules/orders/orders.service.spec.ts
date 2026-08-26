import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { Order, OrderStatus } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CartService } from '../cart/cart.service';

/**
 * Exemplo de teste unitário focado na máquina de estados do pedido —
 * pensado para servir de referência de "técnica de transição de estados"
 * no projeto final da disciplina: cada teste cobre uma aresta válida ou
 * inválida do grafo de estados descrito em orders.service.ts.
 */
describe('OrdersService — transições de status', () => {
  let service: OrdersService;

  const mockOrderRepository = {
    findOne: jest.fn(),
    save: jest.fn((order) => Promise.resolve(order)),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(Order), useValue: mockOrderRepository },
        { provide: getRepositoryToken(Product), useValue: {} },
        { provide: getRepositoryToken(User), useValue: {} },
        { provide: CartService, useValue: {} },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  function givenOrderWithStatus(status: OrderStatus): Order {
    return { id: 'pedido-1', status } as Order;
  }

  it('permite transição de pending para paid', async () => {
    mockOrderRepository.findOne.mockResolvedValue(
      givenOrderWithStatus(OrderStatus.PENDING),
    );

    const result = await service.updateStatus('pedido-1', {
      status: OrderStatus.PAID,
    });

    expect(result.status).toBe(OrderStatus.PAID);
  });

  it('permite transição de pending para cancelled', async () => {
    mockOrderRepository.findOne.mockResolvedValue(
      givenOrderWithStatus(OrderStatus.PENDING),
    );

    const result = await service.updateStatus('pedido-1', {
      status: OrderStatus.CANCELLED,
    });

    expect(result.status).toBe(OrderStatus.CANCELLED);
  });

  it('permite transição de paid para shipped', async () => {
    mockOrderRepository.findOne.mockResolvedValue(
      givenOrderWithStatus(OrderStatus.PAID),
    );

    const result = await service.updateStatus('pedido-1', {
      status: OrderStatus.SHIPPED,
    });

    expect(result.status).toBe(OrderStatus.SHIPPED);
  });

  it('permite transição de shipped para delivered', async () => {
    mockOrderRepository.findOne.mockResolvedValue(
      givenOrderWithStatus(OrderStatus.SHIPPED),
    );

    const result = await service.updateStatus('pedido-1', {
      status: OrderStatus.DELIVERED,
    });

    expect(result.status).toBe(OrderStatus.DELIVERED);
  });

  it('rejeita pular de pending direto para shipped', async () => {
    mockOrderRepository.findOne.mockResolvedValue(
      givenOrderWithStatus(OrderStatus.PENDING),
    );

    await expect(
      service.updateStatus('pedido-1', { status: OrderStatus.SHIPPED }),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejeita qualquer transição a partir de delivered (estado final)', async () => {
    mockOrderRepository.findOne.mockResolvedValue(
      givenOrderWithStatus(OrderStatus.DELIVERED),
    );

    await expect(
      service.updateStatus('pedido-1', { status: OrderStatus.PAID }),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejeita reativar um pedido cancelado', async () => {
    mockOrderRepository.findOne.mockResolvedValue(
      givenOrderWithStatus(OrderStatus.CANCELLED),
    );

    await expect(
      service.updateStatus('pedido-1', { status: OrderStatus.PENDING }),
    ).rejects.toThrow(BadRequestException);
  });

  it('lança 404 ao tentar atualizar um pedido inexistente', async () => {
    mockOrderRepository.findOne.mockResolvedValue(null);

    await expect(
      service.updateStatus('nao-existe', { status: OrderStatus.PAID }),
    ).rejects.toThrow(NotFoundException);
  });
});
