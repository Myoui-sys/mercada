import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    required: false,
    example: 'Rua das Flores, 123 - Recife/PE',
    description:
      'Endereço de entrega para este pedido. Se omitido, usa o endereço salvo no perfil do usuário.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  shippingAddress?: string;
}
