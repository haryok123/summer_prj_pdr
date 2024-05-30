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

  async findAllTheoryItemTypes(): Promise<TheoryItemType[]> {
    return this.theoryItemTypeRepository.find();
  }

  async findAllSignTypes(): Promise<TheoryItemType[]> {
    return this.theoryItemTypeRepository.find({
      where: { theory_type: 'sign' },
      relations: ['items'],
    });
  }

  async findAllMarkingTypes(): Promise<TheoryItemType[]> {
    return this.theoryItemTypeRepository.find({
      where: { theory_type: 'marking' },
      relations: ['items'],
    });
  }

  async findAllTheoryItems(): Promise<TheoryItem[]> {
    return this.theoryItemRepository.find();
  }

  async findAllSigns(): Promise<TheoryItem[]> {
    return this.theoryItemRepository.find({
      where: { theory_type: 'sign' },
    });
  }

  async findAllMarkings(): Promise<TheoryItem[]> {
    return this.theoryItemRepository.find({
      where: { theory_type: 'marking' },
    });
  }

  async findAllChapters(): Promise<Chapter[]> {
    return this.chapterRepository.find();
  }

  async findAllSubchapters(): Promise<Subchapter[]> {
    return this.subchapterRepository.find();
  }

  async findOneTheoryItemType(
    type_id: number,
    theory_type: 'sign' | 'marking',
  ): Promise<TheoryItemType> {
    console.log(theory_type, theory_type);
    return this.theoryItemTypeRepository.findOne({
      where: { type_id, theory_type },
    });
  }

  async findOneTheoryItem(
    item_id: string,
    type_id: number,
    theory_type: 'sign' | 'marking',
  ): Promise<TheoryItem> {
    return this.theoryItemRepository.findOne({
      where: { item_id, type_id: type_id, theory_type: theory_type },
    });
  }

  async findOneChapter(chapter_num: number): Promise<Chapter> {
    return this.chapterRepository.findOne({ where: { chapter_num } });
  }

  async findOneSubchapter(
    chapter_num: number,
    subchapter_num: number,
  ): Promise<Subchapter> {
    return this.subchapterRepository.findOne({
      where: { chapter_num, subchapter_num },
    });
  }

  async findAllSubchaptersByChapter(chapter_num: number) {
    return this.subchapterRepository.find({
      where: { chapter_num: chapter_num },
    });
  }

  async findAllTheoryItemsByType(
    type_id: number,
    theory_type: 'sign' | 'marking',
  ): Promise<TheoryItem[]> {
    return this.theoryItemRepository.find({
      where: { type_id, theory_type },
    });
  }
}
