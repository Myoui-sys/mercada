import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 'a3f7c2d0-...' })
  @IsUUID('4', { message: 'productId precisa ser um UUID válido.' })
  productId: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt({ message: 'A nota precisa ser um número inteiro.' })
  @Min(1, { message: 'A nota mínima é 1.' })
  @Max(5, { message: 'A nota máxima é 5.' })
  rating: number;

  @ApiProperty({ required: false, example: 'Produto excelente, chegou rápido!' })
  @IsOptional()
  @IsString()
  comment?: string;
}
