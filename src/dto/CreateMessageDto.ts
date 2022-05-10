import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  body: string;

  @IsNotEmpty()
  @IsUUID()
  userId: unknown;

  @IsNotEmpty()
  time: number;

  @IsNotEmpty()
  @IsUUID()
  chatId: unknown;
}
