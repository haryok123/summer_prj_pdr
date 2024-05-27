import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserAccount } from './user-account.entity';
import { Question } from './question.entity';

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  comment_id: number;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'q_id' })
  question: Question;

  @ManyToOne(() => UserAccount)
  @JoinColumn({ name: 'user_login' })
  user: UserAccount;

  @ManyToOne(() => Comment, { nullable: true })
  @JoinColumn({ name: 'parent_comment_id' })
  parent_comment: Comment;

  @Column()
  comment_text: string;

  @CreateDateColumn()
  comment_date: Date;
}
