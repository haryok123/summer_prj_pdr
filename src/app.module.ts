import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from './entities/chapter.entity';
import { Question } from './entities/question.entity';
import { QuestionTheme } from './entities/question-theme.entity';
import { Subchapter } from './entities/subchapter.entity';
import { TheoryItem } from './entities/theory-item.entity';
import { TheoryItemType } from './entities/theory-item-type.entity';
import { UserAccount } from './entities/user-account.entity';
import { TestQuestion } from './entities/test-question.entity';
import { Test } from './entities/test.entity';
import { Comments } from './entities/comments.entity';
import { MainModule } from './modules/main/main.module';
import { TestsModule } from './modules/tests/tests.module';
import { AuthModule } from './modules/auth/auth.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { ProfileModule } from './modules/profile/profile.module';
import { TheoryModule } from './modules/theory/theory.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exceptions-filter';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql-pdr-denis29shw-4aa7.h.aivencloud.com',
      port: 17597,
      username: 'avnadmin',
      password: 'AVNS_6gaMsnsMRw1q7WVrMfi',
      database: 'pdr',
      entities: [
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
      ],
    }),
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
    JwtModule.register({
      global: true,
      secret: 'qwerty123123',
      signOptions: { expiresIn: '240m' },
    }),
    MainModule,
    AuthModule,
    TestsModule,
    StatisticsModule,
    ProfileModule,
    TheoryModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  exports: [],
})
export class AppModule {}
