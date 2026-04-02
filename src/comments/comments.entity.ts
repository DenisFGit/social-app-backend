import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer/cjs/index.js';
import { User } from '../users/users.entity';
import { Exhibit } from '../exhibits/exhibits.entity';


@Entity()
export class Comment {
    @Expose()
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'Унікальний ідентифікатор посту' })
    id!: number;


    @Expose()
    @Column()
    @ApiProperty({ example: 'comment desxription', description: 'Комментарій до постау' })
    text!: string;

    @Expose()
    @CreateDateColumn()
    @ApiProperty({ example: 'date', description: 'Дата створення поста' })
    createdAt!: Date;


    @Expose()
    @ManyToOne(() => User, (user) => user.comments, { eager: true })
    @JoinColumn({ name: 'userId' })
    user: User;
    @Column()
    userId: number;

    @ManyToOne(() => Exhibit, (exhibit) => exhibit.comments, { onDelete: 'CASCADE' })
    exhibit: Exhibit;
}