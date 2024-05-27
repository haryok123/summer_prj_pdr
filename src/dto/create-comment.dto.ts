import { Length } from 'class-validator';

export class CreateCommentDto {
  @Length(1, 2000)
  comment_text: string;
}
