import { IsAlphanumeric, IsOptional, Length } from 'class-validator';

export class chatPasswordDto {
  @IsOptional()
  @IsAlphanumeric()
  @Length(4, 20)
  password: string;
}
