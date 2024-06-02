import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from '../../entities/user-account.entity';
import { UpdateProfileImgNumberDto } from '../../dto/update-profile-img-number-dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
  ) {}

  async updateProfileImgNumber(dto: UpdateProfileImgNumberDto): Promise<void> {
    const { userLogin, photoNumber } = dto;
    await this.userAccountRepository.update(userLogin, {
      user_photo: photoNumber,
    });
  }
}
