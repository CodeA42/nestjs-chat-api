import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import User from './User.entity';

@Entity()
export default class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
  })
  name: string;

  @Column({ type: 'text' })
  adminId: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'adminId' })
  admin: User;

  @ManyToMany(() => User, (user) => user.chats)
  @JoinTable()
  users: User[];

  @Column({
    type: 'text',
  })
  password: string;
}
