import { IsAlphanumeric, IsNotEmpty, Length, Max, Min } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(4, 20)
  password: string;
}
