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
import { Server, Socket } from 'socket.io';
import { AuthTypes } from 'src/@types/AuthTypes';
import { Authentication } from 'src/decorators/Authentication.decorator';
import { AuthenticationGuard } from 'src/guards/Authentication.guard';

@WebSocketGateway(80, { cors: '*' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
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
  @WebSocketServer()
  server: Server;

  // @Authentication(AuthTypes.ACCESS)
  // @UseGuards(AuthenticationGuard)
  @SubscribeMessage('join')
  joinRoom(client: Socket, message: string): WsResponse<string> {
    // console.log(socket);

    // console.log(message);

    return { event: 'message', data: message };
  }
}
