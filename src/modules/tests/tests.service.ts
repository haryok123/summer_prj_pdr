import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionTheme } from '../../entities/question-theme.entity';
import { Question } from '../../entities/question.entity';
import { Comments } from '../../entities/comments.entity';
import { Test } from '../../entities/test.entity';
import { TestQuestion } from '../../entities/test-question.entity';
import { UpdateTestQuestionDto } from '../../dto/update-test-question.dto';
import { CreateTestQuestionDto } from '../../dto/create-test-question.dto';
import { CreateTestDto } from '../../dto/create-test.dto';
import { UserAccount } from '../../entities/user-account.entity';

@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(QuestionTheme)
    private readonly questionThemeRepository: Repository<QuestionTheme>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,
    @InjectRepository(TestQuestion)
    private readonly testQuestionRepository: Repository<TestQuestion>,
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
  ) {}

  async findAllQuestionThemes(): Promise<QuestionTheme[]> {
    return this.questionThemeRepository.find();
  }

  async findQuestionThemeById(id: number): Promise<QuestionTheme> {
    return this.questionThemeRepository.findOne({
      where: { theme_id: id },
    });
  }

  async findAllQuestions(): Promise<Question[]> {
    return this.questionRepository.find();
  }

  async findQuestionById(themeId: number, qId: number): Promise<Question> {
    return this.questionRepository.findOne({
      where: { theme_id: themeId, q_id: qId },
    });
  }

  async findAllComments(): Promise<Comments[]> {
    return this.commentsRepository.find();
  }

  async findCommentById(id: number): Promise<Comments> {
    return this.commentsRepository.findOne({
      where: { comment_id: id },
      relations: ['question', 'user', 'parent_comment'],
    });
  }

  async createTest(createTestDto: CreateTestDto): Promise<Test> {
    const user = await this.userAccountRepository.findOne({
      where: { user_login: createTestDto.user_login },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const test = this.testRepository.create({
      ...createTestDto,
      user,
    });
    const savedTest = await this.testRepository.save(test);

    if (createTestDto.test_type === 'theme') {
      await this.generateThemeTestQuestions(savedTest, createTestDto.theme_id);
    } else if (createTestDto.test_type === 'exam') {
      await this.generateExamTestQuestions(savedTest);
    }

    return this.findOneTest(savedTest.test_id);
  }

  private async generateThemeTestQuestions(
    test: Test,
    theme_id: number,
  ): Promise<void> {
    const questions = await this.questionRepository.find({
      where: { theme_id: theme_id },
    });
    for (const question of questions) {
      const createTestQuestionDto: CreateTestQuestionDto = {
        test_id: test.test_id,
        q_id: question.q_id,
        theme_id: theme_id,
      };
      await this.createTestQuestion(createTestQuestionDto, test, question);
    }
  }

  private async generateExamTestQuestions(test: Test): Promise<void> {
    const questions = await this.questionRepository
      .createQueryBuilder()
      .orderBy('RAND()')
      .limit(20)
      .getMany();

    for (const question of questions) {
      const createTestQuestionDto: CreateTestQuestionDto = {
        test_id: test.test_id,
        q_id: question.q_id,
        theme_id: question.theme_id,
      };
      await this.createTestQuestion(createTestQuestionDto, test, question);
    }
  }

  async createTestQuestion(
    createTestQuestionDto: CreateTestQuestionDto,
    test: Test,
    question: Question,
  ): Promise<TestQuestion> {
    const testQuestion = this.testQuestionRepository.create({
      ...createTestQuestionDto,
      test,
      question,
    });
    return this.testQuestionRepository.save(testQuestion);
  }

  async findAllTests(): Promise<Test[]> {
    return this.testRepository.find();
  }

  async findOneTest(id: number): Promise<Test> {
    return this.testRepository.findOne({
      where: { test_id: id },
      relations: ['items', 'items.question'],
    });
  }

  async updateTestQuestion(
    id: number,
    updateTestQuestionDto: UpdateTestQuestionDto,
  ): Promise<TestQuestion> {
    const testQuestion = await this.testQuestionRepository.findOne({
      where: { test_question_id: id },
    });

    if (!testQuestion) {
      throw new NotFoundException('Test question not found');
    }

    testQuestion.user_answer = updateTestQuestionDto.user_answer;
    return this.testQuestionRepository.save(testQuestion);
  }

  async removeTest(id: number): Promise<void> {
    await this.testRepository.delete(id);
  }

  async removeTestQuestion(id: number): Promise<void> {
    await this.testQuestionRepository.delete(id);
  }
}
