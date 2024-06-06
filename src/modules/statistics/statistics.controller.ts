import { Controller, Get, Param, Render, Req, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

@Controller('statistics')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @Get('user/:userLogin')
  async getStatistics(@Param('userLogin') userLogin: string): Promise<any> {
    return this.statisticsService.getStatistics(userLogin);
  }

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
