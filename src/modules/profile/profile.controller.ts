import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @UseGuards(AuthGuard)
  @Get()
  @Render('profile')
  profile(@Req() req: Request) {
    return {
      title: 'Профіль користувача',
      currentUser: req['user'],
    };
  }
}
