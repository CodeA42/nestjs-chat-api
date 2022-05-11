import { IsAlphanumeric, IsNotEmpty, Length } from 'class-validator';

export class chatPasswordDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(4, 20)
  password: string;
}
