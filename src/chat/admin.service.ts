import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import Chat from 'src/entities/Chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NewPaswordDto } from 'src/dto/NewPasswordDto';
import { ChatService } from './chat.service';
import { hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UpdateChatDataDto } from 'src/dto/UpdateChatDataDto';
import { KickedUser } from 'src/@types';
import { SocketService } from './gateway/socket.service';
import { Namespace, Server } from 'socket.io';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    private readonly chatService: ChatService,
    private readonly configService: ConfigService,
    private readonly socketService: SocketService,
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
   * @returns The chat room without password field
   */
  async updateRoom(id: string, data: UpdateChatDataDto): Promise<Chat> {
    try {
      let chat: Chat = await this.chatService.getChat(id);
      chat.name = data.name;

      chat = await this.chatRepository.save(chat);
      delete chat.password;
      return chat;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Given a chat id and a user id, kicks the user from the room.
   * @returns Chat room id and kicked user id object.
   */
  async kickUser(chatId: string, userId: string): Promise<KickedUser> {
    // await this.chatService.leaveChat(chatId, userId);
    const namespace: Namespace = this.socketService.io.of(`/${chatId}`);
    console.log(namespace);
    console.log(namespace.sockets);

    const server: Server = await this.socketService.io;

    console.log(server.sockets);

    // sockets.filter()

    // console.log(this.socketService.io.of('/chat').sockets);

    return { chatId, userId };
  }
}
