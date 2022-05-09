import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import Chat from './Chat.entity';
import User from './User.entity';

@Entity()
export default class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
  })
  body: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Chat, {
    onDelete: 'CASCADE',
  })
  chat: Chat;

  @Column({
    type: 'bigint',
  })
  time: number;
}
