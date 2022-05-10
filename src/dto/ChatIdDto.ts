import { IsUUID } from 'class-validator';

export class ChatIdDto {
  @IsUUID()
  id: string;
}
