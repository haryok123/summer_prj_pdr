import { Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chapter } from '../../entities/chapter.entity';

@Injectable()
export class MainService {
  constructor(
    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,
  ) {}

  async findAllChapters(): Promise<Chapter[]> {
    return this.chapterRepository.find();
  }

  renderHome(@Req() req) {
    return {
      style: 'home',
      script: 'home',
      title: 'Головна сторінка',
      //currentUser: req.user,
    };
  }
}
