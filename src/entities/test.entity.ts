import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserAccount } from './user-account.entity';

@Entity()
export class Test {
  @PrimaryGeneratedColumn()
  test_id: number;

  @ManyToOne(() => UserAccount)
  @JoinColumn({ name: 'user_login' })
  user: UserAccount;

  @CreateDateColumn()
  test_date: Date;

  @Column({ type: 'enum', enum: ['theme', 'exam'] })
  test_type: 'theme' | 'exam';
}
