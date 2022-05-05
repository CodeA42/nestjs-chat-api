import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway(80, { namespace: 'chat' })
export class ChatGateway {
  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): string {
    return message;
  }
}
