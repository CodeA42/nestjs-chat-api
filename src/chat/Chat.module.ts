import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import Chat from 'src/entities/Chat.entity';
import { AdminController } from './Admin.controller';
import { AdminService } from './Admin.service';
import { ChatController } from './Chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './Chat.service';

@Module({
  imports: [ConfigModule, MulterModule, TypeOrmModule.forFeature([Chat])],
  controllers: [ChatController, AdminController],
  providers: [ChatGateway, ChatService, AdminService],
})
export class ChatModule {}
