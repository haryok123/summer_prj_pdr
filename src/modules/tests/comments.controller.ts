import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  InternalServerErrorException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comments } from '../../entities/comments.entity';
import { CreateCommentDto } from '../../dto/create-comment.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('themes-list')
  async getAllCommentsByThemeAndQuestion(
    @Query('themeId') themeId: number,
    @Query('qId') qId: number,
  ): Promise<Comments[]> {
    try {
      return await this.commentsService.getAllCommentsByThemeAndQuestion(
        themeId,
        qId,
      );
    } catch (error) {
      console.error('Error in controller:', error);
      throw new InternalServerErrorException(
        'Failed to fetch comments by theme and question',
      );
    }
  }

  @Get()
  async getAllComments(): Promise<Comments[]> {
    return await this.commentsService.findAllComments();
  }

  @Get(':theme_id/:q_id')
  async getCommentsToQuestions(
    @Param('theme_id') themeId: number,
    @Param('q_id') q_id: number,
  ): Promise<Comments[]> {
    return await this.commentsService.getAllCommentsByThemeAndQuestion(
      themeId,
      q_id,
    );
  }
  @UseGuards(AuthGuard)
  @Post('createComment')
  async createComment(
    @Req() req: Request,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comments> {
    return await this.commentsService.createComment(
      createCommentDto,
      req['user'],
    );
  }

  @Delete(':id')
  async deleteComment(@Param('id') id: number): Promise<void> {
    try {
      await this.commentsService.deleteComment(id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete comment');
    }
  }
}
