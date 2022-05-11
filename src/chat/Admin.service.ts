import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import Chat from 'src/entities/Chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/entities/User.entity';
import { NewPaswordDto } from 'src/dto/NewPasswordDto';
import { ChatService } from './Chat.service';
import { hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UpdateChatDataDto } from 'src/dto/UpdateChatDataDto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    private readonly chatService: ChatService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Given a chat room id deletes the room and returns the room id on success.
   * @param id Chat id
   * @returns Id of the deleted chat room
   */
  async deleteRoom(id: string): Promise<string> {
    try {
      await this.chatRepository.delete({ id });
      return id;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Transfers Admin priviledges to another User given Chat id and User id to whom the admin proviledges will go.
   * @param roomId Chat id
   * @param userId User to transfer admin to
   * @returns Id of the chat room
   */
  async transferOwnership(roomId: string, userId: string): Promise<string> {
    const chat: Chat = await this.chatRepository.findOne({ id: roomId });
    chat.adminId = userId;

    const saved: Chat = await this.chatRepository.save(chat);
    return saved.id;
  }

  /**
   * Takes Chat id and an object with the old and new passward. If the old password matches the one in the database the password is updated.
   * @param id Chat id
   * @param newPasswordDto Object carrying the old and new passwords
   * @returns Id of the chat room
   */
  async changePassword(
    id: string,
    newPasswordDto: NewPaswordDto,
  ): Promise<string> {
    if (await this.chatService.checkPassword(id, newPasswordDto.oldPassword)) {
      return await this.updatePassword(id, newPasswordDto.newPassword);
    }
  }

  /**
   * Takes chat id and password and updates the password of the Chat Entity
   * @param id Chat id
   * @returns The id of the chat on success
   */
  async updatePassword(id: string, password: string): Promise<string> {
    try {
      let chat: Chat = await this.chatService.getChat(id);
      if (chat) {
        chat.password = await hash(
          password,
          +this.configService.get<number>('SALT_ROUNDS'),
        );

        chat = await this.chatRepository.save(chat);
        return chat.id;
      }
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
   * Given chat id updats room data (without password) and returns room id.
   * @param id Chat id
   * @returns Id of the chat room
   */
  async updateRoom(id: string, data: UpdateChatDataDto): Promise<string> {
    try {
      let chat: Chat = await this.chatService.getChat(id);
      chat.name = data.name;

      chat = await this.chatRepository.save(chat);
      return chat.id;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
}
