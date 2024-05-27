import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TheoryItemType } from '../../entities/theory-item-type.entity';
import { TheoryItem } from '../../entities/theory-item.entity';
import { Chapter } from '../../entities/chapter.entity';
import { Subchapter } from '../../entities/subchapter.entity';

@Injectable()
export class TheoryService {
  constructor(
    @InjectRepository(TheoryItemType)
    private readonly theoryItemTypeRepository: Repository<TheoryItemType>,
    @InjectRepository(TheoryItem)
    private readonly theoryItemRepository: Repository<TheoryItem>,
    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,
    @InjectRepository(Subchapter)
    private readonly subchapterRepository: Repository<Subchapter>,
  ) {}
}
