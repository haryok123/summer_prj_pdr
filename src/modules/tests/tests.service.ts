import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { QuestionTheme } from '../../entities/question-theme.entity';
import { Question } from '../../entities/question.entity';
import { Comments } from '../../entities/comments.entity';
import { Test } from '../../entities/test.entity';
import { TestQuestion } from '../../entities/test-question.entity';
import { UpdateTestQuestionDto } from '../../dto/update-test-question.dto';
import { CreateTestQuestionDto } from '../../dto/create-test-question.dto';
import { CreateTestDto } from '../../dto/create-test.dto';
import { UserAccount } from '../../entities/user-account.entity';
import { UpdateTestDto } from '../../dto/update-test.dto';
import { TestsStorage } from '../../services/tests-storage.service';

@Injectable()
export class TestsService {
  private cache = new Map<string, { data: any; expiry: number }>();

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
    private readonly storage: TestsStorage,
  ) {
    this.uploadStorage();
  }

  async uploadStorage(): Promise<void> {
    const themes = await this.findAllQuestionThemes();
    this.storage.questionThemes = themes;
    this.storage.questions = themes.flatMap((theme) => theme.questions);
  }

  async findAllQuestionThemes(): Promise<QuestionTheme[]> {
    if (this.storage.questionThemes.length === 0) {
      return await this.questionThemeRepository.find({
        relations: ['questions'],
      });
    }
    return this.storage.questionThemes;
  }

  async findQuestionThemeById(id: number): Promise<QuestionTheme> {
    return this.storage.questionThemes.find((theme) => theme.theme_id == id);
  }

  async findQuestionById(themeId: number, qId: number): Promise<Question> {
    return this.questionRepository.findOne({
      where: { theme_id: themeId, q_id: qId },
    });
  }

  async findTestQuestionById(id: number): Promise<TestQuestion> {
    return this.testQuestionRepository.findOne({
      where: { test_question_id: id },
      relations: ['question'],
    });
  }

  private getFromCache(key: string) {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any, ttl: number = 60000) {
    // default TTL: 60 seconds
    this.cache.set(key, { data, expiry: Date.now() + ttl });
  }

  async findAllTestsByUser(
    userLogin: string,
    testType: 'theme' | 'exam' = null,
  ): Promise<Test[]> {
    const cacheKey = `tests-${userLogin}-${testType}`;
    const cachedData = this.getFromCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    const whereCondition = testType
      ? { user: { user_login: userLogin }, test_type: testType }
      : { user: { user_login: userLogin } };

    const data = await this.testRepository.find({
      where: whereCondition,
      relations: ['items', 'items.question', 'items.question.theme'],
    });
    this.setCache(cacheKey, data);
    return data;
  }

  async findAllQuestions(): Promise<Question[]> {
    return this.storage.questions;
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
    const promises = questions.map(async (question) => {
      const createTestQuestionDto: CreateTestQuestionDto = {
        test_id: test.test_id,
        q_id: question.q_id,
        theme_id: theme_id,
      };
      await this.createTestQuestion(createTestQuestionDto, test, question);
    });
    await Promise.all(promises);
  }

  private async generateExamTestQuestions(test: Test): Promise<void> {
    const questions = await this.questionRepository
      .createQueryBuilder('q')
      .where('q.theme_id < 40')
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

  async findTestsByUserWithPagination(
    userLogin: string,
    page: number,
    limit: number,
  ): Promise<[Test[], number]> {
    const [tests, totalTests] = await this.testRepository.findAndCount({
      where: { user: { user_login: userLogin } },
      relations: ['items', 'items.question', 'items.question.theme'],
      order: { test_date: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return [tests, totalTests];
  }

  async findAllTests(): Promise<Test[]> {
    return this.testRepository.find({ relations: ['items', 'items.question'] });
  }

  async findOneTest(id: number): Promise<Test> {
    return this.testRepository.findOne({
      where: { test_id: id },
      relations: ['items', 'items.question'],
    });
  }

  async updateTest(
    id: number,
    updateTestDto: UpdateTestDto,
  ): Promise<UpdateResult> {
    return this.testRepository.update(id, updateTestDto);
  }

  async updateTestQuestion(
    id: number,
    updateTestQuestionDto: UpdateTestQuestionDto,
  ): Promise<UpdateResult> {
    return this.testQuestionRepository.update(id, updateTestQuestionDto);
  }

  async deleteTest(test_id: number): Promise<void> {
    await this.testRepository.delete(test_id);
  }

  async removeTestQuestion(id: number): Promise<void> {
    await this.testQuestionRepository.delete(id);
  }
}
