import {
  IsAlphanumeric,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsAlphanumeric()
  @Length(4, 20)
  password: string;
}
