import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import type { } from 'bcrypt';
import * as bcrypt from 'bcrypt';

interface JwtPayload {
  username: string;
  sub: number;
  isAdmin: boolean; // добавь сюда
}


export interface SafeUser {
  id: number;
  username: string;
  isAdmin: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(
    username: string,
    password: string,
  ): Promise<SafeUser | null> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isValid = await this.comparePasswords(password, user.password);

    if (!isValid) {
      return null;
    }

    const { ...result } = user;

    return result as SafeUser;
  }

  login(user: SafeUser) {
    const payload = { username: user.username, sub: user.id, isAdmin: user.isAdmin };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '30d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private comparePasswords(plainText: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashed) as Promise<boolean>;
  }

  async refreshTokens(refreshToken: string) {
    const isValid = await this.validateRefreshToken(refreshToken);

    if (!isValid) {
      throw new UnauthorizedException();
    }

    const newAccessToken = this.jwtService.sign({
      username: isValid.username,
      sub: isValid.id,
      isAdmin: isValid.isAdmin, // добавь
    });

    const newRefreshToken = this.generateNewRefreshToken(isValid.id);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  private async validateRefreshToken(token: string) {
    const payload = this.jwtService.verify<JwtPayload>(token);
    if (payload) {
      return this.usersService.findByUsername(payload.username);
    }
    return null;
  }

  private generateNewRefreshToken(userId: number) {
    return this.jwtService.sign({ userId });
  }
}