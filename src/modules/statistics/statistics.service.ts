import { Injectable } from '@nestjs/common';
import { TestsService } from '../tests/tests.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAccount } from '../../entities/user-account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly testsService: TestsService,
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
  ) {}

  async getThemeResults(userLogin: string) {
    const [themes, tests] = await Promise.all([
      this.testsService.findAllQuestionThemes(),
      this.testsService.findAllTestsByUser(userLogin, 'theme'),
    ]);

    return themes.map((theme) => {
      const themeTests = tests.filter(
        (test) => test.theme.theme_id === theme.theme_id,
      );
      const bestResult = themeTests.reduce(
        (best, test) => (test.percentage > best ? test.percentage : best),
        0,
      );

      const questionCount = theme.questionCount;

      return { ...theme, bestResult, questionCount };
    });
  }

  getOverallProgress(themeResults: any = null) {
    return Math.round(
      themeResults.reduce((sum, theme) => sum + theme.bestResult, 0) / 65,
    );
  }

  async getTestStatistics(userLogin: string) {
    const tests = await this.testsService.findAllTestsByUser(userLogin);

    const correctAnswers = tests.reduce(
      (sum, test) => sum + test.correctAnswers,
      0,
    );
    const incorrectAnswers = tests.reduce(
      (sum, test) => sum + test.incorrectAnswers,
      0,
    );
    const exams = tests.filter(
      (test) => test.is_done && test.test_type === 'exam',
    );

    const examsPassed = exams.filter(
      (test) => test.correctAnswers >= 17,
    ).length;
    const examsTotal = exams.length;
    const examCorrectAnswers = exams.reduce(
      (sum, test) => sum + test.correctAnswers,
      0,
    );

    const totalQuestions = correctAnswers + incorrectAnswers;
    const averageScore = Math.round(examCorrectAnswers / (examsTotal || 1));

    return {
      correctAnswers,
      incorrectAnswers,
      totalQuestions,
      averageScore,
      examsPassed,
      examsTotal,
    };
  }

  async calculateStatistics(userLogin: string): Promise<any> {
    const [themeResults, testsStatistics] = await Promise.all([
      this.getThemeResults(userLogin),
      this.getTestStatistics(userLogin),
    ]);

    const overallProgress = this.getOverallProgress(themeResults);
    const {
      correctAnswers,
      incorrectAnswers,
      totalQuestions,
      averageScore,
      examsPassed,
      examsTotal,
    } = testsStatistics;

    return {
      overallProgress,
      correctAnswers,
      incorrectAnswers,
      totalQuestions,
      averageScore,
      examsPassed,
      examsTotal,
    };
  }

  private cache = new Map<string, { data: any; expiry: number }>();

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

  async getStatistics(userLogin: string): Promise<any> {
    const cacheKey = `stats-${userLogin}`;
    const cachedData = this.getFromCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const statistics = await this.calculateStatistics(userLogin);
    this.setCache(cacheKey, statistics, 60000);
    return statistics;
  }

  async getTopUsers(limit: number = 10): Promise<any[]> {
    const allUsers = await this.userAccountRepository.find();
    const userStatisticsPromises = allUsers.map((user) =>
      this.calculateStatistics(user.user_login),
    );

    const allUserStatistics = await Promise.all(userStatisticsPromises);

    return allUserStatistics
      .map((stats, index) => ({
        user: allUsers[index],
        ...stats,
      }))
      .sort(
        (a, b) =>
          b.overallProgress -
          a.overallProgress +
          b.correctAnswers -
          a.correctAnswers +
          b.examsPassed -
          a.examsPassed,
      )
      .slice(0, limit);
  }
}
