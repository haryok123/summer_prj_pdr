import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from '../../entities/chapter.entity';
import { Question } from '../../entities/question.entity';
import { QuestionTheme } from '../../entities/question-theme.entity';
import { Subchapter } from '../../entities/subchapter.entity';
import { TheoryItem } from '../../entities/theory-item.entity';
import { TheoryItemType } from '../../entities/theory-item-type.entity';
import { UserAccount } from '../../entities/user-account.entity';
import { TheoryService } from './theory.service';
import { TheoryController } from './theory.controller';
import { DataStorage } from '../data-storage.service';

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
    ]),
  ],
  providers: [TheoryService, DataStorage],
  controllers: [TheoryController],
  exports: [TheoryService],
})
export class TheoryModule {}
