import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import Chat from 'src/entities/Chat.entity';
import { CreateChatDto } from '../dto/CreateChatDto';
import { Repository } from 'typeorm';
import User from 'src/entities/User.entity';
import { TokenUser } from 'src/@types';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    private configService: ConfigService,
  ) {}

  async createChat(chatData: CreateChatDto, adminId: string) {
    try {
      const chat = new Chat();
      chat.name = chatData.name;
      const hashedPassword: string = await hash(
        chatData.password,
        +this.configService.get<number>('SALT_ROUNDS'),
      );
      chat.password = hashedPassword;
      chat.adminId = adminId;

      return await this.chatRepository.save(chat);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getAllChats() {
    return await this.chatRepository.find();
  }

  async getChat(chatId: string): Promise<Chat> {
    try {
      const chat: Chat = await this.chatRepository.findOne(chatId);
      if (chat) return chat;
      throw new NotFoundException();
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getChatWithAdmin(id: string): Promise<Chat> {
    try {
      const res = await this.chatRepository.findOne({
        where: { id },
        relations: ['admin'],
      });
      if (res) return res;
      throw new NotFoundException();
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getChatAdmin(id: string): Promise<User> {
    try {
      const chat: Chat = await this.chatRepository.findOne({
        where: { id },
        relations: ['admin'],
      });
      if (chat) return chat.admin;
      throw new NotFoundException();
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
}
