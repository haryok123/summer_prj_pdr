import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from '../../entities/user-account.entity';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import { Chapter } from '../../entities/chapter.entity';
import { Question } from '../../entities/question.entity';
import { QuestionTheme } from '../../entities/question-theme.entity';
import { Subchapter } from '../../entities/subchapter.entity';
import { TheoryItem } from '../../entities/theory-item.entity';
import { TheoryItemType } from '../../entities/theory-item-type.entity';
import { Test } from '../../entities/test.entity';
import { TestQuestion } from '../../entities/test-question.entity';
import { Comments } from '../../entities/comments.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Chapter,
      Question,
      QuestionTheme,
      Subchapter,
      TheoryItem,
      TheoryItemType,
      UserAccount,
      Test,
      TestQuestion,
      Comments,
    ]),
  ],
  providers: [MainService],
  controllers: [MainController],
  exports: [],
})
export class MainModule {}
