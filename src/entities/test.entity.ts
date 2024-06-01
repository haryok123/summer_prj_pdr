import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserAccount } from './user-account.entity';
import { TestQuestion } from './test-question.entity';

@Entity('test')
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

  @Column({ type: 'boolean' })
  is_done: boolean;

  @OneToMany(() => TestQuestion, (item) => item.test)
  items: TestQuestion[];
}
