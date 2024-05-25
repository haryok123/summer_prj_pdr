import { Module } from '@nestjs/common';
import { MainController } from './modules/main/main.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [],
    }),
  ],
  controllers: [MainController],
})
export class AppModule {}
