import { IsNotEmpty, Length } from 'class-validator';

export class MessageBodyDto {
  @IsNotEmpty()
  @Length(1, 2000)
  body: string;
}
