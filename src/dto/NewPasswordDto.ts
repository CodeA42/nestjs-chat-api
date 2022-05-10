import { IsAlphanumeric, IsNotEmpty, Length } from 'class-validator';

export class NewPaswordDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(4, 20)
  oldPassword: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(4, 20)
  newPassword: string;
}
