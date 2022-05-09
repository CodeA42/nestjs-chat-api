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

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  admin: User;

  @ManyToMany(() => User, (user) => user.chats)
  users: User[];

  @Column({
    nullable: true,
  })
  image: string;
}
