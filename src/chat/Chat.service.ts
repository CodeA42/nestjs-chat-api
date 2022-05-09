import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import Chat from 'src/entities/Chat.entity';
import { createChatDto } from './dto/createChatDto';
import { Repository } from 'typeorm';
import User from 'src/entities/User.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
  ) {}
  createChat(chatData: createChatDto, req: Request) {
    this.createNewChat(chatData.name, req.user.id);
  }

  createNewChat(chatName: string, adminId: unknown) {
    const chat = new Chat();
    chat.name = chatName;
    chat.admin = adminId as User;

    this.chatRepository.save(chat);
  }
}
