import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Chat from 'src/entities/Chat.entity';
import { Repository } from 'typeorm';
import Message from 'src/entities/Message.entity';
import { MessageDataDto } from 'src/dto/MessageDataDto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  async createMessage(messageData: MessageDataDto) {
    const message = new Message();
    message.body = messageData.body;
    message.userId = messageData.sender || messageData.userId;
    message.chatId = messageData.room || messageData.chatId;
    message.time = Date.now();

    return await this.messageRepository.save(message);
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
