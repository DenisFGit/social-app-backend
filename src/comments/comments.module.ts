import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import {CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment} from './comments.entity';
import { Exhibit } from '../exhibits/exhibits.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Comment, Exhibit])],
    providers: [CommentsService],
    controllers: [CommentsController],
    exports: [CommentsService],
})
export class CommentsModule { }