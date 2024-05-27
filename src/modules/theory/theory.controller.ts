import { Controller, Get, Render } from '@nestjs/common';
import { TheoryService } from './theory.service';

@Controller()
export class TheoryController {
  constructor(private theoryService: TheoryService) {}
}
