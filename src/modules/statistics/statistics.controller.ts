import { Controller, Get, Render } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller()
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}
}
