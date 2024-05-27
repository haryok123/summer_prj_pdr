import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Test } from './test.entity';
import { Question } from './question.entity';

@Entity('test_question')
export class TestQuestion {
  @PrimaryGeneratedColumn()
  test_question_id: number;

  @ManyToOne(() => Test, (test) => test.items)
  @JoinColumn({ name: 'test_id' })
  test: Test;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'q_id' })
  question: Question;

  @Column({ nullable: true })
  user_answer: number;
}
