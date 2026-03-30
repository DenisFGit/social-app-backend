import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  sub: number;
  username: string;
  isAdmin: boolean; // достаём прямо из токена
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() { // UsersService больше не нужен
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() as (
        req: Request,
      ) => string | null,
      ignoreExpiration: false,
      secretOrKey: 'secretKey',
    });
  }

  validate(payload: JwtPayload) {
    // Не идём в БД — берём всё из токена
    return {
      id: payload.sub,
      username: payload.username,
      isAdmin: payload.isAdmin,
    };
  }
}