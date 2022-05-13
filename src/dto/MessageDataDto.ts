import { IsNotEmpty, IsUUID, Length } from 'class-validator';

export class MessageDataDto {
  @IsNotEmpty()
  @IsUUID()
  sender: string;

  @IsNotEmpty()
  @IsUUID()
  room: string;

  @IsNotEmpty()
  @Length(0, 2000)
  body: string;
}
