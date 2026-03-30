import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exhibit } from './exhibits.entity';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class ExhibitsService {
    constructor(
        @InjectRepository(Exhibit)
        private ExhibitsRepository: Repository<Exhibit>,
    ) { }

    async create(
        imageUrl: string,
        description: string,
        userId: number
    ): Promise<Exhibit> {
        const exhibit = this.ExhibitsRepository.create({ imageUrl, description, userId });

        const saved = await this.ExhibitsRepository.save(exhibit);

        const createdExhibit = await this.ExhibitsRepository
            .createQueryBuilder('exhibit')
            .leftJoinAndSelect('exhibit.user', 'user')
            .loadRelationCountAndMap('exhibit.commentCount', 'exhibit.comments')
            .where('exhibit.id = :id', { id: saved.id })
            .getOne();

        return createdExhibit!;
    }

    async delete(exhibitId: number, userId: number, isAdmin: boolean): Promise<void> {
        const exhibit = await this.ExhibitsRepository.findOne({ where: { id: exhibitId } });

        if (!exhibit) {
            throw new NotFoundException(`Exhibit with id ${exhibitId} not found`);
        }

        if (exhibit.user.id !== userId && !isAdmin) {
            throw new ForbiddenException('Нет доступа');
        }

        const imagePath = exhibit.imageUrl;

        await this.ExhibitsRepository.remove(exhibit);

        if (imagePath) {
            try {
                const relativePath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
                const absolutePath = path.resolve(process.cwd(), relativePath);

                await fs.unlink(absolutePath);
            } catch (err) {
                console.error(`Failed to delete file at ${imagePath}:`, err.message);
            }
        }
    }

    async getAll(page: number, limit: number,): Promise<{
        data: Exhibit[];
        total: number;
        page: number;
        lastPage: number;
    }> {
        const query = this.ExhibitsRepository
            .createQueryBuilder('exhibit')
            .leftJoinAndSelect('exhibit.user', 'user')
            .loadRelationCountAndMap(
                'exhibit.commentCount',
                'exhibit.comments',
            )
            .orderBy('exhibit.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        const [data, total] = await query.getManyAndCount();

        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }

    async getByUser(userId: number, page: number, limit: number): Promise<{
        data: Exhibit[];
        total: number;
        page: number;
        lastPage: number;
    }> {
        const query = this.ExhibitsRepository
            .createQueryBuilder('exhibit')
            .leftJoinAndSelect('exhibit.user', 'user')
            .loadRelationCountAndMap(
                'exhibit.commentCount',
                'exhibit.comments',
            )
            .where('user.id = :userId', { userId })
            .orderBy('exhibit.createdAt', 'DESC')
            // filter by current user
            .skip((page - 1) * limit)
            .take(limit);

        const [data, total] = await query.getManyAndCount();

        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }
}