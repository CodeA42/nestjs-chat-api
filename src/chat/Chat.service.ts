import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import Chat from 'src/entities/Chat.entity';
import { CreateChatDto } from '../dto/CreateChatDto';
import { Repository } from 'typeorm';
import User from 'src/entities/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { Cache } from 'cache-manager';
import { ChatRoomKey } from 'src/@types';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Given chat data and user id creates a chat room with admin the given user
   * @param chatData Chat data
   * @param adminId Admin of the room
   * @returns Id of the saved chat
   */
  async createChat(chatData: CreateChatDto, adminId: string): Promise<string> {
    try {
      const chat = new Chat();
      chat.name = chatData.name;
      const hashedPassword: string = await hash(
        chatData.password,
        +this.configService.get<number>('SALT_ROUNDS'),
      );
      chat.password = hashedPassword;
      chat.adminId = adminId;

      const savedChat: Chat = await this.chatRepository.save(chat);
      return savedChat.id;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  /**
   * @returns Id and name of all chats
   */
  async getAllChats(): Promise<{ id: string; name: string }[]> {
    return await this.chatRepository.find({ select: ['id', 'name'] });
  }

  /**
   * Gets a Chat Entity from given chat id
   * @param id Chat id
   * @returns Chat entity with all fields but Admin
   */
  async getChat(id: string): Promise<Chat> {
    try {
      const chat: Chat = await this.chatRepository.findOne(id);
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

  /**
   *  Gets Chat Entity with Admin attached to it
   * @param id Chat id
   */
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

  /**
   * Gets only Admin of a given Chat
   * @param id Chat id
   * @returns User Entity without Chats that the user has joined
   */
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

  /**
   * Check if password matches that of the chat room
   * @param id Repository id
   * @param password Password to compare with
   */
  async checkPassword(id: string, password: string): Promise<boolean> {
    const chat: Chat = await this.getChat(id);

    return await compare(password, chat.password);
  }

  /**
   * Given a chat id, password and user id, adds the user to the chat if the password is correct
   * @returns Uuid key and the chat for which it will work. The key will work for 30 seconds only
   */
  async joinChat(
    chatId: string,
    password: string,
    userId: string,
  ): Promise<ChatRoomKey> {
    const chat: Chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['users'],
    });

    if (await compare(password, chat.password)) {
      const user: User = await this.userRepository.findOne({
        where: { id: userId },
      });

      chat.users.push(user);
      await this.chatRepository.save(chat);
      const uuid: string = uuidv4();

      await this.cacheManager.set(`${chatId}-${userId}`, uuid, { ttl: 30 });

      return { id: chatId, uuid };
    }
    throw new UnauthorizedException();
  }
}
