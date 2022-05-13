import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
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

  @Column({ type: 'text' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'text' })
  chatId: string;

  @ManyToOne(() => Chat, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chatId' })
  chat: Chat;

  @Column({
    type: 'bigint',
  })
  time: number;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  edited: number;
}
