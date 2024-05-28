import { Controller, Get, Param, ParseIntPipe, Render } from "@nestjs/common";
import { TestsService } from './tests.service';
import { QuestionTheme } from '../../entities/question-theme.entity';
import { Question } from '../../entities/question.entity';
import { Comments } from '../../entities/comments.entity';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Get('themes')
  async getAllQuestionThemes(): Promise<QuestionTheme[]> {
    return this.testsService.findAllQuestionThemes();
  }

  @Get('themes/:id')
  async getQuestionThemeById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<QuestionTheme> {
    return this.testsService.findQuestionThemeById(id);
  }

  @Get('questions')
  async getAllQuestions(): Promise<Question[]> {
    return this.testsService.findAllQuestions();
  }

  @Get('questions/:themeId/:qId')
  async getQuestionById(
    @Param('themeId', ParseIntPipe) themeId: number,
    @Param('qId', ParseIntPipe) qId: number,
  ): Promise<Question> {
    return this.testsService.findQuestionById(themeId, qId);
  }

  @Get('comments')
  async getAllComments(): Promise<Comments[]> {
    return this.testsService.findAllComments();
  }

  @Get('comments/:id')
  async getCommentById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Comments> {
    return this.testsService.findCommentById(id);
  }

  @Get()
  @Render('tests')
  getTests() {
    return {
      title: 'Тести з ПДР'
    };
  }
}
