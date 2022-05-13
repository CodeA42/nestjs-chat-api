import {
  CACHE_MANAGER,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  BaseWsExceptionFilter,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { Server, ServerOptions, Socket } from 'socket.io';
import { AuthTypes } from 'src/@types/AuthTypes';
import { Events } from 'src/@types/Events';
import { Authentication } from 'src/decorators/authentication.decorator';
import { AuthenticationGuard } from 'src/guards/Authentication.guard';
import { ChatService } from './chat.service';
import { Cache } from 'cache-manager';
import { MessageService } from './message.service';
import { GatewayService } from './gateway.service';
import { MessageDataDto } from 'src/dto/MessageDataDto';
import { WsExceptionFilter } from 'src/filters/WsExceptionFiler';

@WebSocketGateway(80, { cors: '*', namespace: '/chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
    private gatewayService: GatewayService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @WebSocketServer()
  wss: Server;

  private logger: Logger = new Logger('ChatGateway');
  afterInit(server: Server) {
    // server.on('disconnect', () => {
    //   console.log('inside server disconnect');
    // });
    this.logger.log('Initialized!');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const auth = client.handshake.auth;

    if (
      await this.chatService.validJoinData({
        chatId: auth.chatId,
        userId: auth.userId,
        uuid: auth.uuid,
      })
    ) {
      client.disconnect();
      return;
    }

    client.join(auth.chatId);
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
  async message(
    client: Socket,
    // message: { sender: string; room: string; body: string },
    message: MessageDataDto,
  ) {
    const isDataValid = await this.gatewayService.validateMessageData(message);

    if (client.rooms.has(message.room)) {
      try {
        // this.messageService.createMessage();
      } catch (e) {}
      this.wss.to(message.room).emit(Events.MESSAGE_FROM_SERVER, message);
    } else {
      //client.disconnect();
    }
  }

  @SubscribeMessage(Events.DISCONNECT)
  disconnect(client: Socket, data: any) {
    console.log(`Client disconnected: ${client.id}`);
    console.log(data);
  }

  // @SubscribeMessage(MessageTypes.GET_CONNECTED_ROOMS)
  // connectedRooms(client: Socket) {
  //   client.emit(client.)
  // }

  @SubscribeMessage(Events.JOIN_ROOM)
  async joinRoom(client: Socket, data: any) {
    if (
      !(await this.chatService.validJoinData({
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

  @SubscribeMessage(Events.LEAVE_ROOM)
  leaveRoom(client: Socket, room: string) {
    client.leave(room);
    client.emit(Events.LEFT_ROOM, room);
  }

  @SubscribeMessage('request')
  request() {
    console.log('here');
  }
}
