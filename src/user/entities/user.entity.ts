import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 24,
    unique: true,
  })
  username: string;

  @Column({
    length: 64,
  })
  password: string;

  @Column({
    type: 'text',
    unique: true,
  })
  email: string;
}
