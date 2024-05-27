import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Test } from '@nestjs/testing';
import { Question } from './question.entity';

@Entity()
export class TestQuestion {
  @PrimaryGeneratedColumn()
  test_question_id: number;

  @ManyToOne(() => Test)
  @JoinColumn({ name: 'test_id' })
  test: Test;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'q_id' })
  question: Question;

  @Column({ nullable: true })
  user_answer: number;
}
