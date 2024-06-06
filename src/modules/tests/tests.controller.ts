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
import { Comments } from '../../entities/comments.entity';
import { CreateTestDto } from '../../dto/create-test.dto';
import { Test } from '../../entities/test.entity';
import { UpdateTestQuestionDto } from '../../dto/update-test-question.dto';
import { UpdateTestDto } from '../../dto/update-test.dto';

import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { UserAccount } from '../../entities/user-account.entity';

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

  @Post('finish/:id')
  async finishTest(@Param('id') test_id: number): Promise<{
    incorrectAnswers: number;
    answeredQuestions: number;
    unansweredQuestions: number;
    correctAnswers: number;
  }> {
    const test = await this.testsService.findOneTest(test_id);
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    const dto: UpdateTestDto = {
      is_done: true,
    };
    await this.testsService.updateTest(test.test_id, dto);

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

    const unansweredQuestions = test.items.filter(
      (item) => item.user_answer === null,
    ).length;

    return {
      correctAnswers,
      incorrectAnswers,
      answeredQuestions,
      unansweredQuestions,
    };
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
    const correctAnswer = testQuestion.question.q_correct_answer;
    const dto: UpdateTestQuestionDto = {
      user_answer: user_answer,
    };
    await this.testsService.updateTestQuestion(test_question_id, dto);

    return { correctAnswer };
  }

  @Delete('delete/:id')
  async deleteTest(@Param('id') test_id: number): Promise<void> {
    await this.testsService.deleteTest(test_id);
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
    overallProgress: number;
  }> {
    const themes = await this.testsService.findAllQuestionThemes();
    const user: UserAccount = req['user'];

    const tests = await this.testsService.findAllTestsByUser(
      user.user_login,
      'theme',
    );

    const themeResults = themes.map((theme) => {
      const themeTests = tests.filter(
        (test) => test.theme.theme_id === theme.theme_id,
      );
      const bestResult = themeTests.reduce((best, test) => {
        return test.percentage > best ? test.percentage : best;
      }, 0);
      const questionCount = theme.questionCount;

      return { ...theme, bestResult: bestResult, questionCount };
    });

    const overallProgress = Math.round(
      themeResults.reduce((sum, theme) => sum + theme.bestResult, 0) /
        themes.length,
    );

    return {
      title: 'Теми тестів',
      themes: themeResults,
      currentUser: user,
      overallProgress,
    };
  }

  @UseGuards(AuthGuard)
  @Get('themes/test')
  @Render('theme-test')
  async createThemeTest(
    @Req() req: Request,
    @Query('test_id') test_id: number,
    @Query('theme_id') theme_id: number,
    @Query('question_index') question_index: number = 0,
  ): Promise<any> {
    const user: UserAccount = req['user'];

    if (!theme_id || !user) {
      throw new NotFoundException('Theme ID and User Login are required');
    }
    let test: Test;
    if (!test_id) {
      const createTestDto: CreateTestDto = {
        user_login: user.user_login,
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

    const currentQuestion = test.questions[question_index];

    const theme = await this.testsService.findQuestionThemeById(theme_id);

    return {
      test,
      currentQuestion,
      currentQuestionIndex: question_index,
      theme_name: theme.theme_chapter,
      theme_id,
      title: 'Тести з ' + theme.theme_chapter,
      currentUser: user,
      script: 'theme-test',
    };
  }

  @UseGuards(AuthGuard)
  @Get('exam')
  @Render('exam-test')
  async createExamTest(
    @Req() req: Request,
    @Query('test_id') test_id: number,
    @Query('question_index') question_index: number = 0,
  ): Promise<any> {
    const user: UserAccount = req['user'];

    if (!user) {
      throw new NotFoundException('User access exception.');
    }

    let test: Test;
    if (!test_id) {
      const createTestDto: CreateTestDto = {
        user_login: user.user_login,
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

    const current_theme = await this.testsService.findQuestionThemeById(
      currentQuestion.question.theme_id,
    );

    return {
      test: test,
      currentQuestion,
      currentQuestionIndex: question_index,
      current_theme: current_theme.theme_chapter,
      title: 'Екзамен з ПДР',
      currentUser: user,
    };
  }

  @UseGuards(AuthGuard)
  @Get('history')
  @Render('test-history')
  async getTestHistory(
    @Req() req: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<any> {
    const user: UserAccount = req['user'];
    const [tests, totalTests] =
      await this.testsService.findTestsByUserWithPagination(
        user.user_login,
        page,
        limit,
      );

    const totalPages = Math.ceil(totalTests / limit);

    return {
      title: 'Історія тестів',
      tests,
      currentUser: user,
      totalPages,
      currentPage: page,
    };
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
