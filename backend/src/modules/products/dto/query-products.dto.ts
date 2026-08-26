import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class QueryProductsDto {
  @ApiProperty({ required: false, example: 'fone' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('4')
  categoryId?: string;

  @ApiProperty({ required: false, example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1;

  @ApiProperty({ required: false, example: 12, default: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number = 12;

  @ApiProperty({
    required: false,
    enum: ['price_asc', 'price_desc', 'newest'],
  })
  @IsOptional()
  @IsIn(['price_asc', 'price_desc', 'newest'])
  sortBy?: 'price_asc' | 'price_desc' | 'newest';
}
