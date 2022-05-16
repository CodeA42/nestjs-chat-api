import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Events } from 'src/@types/Events';
import { MessageDataDto } from 'src/dto/MessageDataDto';
import { WsExceptionFilter } from 'src/filters/WsExceptionFiler';
import { ChatService } from '../chat.service';
import { MessageService } from '../message.service';
import { SocketService } from './socket.service';

@WebSocketGateway(80, { cors: '*', namespace: '/chat_gateway' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private chatService: ChatService,
    private socketService: SocketService,
  ) {}

  @WebSocketServer()
  io: Server;

  private logger: Logger = new Logger('ChatGateway');
  afterInit(server: Server) {
    this.socketService.io = server;
    this.logger.log('Initialized!');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const auth = client.handshake.auth;
    if (
      await this.socketService.validJoinData({
        chatId: auth.chatId,
        userId: auth.userId,
        uuid: auth.uuid,
      })
    ) {
      client.disconnect();
      return;
    }

    client.join(auth.chatId);
    this.chatService.userConnected(client.id, auth.chatId, auth.userId);
    client.emit(Events.JOINED_ROOM, auth.chatId);

    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // @Authentication(AuthTypes.ACCESS)
  // @UseGuards(AuthenticationGuard)
  @SubscribeMessage(Events.MESSAGE_FROM_CLIENT)
  @UsePipes(new ValidationPipe())
  @UseFilters(new WsExceptionFilter())
  async message(client: Socket, message: MessageDataDto) {
    this.socketService.messageFromClient(client, message);
  }

  @SubscribeMessage(Events.DISCONNECT)
  disconnect(client: Socket, data: any) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(Events.JOIN_ROOM)
  async joinRoom(client: Socket, data: any) {
    this.socketService.joinRoom(client, data);
  }

  @SubscribeMessage(Events.LEAVE_ROOM)
  leaveRoom(client: Socket, room: string) {
    client.leave(room);
    client.emit(Events.LEFT_ROOM, room);
  }
}
