import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from '../../entities/user-account.entity';
import { MainController } from './main.controller';
import { MainService } from './main.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccount])],
  providers: [MainService],
  controllers: [MainController],
  exports: [],
})
export class MainModule {}
