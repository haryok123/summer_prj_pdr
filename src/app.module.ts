import { Module } from '@nestjs/common';
import { MainController } from './modules/main/main.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from './entities/chapter.entity';
import { Question } from './entities/question.entity';
import { QuestionTheme } from './entities/question-theme.entity';
import { Subchapter } from './entities/subchapter.entity';
import { TheoryItem } from './entities/theory-item.entity';
import { TheoryItemType } from './entities/theory-item-type.entity';
import { UserAccount } from './entities/user.entity';
import { MainService } from './modules/main/main.service';

// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_PORT:', process.env.DB_PORT);
// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
// console.log('DB_NAME:', process.env.DB_NAME);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql-pdr-denis29shw-4aa7.h.aivencloud.com',
      port: 17597, //parseInt(process.env.DB_PORT),
      username: 'avnadmin', //process.env.DB_USER,
      password: 'AVNS_6gaMsnsMRw1q7WVrMfi', //process.env.DB_PASSWORD,
      database: 'pdr', //process.env.DB_NAME,
      entities: [
        Chapter,
        Question,
        QuestionTheme,
        Subchapter,
        TheoryItem,
        TheoryItemType,
        UserAccount,
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
    ]),
  ],
  controllers: [MainController],
  providers: [MainService],
  exports: [MainService],
})
export class AppModule {}
