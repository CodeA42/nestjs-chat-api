import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
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

  @ManyToOne((type) => User, {
    onDelete: 'CASCADE',
  })
  admin: User;

  @ManyToMany((type) => User, (user) => user.chats)
  users: User[];

  @Column()
  image: string;
}
