import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../../entities/question.entity';
import { QuestionTheme } from '../../entities/question-theme.entity';
import { UserAccount } from '../../entities/user-account.entity';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { TestQuestion } from '../../entities/test-question.entity';
import { Test } from '../../entities/test.entity';
import { Comments } from '../../entities/comments.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Question,
      QuestionTheme,
      UserAccount,
      TestQuestion,
      Test,
      Comments,
    ]),
  ],
  providers: [TestsService],
  controllers: [TestsController],
  exports: [],
})
export class TestsModule {}
