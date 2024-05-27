import { Controller, Get, Render } from '@nestjs/common';
import { TheoryService } from './theory.service';

@Controller('theory')
export class TheoryController {
  @Get()
  @Render('theory')
  getTheory() {
    return { title: 'Вивчення теорії' };
  }
}
