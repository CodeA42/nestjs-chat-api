import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import Chat from 'src/entities/Chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/entities/User.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
  ) {}

  deleteRoom(roomId: string) {
    this.deleteChatRoom(roomId);
  }

  deleteChatRoom(roomId: string) {
    this.chatRepository.delete({ id: roomId });
  }

  async transferOwnership(roomId: string, userId: unknown) {
    const chat: Chat = await this.chatRepository.findOne({ id: roomId });

    chat.admin = userId as User;

    return this.chatRepository.save(chat);
  }
}
