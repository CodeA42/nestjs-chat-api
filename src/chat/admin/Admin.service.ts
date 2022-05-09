import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import Chat from 'src/entities/Chat.entity';
import { InjectRepository } from '@nestjs/typeorm';

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
}
