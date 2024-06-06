import { Controller, Get } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('tests')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('themes-list')
  async getAllQuestionThemes(): Promise<Comment[]> {
    return this.commentsService.getAllCommentsByThemeAndQuestion();
  }
}
