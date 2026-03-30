import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UnauthorizedException } from '@nestjs/common';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @ApiOperation({ summary: 'Вход пользователя' })
  @ApiResponse({ status: 200, description: "Успішная авторизація, повертає JWT токен та ім'я користувача" })
  @ApiResponse({ status: 401, description: "Невірне ім'я користувача або пароль" })
  @Post('login')
  async login(@Body() loginDto: LoginDto,) {

    if (!loginDto.username || !loginDto.password) {
      throw new HttpException('Дані вказані невірно', HttpStatus.BAD_REQUEST);
    }

    const user = await this.authService.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException();
    }

    const { access_token, refresh_token } = this.authService.login(user);

    const response = {
      access_token,
      refresh_token,
      userName: loginDto.username,
      userRole: user.isAdmin ? 'admin' : 'user',
      userId: user.id,
    };

    return response;
  }
}