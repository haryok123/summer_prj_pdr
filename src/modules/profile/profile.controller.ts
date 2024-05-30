import { Controller, Get, Render } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}
  @Get()
  @Render('profile')
  profile() {
    return {
      title: 'Профіль користувача',
    };
  }
}
