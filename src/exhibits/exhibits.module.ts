import { Module } from '@nestjs/common';
import { ExhibitsService } from './exhibits.service';
import { ExhibitsController } from './exhibits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exhibit } from './exhibits.entity';
import { Comment } from 'src/comments/comments.entity';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Module({
    imports: [TypeOrmModule.forFeature([Exhibit, Comment])],
    providers: [ExhibitsService, NotificationsGateway],
    controllers: [ExhibitsController],
    exports: [ExhibitsService],
})
export class ExhibitsModule { }