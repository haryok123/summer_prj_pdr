import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  @IsNotEmpty()
  q_id: number;

  @IsNumber()
  @IsNotEmpty()
  theme_id: number;

  user_login: string;

  @IsString()
  @IsNotEmpty()
  comment_text: string;

  @IsNumber()
  @IsOptional()
  parent_comment_id?: number;
}
