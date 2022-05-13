import { IsNotEmpty, IsUUID } from 'class-validator';

export class ChatGatewayAuthDto {
  @IsNotEmpty()
  @IsUUID()
  chatId: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  uuid: string;
}
