import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'maria@exemplo.com' })
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email: string;

  @ApiProperty({ example: 'senhaForte123' })
  @IsString()
  @MinLength(6, { message: 'A senha precisa ter pelo menos 6 caracteres.' })
  password: string;
}
