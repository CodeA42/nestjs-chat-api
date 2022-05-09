import { Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, ServerOptions, Socket } from 'socket.io';
import { AuthTypes } from 'src/@types/AuthTypes';
import { Authentication } from 'src/decorators/Authentication.decorator';
import { AuthenticationGuard } from 'src/guards/Authentication.guard';

@WebSocketGateway(80, { cors: '*', namespace: '/chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  wss: Server;

  private logger: Logger = new Logger('ChatGateway');
  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }
  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // @Authentication(AuthTypes.ACCESS)
  // @UseGuards(AuthenticationGuard)
  @SubscribeMessage('messageToServer')
  message(
    client: Socket,
    message: { sender: string; room: string; message: string },
  ) {
    // console.log(socket);
    this.wss.to(message.room).emit('messageToClient', message);

    // return { event: 'message', data: message };
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    client.emit('leftRoom', room);
  }
}
