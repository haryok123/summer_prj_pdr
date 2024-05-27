import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Question } from './question.entity';

@Entity('question_theme')
export class QuestionTheme {
  @PrimaryGeneratedColumn('increment')
  theme_id: number;

  @Column({ length: 150 })
  theme_chapter: string;

  @OneToMany(() => Question, (question) => question.theme)
  @JoinColumn({ name: 'q_id', referencedColumnName: 'q_id' })
  questions: Question[];
}
