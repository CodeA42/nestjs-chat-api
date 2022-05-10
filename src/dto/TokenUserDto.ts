import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class TokenUserDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
