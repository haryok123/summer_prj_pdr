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
import { Expose } from 'class-transformer';
import { QuestionTheme } from './question-theme.entity';

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

  @Expose()
  get correctAnswers(): number {
    return this.items.filter(
      (item) => item.user_answer === item.question.q_correct_answer,
    ).length;
  }

  @Expose()
  get incorrectAnswers(): number {
    return this.items.filter(
      (item) =>
        item.user_answer !== null &&
        item.user_answer !== item.question.q_correct_answer,
    ).length;
  }

  @Expose()
  get unansweredQuestions(): number {
    return this.items.filter((item) => item.user_answer === null).length;
  }

  @Expose()
  get totalQuestions(): number {
    return this.items.length;
  }

  @Expose()
  get percentage(): number {
    return Math.round((this.correctAnswers / this.totalQuestions) * 100);
  }

  @Expose()
  get theme(): QuestionTheme {
    return this.items[0].question.theme;
  }
}
