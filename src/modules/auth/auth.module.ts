import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from '../../entities/chapter.entity';
import { Question } from '../../entities/question.entity';
import { QuestionTheme } from '../../entities/question-theme.entity';
import { Subchapter } from '../../entities/subchapter.entity';
import { TheoryItem } from '../../entities/theory-item.entity';
import { TheoryItemType } from '../../entities/theory-item-type.entity';
import { UserAccount } from '../../entities/user-account.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

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
    JwtModule.register({
      global: true,
      secret: "test",
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
