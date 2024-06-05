import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestsService } from '../tests/tests.service';
import { QuestionTheme } from '../../entities/question-theme.entity';
import { Test } from '../../entities/test.entity';

@Injectable()
export class StatisticsService {
  constructor(private readonly testsService: TestsService) {}

  async getThemeResults(userLogin: string) {
    const themes = await this.testsService.findAllQuestionThemes();
    const tests = await this.testsService.findAllTestsByUser(
      userLogin,
      'theme',
    );
    return themes.map((theme) => {
      const themeTests = tests.filter(
        (test) => test.theme.theme_id === theme.theme_id,
      );
      const bestResult = themeTests.reduce((best, test) => {
        return test.percentage > best ? test.percentage : best;
      }, 0);

      const questionCount = theme.questionCount;

      return { ...theme, bestResult: bestResult, questionCount };
    });
  }

  getOverallProgress(themeResults: any = null) {
    return Math.round(
      themeResults.reduce((sum, theme) => sum + theme.bestResult, 0) / 65,
    );
  }

  async getTestStatistics(userLogin: string) {
    const tests = await this.testsService.findAllTestsByUser(userLogin);
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let examCorrectAnswers = 0;
    const examsPassed = tests.filter(
      (test) =>
        test.is_done && test.test_type === 'exam' && test.correctAnswers >= 17,
    ).length;
    const examsTotal = tests.filter(
      (test) => test.is_done && test.test_type === 'exam',
    ).length;
    tests.forEach((test) => {
      correctAnswers += test.correctAnswers;
      incorrectAnswers += test.incorrectAnswers;
    });
    tests
      .filter((test) => test.is_done && test.test_type === 'exam')
      .forEach((test) => {
        examCorrectAnswers += test.correctAnswers;
      });
    const totalQuestions = correctAnswers + incorrectAnswers;
    const averageScore = Math.round(examCorrectAnswers / examsTotal);
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
    const themeResults = await this.getThemeResults(userLogin);
    const overallProgress = this.getOverallProgress(themeResults);
    const testsStatistics = await this.getTestStatistics(userLogin);
    const correctAnswers = testsStatistics.correctAnswers;
    const incorrectAnswers = testsStatistics.incorrectAnswers;
    const totalQuestions = testsStatistics.totalQuestions;
    const averageScore = testsStatistics.averageScore;
    const examsPassed = testsStatistics.examsPassed;
    const examsTotal = testsStatistics.examsTotal;
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
    this.setCache(cacheKey, statistics);
    return statistics;
  }
}
