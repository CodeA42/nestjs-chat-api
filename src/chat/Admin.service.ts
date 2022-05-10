import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import Chat from 'src/entities/Chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/entities/User.entity';
import { NewPaswordDto } from 'src/dto/NewPasswordDto';
import { ChatService } from './Chat.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    private chatService: ChatService,
  ) {}

  deleteRoom(roomId: string) {
    this.deleteChatRoom(roomId);
  }

  deleteChatRoom(roomId: string) {
    this.chatRepository.delete({ id: roomId });
  }

  async transferOwnership(roomId: string, userId: string) {
    const chat: Chat = await this.chatRepository.findOne({ id: roomId });

    chat.adminId = userId;

    return this.chatRepository.save(chat);
  }

  changePassword(roomId: string, newPasswordDto: NewPaswordDto) {
    if (this.chatService.checkPassword(roomId, newPasswordDto.oldPassword)) {
    }
  }
}
