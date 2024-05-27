import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { QuestionTheme } from './question-theme.entity';

@Entity('question')
export class Question {
  @PrimaryColumn()
  theme_id: number;

  @PrimaryColumn()
  q_id: number;

  @Column({ length: 500 })
  q_content: string;

  @Column('mediumblob', { nullable: true })
  q_image: Buffer;

  @Column({ length: 500 })
  q_answer1: string;

  @Column({ length: 500 })
  q_answer2: string;

  @Column({ length: 500, nullable: true })
  q_answer3: string;

  @Column({ length: 500, nullable: true })
  q_answer4: string;

  @Column({ length: 500, nullable: true })
  q_answer5: string;

  @Column()
  q_correct_answer: number;

  @ManyToOne(() => QuestionTheme, (theme) => theme.questions)
  @JoinColumn({ name: 'theme_id', referencedColumnName: 'theme_id' })
  theme: QuestionTheme;
}
