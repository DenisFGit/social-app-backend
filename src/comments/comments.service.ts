import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../comments/comments.entity';
import { Exhibit } from 'src/exhibits/exhibits.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private CommentsRepository: Repository<Comment>,
        @InjectRepository(Exhibit)
        private ExhibitRepository: Repository<Exhibit>
    ) { }

    async create(exhibitId: number, userId: number, text: string): Promise<Comment> {
        const exhibit = await this.ExhibitRepository.findOne({ where: { id: exhibitId } });

        if (!exhibit) {
            throw new NotFoundException(`Exhibit with id ${exhibitId} not found`);
        }

        const comment = this.CommentsRepository.create({
            text,
            exhibit,
            user: { id: userId },
        });

        const saved = await this.CommentsRepository.save(comment);

        return this.CommentsRepository.findOne({
            where: { id: saved.id },
            relations: ['user'],
            select: {
                id: true,
                text: true,
                createdAt: true,
                user: {
                    id: true,
                    username: true,
                },
            },
        }) as Promise<Comment>;
    }

    async findAllByExhibit(exhibitId: number) {
        const exhibit = await this.ExhibitRepository.findOne({ where: { id: exhibitId } });

        if (!exhibit) {
            throw new NotFoundException(`Exhibit with id ${exhibitId} not found`);
        }

        return this.CommentsRepository.find({
            where: { exhibit: { id: exhibitId } },
            relations: ['user'],
            select: {
                id: true,
                text: true,
                createdAt: true,
                user: {
                    id: true,
                    username: true,
                },
            },
            order: { createdAt: 'DESC' },
        });
    }

    async delete(exhibitId: number, commentId: number, userId: number) {
        const comment = await this.CommentsRepository.findOne({
            where: {
                id: commentId,
                exhibit: { id: exhibitId },
            },
            relations: ['user'],
        });

        if (!comment) {
            throw new NotFoundException(`Comment with id ${commentId} not found`);
        }

        if (comment.user.id !== userId) {
            throw new ForbiddenException('You can only delete your own comments');
        }

        await this.CommentsRepository.remove(comment);
    }

}