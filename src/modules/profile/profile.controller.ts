import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateProfileImgNumberDto } from '../../dto/update-profile-img-number-dto';
import axios from 'axios';

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

  @UseGuards(AuthGuard)
  @Get('statistics')
  async fetchStatistics(@Req() req: Request) {
    try {
      const statistics = await axios.get(
        `http://localhost:19429/statistics/user/${req['user'].user_login}`,
      );
      return statistics.data;
    } catch (error) {
      console.error('Error fetching statistics', error);
      throw new Error('Error fetching statistics');
    }
  }

  @Post('updateProfileImgNumber')
  updateProfileImgNumber(@Body() updateImgDto: UpdateProfileImgNumberDto) {
    this.profileService.updateProfileImgNumber(updateImgDto);
  }
}
