// comments.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserAccount } from './user-account.entity';
import { Question } from './question.entity';

@Entity('comment')
export class Comments {
  @PrimaryGeneratedColumn()
  comment_id: number;

  @ManyToOne(() => Question)
  @JoinColumn([
    { name: 'q_id', referencedColumnName: 'q_id' },
    { name: 'theme_id', referencedColumnName: 'theme_id' },
  ])
  question: Question;

  @ManyToOne(() => UserAccount)
  @JoinColumn({ name: 'user_login', referencedColumnName: 'user_login' })
  user: UserAccount;

  @ManyToOne(() => Comments, { nullable: true })
  @JoinColumn({
    name: 'parent_comment_id',
    referencedColumnName: 'comment_id',
  })
  parent_comment: Comments;

  @OneToMany(() => Comments, (comment) => comment.parent_comment)
  replies: Comments[];

  @Column()
  comment_text: string;

  @CreateDateColumn()
  comment_date: Date;
}
