import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  PrimaryColumn,
  //JoinColumn,
} from 'typeorm';
import { Question } from './question.entity';

@Entity('question_theme')
export class QuestionTheme {
  @PrimaryColumn({ type: 'double' })
  theme_id: number;

  @Column({ length: 150 })
  theme_chapter: string;

  @OneToMany(() => Question, (question) => question.theme)
  //@JoinColumn({ name: 'q_id', referencedColumnName: 'q_id' })
  questions: Question[];
}
