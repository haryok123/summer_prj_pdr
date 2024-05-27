import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionTheme } from '../../entities/question-theme.entity';
import { Question } from '../../entities/question.entity';
import { Comments } from '../../entities/comments.entity';

@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(QuestionTheme)
    private readonly questionThemeRepository: Repository<QuestionTheme>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
  ) {}

  async findAllQuestionThemes(): Promise<QuestionTheme[]> {
    return this.questionThemeRepository.find({ relations: ['questions'] });
  }

  async findQuestionThemeById(id: number): Promise<QuestionTheme> {
    return this.questionThemeRepository.findOne({
      where: { theme_id: id },
      relations: ['questions'],
    });
  }

  async findAllQuestions(): Promise<Question[]> {
    return this.questionRepository.find({ relations: ['theme'] });
  }

  async findQuestionById(themeId: number, qId: number): Promise<Question> {
    return this.questionRepository.findOne({
      where: { theme_id: themeId, q_id: qId },
      relations: ['theme'],
    });
  }

  async findAllComments(): Promise<Comments[]> {
    return this.commentsRepository.find({
      relations: ['question', 'user', 'parent_comment'],
    });
  }

  async findCommentById(id: number): Promise<Comments> {
    return this.commentsRepository.findOne({
      where: { comment_id: id },
      relations: ['question', 'user', 'parent_comment'],
    });
  }
}
