import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.SHIPPED })
  @IsEnum(OrderStatus, { message: 'Status de pedido inválido.' })
  status: OrderStatus;
}
