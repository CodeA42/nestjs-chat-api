import { Module } from '@nestjs/common';
import { ChatController } from './Chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './Chat.service';

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
