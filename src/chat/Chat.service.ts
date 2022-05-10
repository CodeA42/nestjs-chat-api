import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import Chat from 'src/entities/Chat.entity';
import { CreateChatDto } from './dto/CreateChatDto';
import { Repository } from 'typeorm';
import User from 'src/entities/User.entity';
import { TokenUser } from 'src/@types';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
  ) {}

  createChat(chatData: CreateChatDto, userId: string) {
    this.createNewChat(chatData.name, userId);
  }

  createNewChat(chatName: string, adminId: unknown) {
    const chat = new Chat();
    chat.name = chatName;
    chat.admin = adminId as User;

    this.chatRepository.save(chat);
  }
}
