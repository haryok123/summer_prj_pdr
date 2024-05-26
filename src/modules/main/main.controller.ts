import { Controller, Get, Render } from '@nestjs/common';
import { MainService } from './main.service';
import { Chapter } from '../../entities/chapter.entity';

@Controller('main')
export class MainController {
  constructor(private mainService: MainService) {}

  @Render('layout')
  @Get('chapters')
  async getAllChapters(): Promise<Chapter[]> {
    return this.mainService.findAllChapters();
  }
}
