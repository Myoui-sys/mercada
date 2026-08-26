import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ required: false, example: 'Maria Silva Santos' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ required: false, example: 'Av. Boa Viagem, 500 - Recife/PE' })
  @IsOptional()
  @IsString()
  shippingAddress?: string;
}
