import { Controller, Get, Render } from '@nestjs/common';
import { MainService } from './main.service';
import { Chapter } from '../../entities/chapter.entity';

@Controller()
export class MainController {
  constructor(private mainService: MainService) {}

  @Render('home')
  @Get()
  async getAllChapters(): Promise<Chapter[]> {
    return this.mainService.findAllChapters();
  }
}
