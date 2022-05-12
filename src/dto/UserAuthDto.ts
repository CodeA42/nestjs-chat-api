import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class UserAuthDto {
  @IsAlphanumeric()
  @IsOptional()
  username: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  password: string;

  @IsEmail()
  @IsOptional()
  email: string;
}
