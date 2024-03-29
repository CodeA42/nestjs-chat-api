import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import Chat from 'src/entities/Chat.entity';
import Message from 'src/entities/Message.entity';
import User from 'src/entities/User.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { GatewayService } from './gateway.service';
import { ChatGateway } from './gateway/chat.gateway';
import { SocketService } from './gateway/socket.service';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [
    ConfigModule,
    MulterModule,
    TypeOrmModule.forFeature([Chat, User, Message]),
    CacheModule.register(),
    UserModule,
  ],
  controllers: [ChatController, AdminController, MessageController],
  providers: [
    ChatGateway,
    ChatService,
    AdminService,
    MessageService,
    GatewayService,
    UserService,
    SocketService,
  ],
})
export class ChatModule {}
