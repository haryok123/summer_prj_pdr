import { Module } from '@nestjs/common';
import { MainController } from './modules/main/main.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from './entities/chapter.entity';
import { Question } from './entities/question.entity';
import { QuestionTheme } from './entities/question-theme.entity';
import { Subchapter } from './entities/subchapter.entity';
import { TheoryItem } from './entities/theory-item.entity';
import { TheoryItemType } from './entities/theory-item-type.entity';
import { User } from './entities/user.entity';
import { MainService } from './modules/main/main.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        Chapter,
        Question,
        QuestionTheme,
        Subchapter,
        TheoryItem,
        TheoryItemType,
        User,
      ],
    }),
  ],
  controllers: [MainController],
  providers: [MainService],
  exports: [MainService],
})
export class AppModule {}
