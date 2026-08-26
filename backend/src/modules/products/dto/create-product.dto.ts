import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Fone de Ouvido Bluetooth XZ200' })
  @IsString()
  @IsNotEmpty({ message: 'O nome do produto é obrigatório.' })
  name: string;

  @ApiProperty({ example: 'Fone com cancelamento de ruído e 30h de bateria.' })
  @IsString()
  @IsNotEmpty({ message: 'A descrição é obrigatória.' })
  description: string;

  @ApiProperty({ example: 199.9 })
  @IsNumber({}, { message: 'O preço precisa ser um número.' })
  @Min(0, { message: 'O preço não pode ser negativo.' })
  price: number;

  @ApiProperty({ example: 50 })
  @IsNumber({}, { message: 'O estoque precisa ser um número.' })
  @Min(0, { message: 'O estoque não pode ser negativo.' })
  stockQuantity: number;

  @ApiProperty({ required: false, example: 'https://exemplo.com/imagem.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: 'SoundMax' })
  @IsString()
  @IsNotEmpty({ message: 'A marca é obrigatória.' })
  brand: string;

  @ApiProperty({ example: 'a3f7c2d0-...' })
  @IsUUID('4', { message: 'categoryId precisa ser um UUID válido.' })
  categoryId: string;
}
