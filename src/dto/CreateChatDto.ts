import { IsAlphanumeric, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @Min(4)
  @Max(20)
  password: string;
}
