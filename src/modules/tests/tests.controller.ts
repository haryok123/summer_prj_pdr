import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TestsService } from './tests.service';
import { QuestionTheme } from '../../entities/question-theme.entity';
import { Question } from '../../entities/question.entity';
import { Comments } from '../../entities/comments.entity';
import { CreateTestDto } from '../../dto/create-test.dto';
import { Test } from '../../entities/test.entity';
import { TestQuestion } from '../../entities/test-question.entity';
import { UpdateTestQuestionDto } from '../../dto/update-test-question.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Get('themes-list')
  async getAllQuestionThemes(): Promise<QuestionTheme[]> {
    return this.testsService.findAllQuestionThemes();
  }

  @Get('comments')
  async getAllComments(): Promise<Comments[]> {
    return this.testsService.findAllComments();
  }

  @Post()
  async createTest(@Body() createTestDto: CreateTestDto): Promise<Test> {
    return this.testsService.createTest(createTestDto);
  }

  @Get('all-tests')
  async findAllTests(): Promise<Test[]> {
    return this.testsService.findAllTests();
  }

  @Get('test/:id')
  async findOneTest(@Param('id') id: number): Promise<Test> {
    return this.testsService.findOneTest(id);
  }

  @Post('update/questions/:id')
  async updateTestQuestion(
    @Param('id') test_question_id: number,
    @Body('user_answer') user_answer: number,
  ): Promise<{ correctAnswer: number }> {
    const testQuestion =
      await this.testsService.findTestQuestionById(test_question_id);
    if (!testQuestion) {
      throw new NotFoundException('Test question not found');
    }
    const dto: UpdateTestQuestionDto = {
      user_answer: user_answer,
    };
    await this.testsService.updateTestQuestion(test_question_id, dto);

    const correctAnswer = 1;
    return { correctAnswer };
  }

  @Delete('delete/test/:id')
  async removeTest(@Param('id') id: number): Promise<void> {
    return this.testsService.removeTest(id);
  }

  @Delete('delete/questions/:id')
  async removeTestQuestion(@Param('id') id: number): Promise<void> {
    return this.testsService.removeTestQuestion(id);
  }

  @UseGuards(AuthGuard)
  @Get('themes')
  @Render('test-themes-list')
  async getThemes(@Req() req: Request): Promise<{
    title: string;
    themes: QuestionTheme[];
    currentUser: object;
  }> {
    const themes = await this.testsService.findAllQuestionThemes();
    return { title: 'Теми тестів', themes: themes, currentUser: req['user'] };
  }

  @UseGuards(AuthGuard)
  @Get('theme/test')
  @Render('theme-test')
  async createThemeTest(
    @Req() req: Request,
    @Query('theme_id') theme_id: number,
    @Query('user_login') user_login: string,
  ): Promise<any> {
    if (!theme_id || !user_login) {
      throw new NotFoundException('Theme ID and User Login are required');
    }
    const createTestDto: CreateTestDto = {
      user_login: user_login,
      test_type: 'theme',
      theme_id: theme_id,
    @Query('test_id') test_id: number,
    @Query('question_index') question_index: number = 0,
    @Query('user_login') user_login: string = 'pesyk',
  ): Promise<{
    incorrectAnswers: number;
    currentQuestionIndex: number;
    answeredQuestions: number;
    test: Test;
    currentQuestion: TestQuestion;
    correctAnswers: number;
    theme_id: number;
    theme_name: string;
      title: string;
      currentUser: object;
  }> {
    let test: Test;
    if (!test_id) {
      const createTestDto: CreateTestDto = {
        user_login: user_login,
        test_type: 'theme',
        theme_id: theme_id,

      };
      test = await this.testsService.createTest(createTestDto);
    } else {
      test = await this.testsService.findOneTest(test_id);
    }

    if (question_index < 0) question_index = 0;
    if (question_index >= test.items.length)
      question_index = test.items.length - 1;

    const currentQuestion = test.items[question_index];

    const correctAnswers = test.items.filter(
      (item) => item.user_answer === item.question.q_correct_answer,
    ).length;
    const incorrectAnswers = test.items.filter(
      (item) =>
        item.user_answer !== null &&
        item.user_answer !== item.question.q_correct_answer,
    ).length;
    const answeredQuestions = test.items.filter(
      (item) => item.user_answer !== null,
    ).length;

    const theme_name = await this.testsService.findQuestionThemeById(theme_id);

    return {
      test,
      currentQuestion,
      currentQuestionIndex: question_index,
      theme_name: theme_name.theme_chapter,
      correctAnswers,
      incorrectAnswers,
      answeredQuestions,
      theme_id,
      title: 'Тести за темами',
      currentUser: req['user'],
    };
    const test = await this.testsService.createTest(createTestDto);
    return { test };
  }

  @UseGuards(AuthGuard)
  @Get('exam')
  @Render('exam-test')
  async createExamTest(
    @Req() req: Request,
    @Query('user_login') user_login: string,
  ): Promise<any> {
    if (!user_login) {
      throw new NotFoundException('User Login is required');
    }
    let test: Test;
    if (!test_id) {
      const createTestDto: CreateTestDto = {
        user_login: user_login,
        test_type: 'exam',
      };
      test = await this.testsService.createTest(createTestDto);
    } else {
      test = await this.testsService.findOneTest(test_id);
    }

    if (question_index < 0) question_index = 0;
    if (question_index >= test.items.length)
      question_index = test.items.length - 1;

    const currentQuestion = test.items[question_index];

    const correctAnswers = test.items.filter(
      (item) => item.user_answer === item.question.q_correct_answer,
    ).length;
    const incorrectAnswers = test.items.filter(
      (item) =>
        item.user_answer !== null &&
        item.user_answer !== item.question.q_correct_answer,
    ).length;
    const answeredQuestions = test.items.filter(
      (item) => item.user_answer !== null,
    ).length;

    const current_theme = await this.testsService.findQuestionThemeById(
      currentQuestion.question.theme_id,
    );

    return {
      test,
      currentQuestion,
      currentQuestionIndex: question_index,
      current_theme: current_theme.theme_chapter,
      correctAnswers,
      incorrectAnswers,
      answeredQuestions,
    };
    const test = await this.testsService.createTest(createTestDto);
    return {
      test: test,
      title: 'Екзамен з ПДР',
      currentUser: req['user'],
    };
  }

  @Get('comments/:id')
  async getCommentById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Comments> {
    return this.testsService.findCommentById(id);
  }

  @UseGuards(AuthGuard)
  @Get()
  @Render('tests')
  renderTests(@Req() req: Request) {
    return {
      title: 'Тести з ПДР',
      currentUser: req['user'],
    };
  }
}
