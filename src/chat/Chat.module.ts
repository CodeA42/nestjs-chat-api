import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatController } from './Chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './Chat.service';

@Module({
  imports: [ConfigModule],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
