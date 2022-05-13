import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import Chat from 'src/entities/Chat.entity';
import Message from 'src/entities/Message.entity';
import User from 'src/entities/User.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { MessageService } from './message.service';

@Module({
  imports: [
    ConfigModule,
    MulterModule,
    TypeOrmModule.forFeature([Chat, User, Message]),
    CacheModule.register(),
  ],
  controllers: [ChatController, AdminController],
  providers: [ChatGateway, ChatService, AdminService, MessageService],
})
export class ChatModule {}
