import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Length,
  ValidateIf,
} from 'class-validator';

export class MessageDataDto {
  @IsNotEmpty()
  @IsUUID()
  @ValidateIf((o) => o.userId === undefined || o.sender)
  sender?: string;

  @IsNotEmpty()
  @IsUUID()
  @ValidateIf((o) => o.sender === undefined || o.userId)
  userId?: string;

  @IsNotEmpty()
  @IsUUID()
  @ValidateIf((o) => o.chatId === undefined || o.room)
  room?: string;

  @IsNotEmpty()
  @IsUUID()
  @ValidateIf((o) => o.room === undefined || o.chatId)
  chatId?: string;

  @IsNotEmpty()
  @Length(0, 2000)
  body: string;

  @IsOptional()
  @IsNumber()
  time?: number;
}
