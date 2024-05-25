import { Controller } from '@nestjs/common';
import { MainService } from './main.service';

@Controller('main')
export class MainController {
  constructor(private mainService: MainService) {}
}
