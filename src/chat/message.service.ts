import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Chat from 'src/entities/Chat.entity';
import { Repository } from 'typeorm';
import Message from 'src/entities/Message.entity';
import { MessageDataDto } from 'src/dto/MessageDataDto';
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';
import User from 'src/entities/User.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    private userService: UserService,
    private chatService: ChatService,
  ) {}

  async createMessage(messageData: MessageDataDto) {
    //Getting user and chat in case they dont exits in db
    const user: User = await this.userService.getUser(
      messageData.sender || messageData.userId,
    );

    const chat: Chat = await this.chatService.getChat(
      messageData.room || messageData.chatId,
    );
    try {
      const message = new Message();
      message.body = messageData.body;
      message.user = user;
      message.chat = chat;
      message.time = Date.now();

      return await this.messageRepository.save(message);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getMessage(id: string) {
    try {
      const message: Message = await this.messageRepository.findOne({
        where: {
          id,
        },
      });
      if (message) return message;
    } catch (e) {
      console.error(e);
      return null;
    }
    throw new NotFoundException();
  }

  async deleteMessage(id: string) {
    try {
      return await this.messageRepository.delete({ id });
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async updateMessage(id: string, body: string) {
    const message: Message = await this.getMessage(id);
    message.body = body;
    message.edited = Date.now();

    return await this.messageRepository.save(message);
  }
}
