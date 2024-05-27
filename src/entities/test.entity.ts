import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserAccount } from './user.entity';

@Entity()
export class Test {
  @PrimaryGeneratedColumn()
  test_id: number;

  @ManyToOne(() => UserAccount)
  @JoinColumn({ name: 'user_login' })
  user: UserAccount;

  @CreateDateColumn()
  test_date: Date;

  @Column()
  test_type: 'theme' | 'exam';
}
