import { IsNotEmpty, IsUUID, Length } from 'class-validator';

export class MessageDataDto {
  constructor(data: MessageDataDto) {
    this.sender = data.sender;
    this.room = data.room;
    this.body = data.room;
  }
  @IsNotEmpty()
  @IsUUID()
  sender: string;

  @IsNotEmpty()
  @IsUUID()
  room: string;

  @IsNotEmpty()
  @Length(0, 2000)
  body;
}
