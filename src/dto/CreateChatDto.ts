import { IsAlphanumeric, IsNotEmpty, Length } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(4, 20)
  password: string;
}
