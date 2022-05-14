import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export class UserAuthDto {
  @IsAlphanumeric()
  @IsOptional()
  @ValidateIf((o) => o.email === undefined || o.username)
  username: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  password: string;

  @IsEmail()
  @IsOptional()
  @ValidateIf((o) => o.username === undefined || o.email)
  email: string;
}
