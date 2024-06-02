import { Body, Controller, Get, Post, Render, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateProfileImgNumberDto } from '../../dto/update-profile-img-number-dto';

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
      script: 'profile',
    };
  }

  @Post('updateProfileImgNumber')
  updateProfileImgNumber(@Body() updateImgDto: UpdateProfileImgNumberDto) {
    console.log(updateImgDto);
    this.profileService.updateProfileImgNumber(updateImgDto);
  }
}
