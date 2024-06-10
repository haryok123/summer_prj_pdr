import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comments } from '../../entities/comments.entity';
import { CreateCommentDto } from '../../dto/create-comment.dto';
import { UserAccount } from '../../entities/user-account.entity';
import { TestsService } from './tests.service';
import { CommentsController } from './comments.controller';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
    private readonly testService: TestsService,
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
  ) {}

  async getAllCommentsByThemeAndQuestion(
    themeId: number,
    qId: number,
  ): Promise<Comments[]> {
    try {
      const comments = await this.commentsRepository.find({
        where: {
          question: {
            theme_id: themeId,
            q_id: qId,
          },
        },
        relations: [
          'question',
          'user',
          'parent_comment',
          'replies',
          'replies.user',
        ],
        order: { comment_date: 'DESC' },
      });
      return comments;
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }

  async findAllComments(): Promise<Comments[]> {
    try {
      return await this.commentsRepository.find({
        relations: ['question', 'user', 'parent_comment', 'replies'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch comments');
    }
  }

  async findComment(id: number): Promise<Comments> {
    return await this.commentsRepository.findOne({
      where: { comment_id: id },
      relations: ['question', 'user'],
    });
  }

  async createComment(
    createCommentDto: CreateCommentDto,
    user: UserAccount,
  ): Promise<Comments> {
    const parent = createCommentDto.parent_comment_id
      ? await this.findComment(createCommentDto.parent_comment_id)
      : null;
    const question = parent
      ? parent.question
      : await this.testService.findQuestionById(
          createCommentDto.theme_id,
          createCommentDto.q_id,
        );
    const comment = this.commentsRepository.create({
      question: question,
      user: await this.userAccountRepository.findOne({
        where: { user_login: createCommentDto.user_login },
      }),
      parent_comment: parent,
      comment_text: createCommentDto.comment_text,
    });
    return await this.commentsRepository.save(comment);
  }

  async deleteComment(id: number): Promise<void> {
    try {
      const result = await this.commentsRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Comment with id ${id} not found`);
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete comment');
    }
  }
}
