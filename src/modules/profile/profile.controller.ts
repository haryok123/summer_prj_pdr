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
  async profile(@Req() req: Request) {
    async function fetchStatistics(userLogin: string) {
      try {
        const response = await axios.get(
          `http://localhost:19429/statistics/${userLogin}`,
        );
        return response.data;
      } catch (error) {
        console.error('Error fetching statistics', error);
        throw error;
      }
    }

    const statistics = await fetchStatistics(req['user'].user_login);
    const overallProgress = statistics.overallProgress;
    const correctAnswers = statistics.correctAnswers;
    const incorrectAnswers = statistics.incorrectAnswers;
    const totalQuestions = statistics.totalQuestions;
    const averageScore = statistics.averageScore;
    const examsPassed = statistics.examsPassed;
    const examsTotal = statistics.examsTotal;
    return {
      title: 'Профіль користувача',
      currentUser: req['user'],
      script: 'profile',
      overallProgress,
      correctAnswers,
      incorrectAnswers,
      totalQuestions,
      averageScore,
      examsPassed,
      examsTotal,
    };
  }

  @Post('updateProfileImgNumber')
  updateProfileImgNumber(@Body() updateImgDto: UpdateProfileImgNumberDto) {
    console.log(updateImgDto);
    this.profileService.updateProfileImgNumber(updateImgDto);
  }
}
