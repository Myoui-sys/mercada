import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Eletrônicos' })
  @IsString()
  @IsNotEmpty({ message: 'O nome da categoria é obrigatório.' })
  name: string;

  @ApiProperty({ example: 'eletronicos' })
  @IsString()
  @IsNotEmpty({ message: 'O slug da categoria é obrigatório.' })
  slug: string;

  @ApiProperty({ required: false, example: 'Celulares, notebooks e afins' })
  @IsOptional()
  @IsString()
  description?: string;
}
