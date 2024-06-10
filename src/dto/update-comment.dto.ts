import { Length } from 'class-validator';

export class UpdateCommentDto {
  @Length(1, 2000)
  comment_text: string;

  q_id?: number;
  theme_id?: number;
  user_login?: string;
  parent_comment_id?: number;
}
