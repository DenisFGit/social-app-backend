import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer/cjs/index.js';
import { User } from '../users/users.entity';
import { Comment } from '../comments/comments.entity';


@Entity()
export class Exhibit {
    @Expose()
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'Унікальний ідентифікатор посту' })
    id!: number;

    @Expose()
    @Column({ unique: true })
    @ApiProperty({ example: '/static/a77fcd5f-3956-455f-8fcf-8baf405ad526.png', description: 'Шлях до зображення' })
    imageUrl!: string;

    @Expose()
    @Column()
    @ApiProperty({ example: 'post desxription', description: 'Опис до поста' })
    description!: string;

    @Expose()
    @CreateDateColumn()
    @ApiProperty({ example: 'date', description: 'Дата створення поста' })
    createdAt!: Date;


    @Expose()
    @ManyToOne(() => User, (user) => user.exhibits, { eager: true })
    @JoinColumn({ name: 'userId' })
    user: User;
    @Column()
    userId: number;

    @OneToMany(() => Comment, (comment) => comment.exhibit)
    comments: Comment[];

    @Expose()
    commentCount?: number;
}