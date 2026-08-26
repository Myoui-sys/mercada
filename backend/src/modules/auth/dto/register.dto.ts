import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'maria@exemplo.com' })
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email: string;

  @ApiProperty({ example: 'senhaForte123' })
  @IsString()
  @MinLength(6, { message: 'A senha precisa ter pelo menos 6 caracteres.' })
  password: string;

  @ApiProperty({ example: 'Maria Silva' })
  @IsString()
  @IsNotEmpty({ message: 'O nome completo é obrigatório.' })
  fullName: string;

  @ApiProperty({ example: 'Rua das Flores, 123 - Recife/PE', required: false })
  @IsOptional()
  @IsString()
  shippingAddress?: string;
}
