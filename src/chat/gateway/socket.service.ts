import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { validate } from 'class-validator';
import { Server, Socket } from 'socket.io';
import { Events } from 'src/@types/Events';
import { ChatGatewayAuthDto } from 'src/dto/ChatGatewayAuthDto';
import { MessageDataDto } from 'src/dto/MessageDataDto';
import Message from 'src/entities/Message.entity';
import { ChatService } from '../chat.service';
import { MessageService } from '../message.service';
import { Cache } from 'cache-manager';

@Injectable()
export class SocketService {
  io: Server = null;

  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async messageFromClient(client: Socket, message: MessageDataDto) {
    try {
      const savedMessage: Message = await this.messageService.createMessage(
        message,
      );

      const messageToSend: MessageDataDto = new MessageDataDto();
      messageToSend.sender = savedMessage.userId;
      messageToSend.body = savedMessage.body;
      messageToSend.time = savedMessage.time;

      this.io.to(message.room).emit(Events.MESSAGE_FROM_SERVER, messageToSend);
    } catch (e) {
      throw new WsException(e.name);
    }
  }

  async joinRoom(client: Socket, data: any) {
    if (
      !(await this.validJoinData({
        chatId: data.chatId,
        userId: data.userId,
        uuid: data.uuid,
      }))
    ) {
      client.emit(
        Events.JOIN_DECLINED,
        (data =
          `${data.roomId} - Cannot authenticate user to given room` ||
          'Room not specified'),
      );
      return;
    }

    client.join(data.chatId);
    console.log(`${client.id} joined ${data.chatId}`);

    client.emit(Events.JOINED_ROOM, data.chatId);
  }

  /**
   * Validates that the user can connect to the socket with the given chatId, userId and uuid
   * @returns true if valid false in any other case
   */
  async validJoinData(input: ChatGatewayAuthDto): Promise<boolean> {
    const data = new ChatGatewayAuthDto();
    data.chatId = input.chatId;
    data.userId = input.userId;
    data.uuid = input.uuid;

    const validationErrors = await validate(data);

    if (validationErrors.length !== 0) {
      return false;
    }

    const cacheUuid = await this.cacheManager.get<string>(
      `${data.chatId}-${data.userId}`,
    );

    if (data.uuid === cacheUuid) {
      return true;
    }
  }
}
