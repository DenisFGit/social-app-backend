import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'username123', description: "Імя'я користувача" })
  username!: string;

  @ApiProperty({ example: 'password123', description: 'Пароль користувача' })
  password!: string;
}