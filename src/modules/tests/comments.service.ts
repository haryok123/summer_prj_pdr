import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionTheme } from '../../entities/question-theme.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {}

  async getAllCommentsByThemeAndQuestion(): Promise<Comment[]> {
    return await this.commentsRepository.find();
  }
}
