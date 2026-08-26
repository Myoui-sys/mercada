import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class AddItemDto {
  @ApiProperty({ example: 'a3f7c2d0-...' })
  @IsUUID('4', { message: 'productId precisa ser um UUID válido.' })
  productId: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt({ message: 'A quantidade precisa ser um número inteiro.' })
  @Min(1, { message: 'A quantidade mínima é 1.' })
  quantity: number;
}
