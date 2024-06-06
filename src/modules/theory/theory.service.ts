import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TheoryItemType } from '../../entities/theory-item-type.entity';
import { TheoryItem } from '../../entities/theory-item.entity';
import { Chapter } from '../../entities/chapter.entity';
import { Subchapter } from '../../entities/subchapter.entity';
import { TheoryStorage } from '../../services/theory-storage.service';

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
    private readonly storage: TheoryStorage,
  ) {
    this.uploadStorage();
  }

  async uploadStorage(): Promise<void> {
    const [signs, markings, chapters, signTypes, markingTypes] =
      await Promise.all([
        this.findAllSigns(),
        this.findAllMarkings(),
        this.findAllChapters(),
        this.findAllSignTypes(),
        this.findAllMarkingTypes(),
      ]);

    this.storage.signs = signs;
    this.storage.markings = markings;
    this.storage.chapters = chapters;
    this.storage.signTypes = signTypes;
    this.storage.markingTypes = markingTypes;
  }

  async findAllSignTypes(): Promise<TheoryItemType[]> {
    if (this.storage.signTypes.length === 0) {
      return await this.theoryItemTypeRepository.find({
        where: { theory_type: 'sign' },
        relations: ['items'],
      });
    }
    return this.storage.signTypes;
  }

  async findAllMarkingTypes(): Promise<TheoryItemType[]> {
    if (this.storage.markingTypes.length === 0) {
      return await this.theoryItemTypeRepository.find({
        where: { theory_type: 'marking' },
        relations: ['items'],
      });
    }
    return this.storage.markingTypes;
  }

  async findAllSigns(): Promise<TheoryItem[]> {
    if (this.storage.signs.length === 0) {
      return await this.theoryItemRepository.find({
        where: { theory_type: 'sign' },
      });
    }
    return this.storage.signs;
  }

  async findAllMarkings(): Promise<TheoryItem[]> {
    if (this.storage.markings.length === 0) {
      return await this.theoryItemRepository.find({
        where: { theory_type: 'marking' },
      });
    }
    return this.storage.markings;
  }

  async findAllChapters(): Promise<Chapter[]> {
    if (this.storage.chapters.length === 0)
      return await this.chapterRepository.find({ relations: ['subchapters'] });
    return this.storage.chapters;
  }

  async findOneTheoryItem(
    item_id: string,
    type_id: number,
    theory_type: 'sign' | 'marking',
  ): Promise<TheoryItem> {
    if (
      (theory_type === 'sign' && this.storage.signs.length === 0) ||
      (theory_type === 'marking' && this.storage.markings.length === 0)
    ) {
      return await this.theoryItemRepository.findOne({
        where: { item_id, type_id: type_id, theory_type: theory_type },
      });
    }
    if (theory_type === 'marking') {
      return this.storage.markings.find(
        (marking) => marking.item_id == item_id && marking.type_id == type_id,
      );
    } else if (theory_type === 'sign') {
      return this.storage.signs.find(
        (sign) => sign.item_id == item_id && sign.type_id == type_id,
      );
    }
  }
}
