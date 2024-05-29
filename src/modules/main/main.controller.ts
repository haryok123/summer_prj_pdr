import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { MainService } from './main.service';
import { Chapter } from '../../entities/chapter.entity';
import { AuthGuard } from '../auth/auth.guard';
@Controller()
export class MainController {
  constructor(private mainService: MainService) {}

  @UseGuards(AuthGuard)
  @Render('home')
  @Get()
  async getAllChapters(): Promise<Chapter[]> {
    return this.mainService.findAllChapters();
  }
}
