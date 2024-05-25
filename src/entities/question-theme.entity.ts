import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class QuestionTheme {
  @PrimaryGeneratedColumn('increment')
  theme_id: number;

  @Column({ length: 150 })
  theme_chapter: string;

  @OneToMany(() => Question, (question) => question.theme)
  questions: Question[];
}
