import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chapter } from '../../entities/chapter.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Chapter)
    private readonly profileRepository: Repository<Chapter>,
  ) {}
}
