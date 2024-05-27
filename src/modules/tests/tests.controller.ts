import { Controller, Get, Render } from '@nestjs/common';
import { TestsService } from './tests.service';

@Controller()
export class TestsController {
  constructor(private testsService: TestsService) {}
}
