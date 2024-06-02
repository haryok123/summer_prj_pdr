import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

@Controller('statistics')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}
  @UseGuards(AuthGuard)
  @Get('champions-list')
  @Render('champions-list')
  renderChampions(@Req() req: Request) {
    return {
      title: 'Список Чемпіонів',
      currentUser: req['user'],
    };
  }
}
