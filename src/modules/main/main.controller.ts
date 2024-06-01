import { Controller, Get, Render, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { MainService } from './main.service';
import { AuthGuard } from '../auth/auth.guard';
@Controller()
export class MainController {
  constructor(private mainService: MainService) {}

  @Render('home')
  @Get()
  async renderHome(@Req() req: Request) {
    return this.mainService.renderHome(req);
  }
}
