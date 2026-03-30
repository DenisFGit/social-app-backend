import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';
import { AuthModule } from './auth/auth.module';
import { ExhibitsModule } from './exhibits/exhibits.module';
import { Exhibit } from './exhibits/exhibits.entity';
import { Comment } from './comments/comments.entity';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USERNAME ?? 'museum_user',
      password: process.env.DB_PASSWORD ?? 'password',
      database: process.env.DB_NAME ?? 'museum_db',
      entities: [User, Exhibit, Comment],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ExhibitsModule,
    CommentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
