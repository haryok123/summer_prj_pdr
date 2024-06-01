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

  @Patch('update/questions/:id')
  async updateTestQuestion(
    @Param('id') id: number,
    @Body() updateTestQuestionDto: UpdateTestQuestionDto,
  ): Promise<TestQuestion> {
    console.log(updateTestQuestionDto);
    return this.testsService.updateTestQuestion(id, updateTestQuestionDto);
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
    };
    const test = await this.testsService.createTest(createTestDto);
    return {
      test: test,
      title: 'Тести за темами',
      currentUser: req['user'],
    };
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
    const createTestDto: CreateTestDto = {
      user_login,
      test_type: 'exam',
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
