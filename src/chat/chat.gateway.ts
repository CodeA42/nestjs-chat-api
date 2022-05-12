import {
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  UseFilters,
  UseGuards,
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
import { MessageTypes } from 'src/@types/MessageTypes';
import { Authentication } from 'src/decorators/authentication.decorator';
import { AuthenticationGuard } from 'src/guards/Authentication.guard';
import { ChatService } from './chat.service';

@WebSocketGateway(80, { cors: '*', namespace: '/chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private chatService: ChatService) {}

  @WebSocketServer()
  wss: Server;

  private logger: Logger = new Logger('ChatGateway');
  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(client.connected);
    if (client.handshake.auth.uuid !== '123') {
      // this.wss.serverSideEmit('test');
      // throw new HttpException('Invalid credentials.', HttpStatus.CONFLICT);
      // this.wss.serverSideEmit(MessageTypes.DISCONNECT);
      client.disconnect(true);
      console.log(client.connected);
      return;
    }
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // @Authentication(AuthTypes.ACCESS)
  // @UseGuards(AuthenticationGuard)
  @SubscribeMessage(MessageTypes.MESSAGE_FROM_CLIENT)
  message(
    client: Socket,
    message: { sender: string; room: string; message: string },
  ) {
    // console.log(socket);
    this.wss.to(message.room).emit(MessageTypes.MESSAGE_FROM_SERVER, message);

    // return { event: 'message', data: message };
  }

  @SubscribeMessage(MessageTypes.CONNECTION)
  connect(client: Socket, ...args: any[]) {
    console.log('here');
  }

  @SubscribeMessage(MessageTypes.DISCONNECT)
  disconnect(client: Socket, data: any) {
    console.log(`Client disconnected: ${client.id}`);
    console.log(data);
  }

  @SubscribeMessage(MessageTypes.JOIN_ROOM)
  joinRoom(client: Socket, room: string) {
    client.join(room);
    client.emit(MessageTypes.JOINED_ROOM, room);
  }

  @SubscribeMessage(MessageTypes.LEAVE_ROOM)
  leaveRoom(client: Socket, room: string) {
    client.leave(room);
    client.emit(MessageTypes.LEFT_ROOM, room);
  }
}
