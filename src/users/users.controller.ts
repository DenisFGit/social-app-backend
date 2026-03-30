import { Controller, Post, Body, Get, Request, Query, NotFoundException, UseGuards, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { User } from './users.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

const MinLoginLength = 4;
const MinPasswordLength = 4;

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно зарегистрирован' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    if (
      (!createUserDto.username || !createUserDto.password) ||
      (createUserDto.username.length < MinLoginLength) || (createUserDto.password.length < MinPasswordLength)
    ) {
      throw new BadRequestException(`Длинна пароля и логина должна быть не меньше ${MinLoginLength} символов`);
    }

    const user = await this.usersService.create(createUserDto.username, createUserDto.password);

    return plainToInstance(User, user, { excludeExtraneousValues: true });
  }

  @Get()
  @ApiOperation({ summary: 'Получить пользователя по ID или username' })
  @ApiQuery({ name: 'id', required: false, description: 'ID пользователя' })
  @ApiQuery({ name: 'username', required: false, description: 'Имя пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь найден' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async getUser(
    @Query('id') id?: number,
    @Query('username') username?: string,
  ) {
    if (!id && !username) {
      throw new NotFoundException('ID или username должны быть указаны');
    }

    const user = id ?
      await this.usersService.findById(id) :
      await this.usersService.findByUsername(username!);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return plainToInstance(User, user, { excludeExtraneousValues: true });
  }

  @Get('my-profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Получить информацию о текущем пользователе' })
  @ApiResponse({ status: 200, description: 'Информация о текущем пользователе' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async getMyProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.id);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    console.log(user);

    // return plainToInstance(User, user, { excludeExtraneousValues: true });

    const response = {
      userId: user.id,
      userName: user.username,
      isAdmin: user.isAdmin,
    };

    return response;
  }
}
