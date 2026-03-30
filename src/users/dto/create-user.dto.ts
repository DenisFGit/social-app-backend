import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'username123', description: 'Имя пользователя для регистрации' })
  @MinLength(4, { message: 'Имя пользователя должно быть не короче 4 символов' })
  username!: string;


  @ApiProperty({ example: 'password123', description: 'Пароль пользователя' })
  @MinLength(4, { message: 'Пароль должен быть не короче 4 символов' })
  password!: string;
}