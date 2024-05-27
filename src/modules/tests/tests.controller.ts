import { Controller, Get, Render } from '@nestjs/common';
import { TestsService } from './tests.service';

@Controller('tests')
export class TestsController {
  @Get()
  @Render('tests')
  getTests() {
    return { title: 'Тести з ПДР' };
  }
}
