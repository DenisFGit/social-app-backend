import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer/cjs/index.js';
import { Exhibit } from '../exhibits/exhibits.entity';
import { Comment } from '../comments/comments.entity';

@Entity()
export class User {
  @Expose()
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор пользователя' })
  id!: number;

  @Expose()
  @Column({ unique: true })
  @ApiProperty({ example: 'username123', description: 'Уникальное имя пользователя' })
  username!: string;

  @Column({ select: false })
  @ApiProperty({ example: 'hashedPassword', description: 'Хешированный пароль пользователя' })
  password!: string;

  @OneToMany(() => Exhibit, (exhibit) => exhibit.user, { cascade: true })
  @ApiProperty({ type: () => [Exhibit], description: 'Список экспонатов, добавленных пользователем' })
  exhibits: Exhibit[];

  @Expose()
  @Column({ default: false })
  isAdmin!: boolean;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}