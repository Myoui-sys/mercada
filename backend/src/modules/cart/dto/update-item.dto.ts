import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateItemDto {
  @ApiProperty({ example: 3, minimum: 1 })
  @IsInt({ message: 'A quantidade precisa ser um número inteiro.' })
  @Min(1, { message: 'A quantidade mínima é 1. Para remover, use o DELETE.' })
  quantity: number;
}
