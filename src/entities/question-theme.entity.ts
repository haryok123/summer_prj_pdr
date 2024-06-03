import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  PrimaryColumn,
  //JoinColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { Expose } from 'class-transformer';

@Entity('question_theme')
export class QuestionTheme {
  @PrimaryColumn({ type: 'double' })
  theme_id: number;

  @Column({ length: 150 })
  theme_chapter: string;

  @OneToMany(() => Question, (question) => question.theme)
  questions: Question[];

  @Expose()
  get questionCount() {
    return this.questions.length;
  }
}
