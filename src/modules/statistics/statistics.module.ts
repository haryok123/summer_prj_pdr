import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../../entities/question.entity';
import { QuestionTheme } from '../../entities/question-theme.entity';
import { UserAccount } from '../../entities/user-account.entity';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TestsService } from '../tests/tests.service';
import { TestsStorage } from '../../services/tests-storage.service';
import { TestQuestion } from '../../entities/test-question.entity';
import { Test } from '../../entities/test.entity';
import { Comments } from '../../entities/comments.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Test,
      TestQuestion,
      QuestionTheme,
      Question,
      UserAccount,
      Comments,
    ]),
  ],
  providers: [StatisticsService, TestsService, TestsStorage],
  controllers: [StatisticsController],
  exports: [],
})
export class StatisticsModule {}
