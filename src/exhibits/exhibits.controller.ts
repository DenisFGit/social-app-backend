import { Controller, Post, Body, UploadedFile, Get, Delete, Param, Request, Query, UseGuards, ParseIntPipe, BadRequestException, UseInterceptors } from '@nestjs/common';
import { ExhibitsService } from './exhibits.service';
import { ApiBearerAuth, ApiOperation, ApiBody, ApiQuery, ApiResponse, ApiTags, ApiConsumes, } from '@nestjs/swagger';
import { CreateExhibitsDto } from './dto/create-exhibits.dto';
import { plainToInstance } from 'class-transformer';
import { Exhibit } from './exhibits.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import type { Express } from 'express';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => ({
        folder: 'Home',         // now works
        public_id: uuidv4(),        // unique filename
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],          // or 'jpg', 'webp'
    }),
});

export interface JwtUser {
    id: number;
    username: string;
}

export interface RequestWithUser extends Request {
    user: JwtUser;
}

@Controller('api/exhibits')
@ApiTags('exhibits')
export class ExhibitsController {
    constructor(
        private exhibitsService: ExhibitsService,
        private readonly notificationService: NotificationsGateway,
    ) { }


    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Post('/')
    @ApiOperation({ summary: 'Створення нового поста' })
    @ApiResponse({ status: 201, description: 'Пост успішно створений' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: { type: 'string', format: 'binary' },
                description: { type: 'string' },
            },
        },
    })
    @UseInterceptors(FileInterceptor('image', {
        storage,  // <-- use the constant defined outside the class
        fileFilter: (req, file, cb) => {
            const allowedTypes = /jpeg|jpg|png|webp/;
            const isValid = allowedTypes.test(file.mimetype);
            if (isValid) cb(null, true);
            else cb(new BadRequestException('Only image files are allowed'), false);
        },
    }))
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createExhibitsDto: CreateExhibitsDto,
        @Request() req: RequestWithUser,
    ) {
        if (!file) throw new BadRequestException('Image file is required');

        // Cloudinary URL
        const imageUrl = file.path; // or file.url in some Cloudinary versions

        const exhibit = await this.exhibitsService.create(
            imageUrl,
            createExhibitsDto.description,
            req.user.id,
        );

        this.notificationService.handleNewPost({
            message: createExhibitsDto.description,
            user: req.user.username
        });

        return plainToInstance(Exhibit, exhibit, { excludeExtraneousValues: true });
    }


    @Get()
    @ApiOperation({ summary: 'Отримати усі пости' })
    @ApiQuery({ name: 'page', required: false, description: 'Номер сторінки для пагінації' })
    @ApiQuery({ name: 'limit', required: false, description: 'Кількість записів на сторінці' })
    @ApiResponse({ status: 200, description: 'Пости знайдені' })
    @ApiResponse({ status: 404, description: 'Пости не знайдені' })
    async getExhibits(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        const result = await this.exhibitsService.getAll(Number(page), Number(limit));

        return {
            data: plainToInstance(Exhibit, result.data, { excludeExtraneousValues: true }),
            total: result.total,
            page: result.page,
            lastPage: result.lastPage,
        };
    }


    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Delete(':id')
    @ApiOperation({ summary: 'Видалення поста' })
    async delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
        await this.exhibitsService.delete(id, req.user.id, req.user.isAdmin);
        return { message: 'Exhibit successfully deleted' };
    }

    @Get('my-posts')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Получить экспонаты текущего пользователя' })
    async getMyExhibits(
        @Request() req,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.exhibitsService.getByUser(req.user.id, page, limit);
    }
}