import { Controller, Post, Body, Get, Delete, Param, Request, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('/api/exhibits/:exhibitId/comments')
@ApiTags('comments')
export class CommentsController {
    constructor(private commentsService: CommentsService) { }


    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Post('/')
    @ApiOperation({ summary: 'Створення нового коментаря' })
    @ApiResponse({ status: 201, description: 'Коментар успішно створений' })
    create(
        @Param('exhibitId') exhibitId: number,
        @Body() createCommentDto: CreateCommentDto,
        @Request() req,
    ) {
        return this.commentsService.create(exhibitId, req.user.id, createCommentDto.text);
    }

    @Get('/')
    @ApiOperation({ summary: 'Отримати коментарі поста' })
    @ApiResponse({ status: 200, description: 'Коментарі успішно знайдені' })
    findAll(@Param('exhibitId') exhibitId: number) {
        return this.commentsService.findAllByExhibit(exhibitId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Delete('/:commentId')
    @ApiOperation({ summary: 'Видалення коментаря' })
    @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
    async remove(
        @Param('exhibitId') exhibitId: string,
        @Param('commentId') commentId: string,
        @Request() req,
    ) {
        await this.commentsService.delete(+exhibitId, +commentId, req.user.id);
        return { message: 'Comment successfully deleted' };
    }


}