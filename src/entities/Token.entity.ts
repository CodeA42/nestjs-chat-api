import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export default class Token {
  @PrimaryColumn({
    type: 'text',
    unique: true,
  })
  token: string;

  @Column({
    type: 'bigint',
  })
  exp: number;

  @Column({
    length: 24,
  })
  username: string;

  @Column({
    type: 'text',
  })
  userAgent: string;
}
