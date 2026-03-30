import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await this.usersRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new BadRequestException('Пользователь с таким именем уже существует');
    }

    const user = this.usersRepository.create({ username, password: hashedPassword });
    return this.usersRepository.save(user);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .addSelect('user.isAdmin')  // also needed since it's select: false too
      .where('user.username = :username', { username })
      .getOne();

    return user === null ? undefined : user;
  }

  async findById(id: number): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user === null ? undefined : user;
  }

  //   async refreshToken (id: number): Promise<User | undefined> {
  //     return this.usersRepository.findOne({ where: { id } });
  //   }
}