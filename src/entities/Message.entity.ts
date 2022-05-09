import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
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

  @ManyToOne((type) => User)
  user: User;

  @ManyToOne((type) => Chat, {
    onDelete: 'CASCADE',
  })
  chat: Chat;

  @Column({
    type: 'bigint',
  })
  time: number;
}
