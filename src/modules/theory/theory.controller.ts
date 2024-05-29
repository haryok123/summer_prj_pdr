import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Render,
} from '@nestjs/common';
import { TheoryService } from './theory.service';
import { TheoryItemType } from '../../entities/theory-item-type.entity';
import { TheoryItem } from '../../entities/theory-item.entity';
import { Chapter } from '../../entities/chapter.entity';
import { Subchapter } from '../../entities/subchapter.entity';

@Controller('theory')
export class TheoryController {
  constructor(private readonly theoryService: TheoryService) {}

  @Get('item-types')
  async findAllTheoryItemTypes(): Promise<TheoryItemType[]> {
    return this.theoryService.findAllTheoryItemTypes();
  }

  @Get('sign-types')
  async findAllSignsTypes(): Promise<TheoryItemType[]> {
    return this.theoryService.findAllSignTypes();
  }

  @Get('marking-types')
  async findAllMarkingTypes(): Promise<TheoryItemType[]> {
    return this.theoryService.findAllMarkingTypes();
  }

  @Get('items')
  async findAllTheoryItems(): Promise<TheoryItem[]> {
    return this.theoryService.findAllTheoryItems();
  }

  @Get('sign')
  async findAllSigns(): Promise<TheoryItem[]> {
    return this.theoryService.findAllSigns();
  }

  @Get('marking')
  async findAllMarkings(): Promise<TheoryItem[]> {
    return this.theoryService.findAllMarkings();
  }

  @Get('chapters')
  async findAllChapters(): Promise<Chapter[]> {
    return this.theoryService.findAllChapters();
  }

  @Get('subchapters')
  async findAllSubchapters(): Promise<Subchapter[]> {
    return this.theoryService.findAllSubchapters();
  }

  @Get(':theory_type(road-signs|road-markings)/:type_id')
  async findOneTheoryItemType(
    @Param('theory_type') theory_type: string,
    @Param('type_id') type_id: number,
  ): Promise<TheoryItemType> {
    const normalizedType = theory_type.replace('road-', '').slice(0, -1);

    if (normalizedType !== 'sign' && normalizedType !== 'marking') {
      throw new NotFoundException(`Theory_${theory_type} not found`);
    }
    return this.theoryService.findOneTheoryItemType(type_id, normalizedType);
  }

  @Get(':theory_type(road-signs|road-markings)/:type_id/:item_id')
  async findOneTheoryItem(
    @Param('theory_type') theory_type: string,
    @Param('type_id') type_id: number,
    @Param('item_id') item_id: string,
  ): Promise<TheoryItem> {
    const normalizedType = theory_type.replace('road-', '').slice(0, -1);

    if (normalizedType !== 'sign' && normalizedType !== 'marking') {
      throw new NotFoundException(`Theory_${theory_type} not found`);
    }
    return this.theoryService.findOneTheoryItem(
      item_id,
      type_id,
      normalizedType,
    );
  }

  @Get('chapters/:chapter_num')
  async findOneChapter(
    @Param('chapter_num') chapter_num: number,
  ): Promise<Chapter> {
    return this.theoryService.findOneChapter(chapter_num);
  }

  @Get('chapters/:chapter_num/:subchapter_num')
  async findOneSubchapter(
    @Param('chapter_num') chapter_num: number,
    @Param('subchapter_num') subchapter_num: number,
  ): Promise<Subchapter> {
    return this.theoryService.findOneSubchapter(chapter_num, subchapter_num);
  }

  @Get()
  @Render('theory')
  getTheory() {
    return { title: 'Вивчення теорії' };
  }

  @Get('rules')
  @Render('chapters-list')
  async getChapters() {
    const chapters = await this.theoryService.findAllChapters();
    return { chapters, title: 'Перелік розділів' };
  }

  @Get('rules/:chapter_num')
  @Render('chapter')
  async getChapter(@Param('chapter_num') chapter_num: number) {
    const chapter = await this.theoryService.findOneChapter(chapter_num);
    const subchapters =
      await this.theoryService.findAllSubchaptersByChapter(chapter_num);

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    const prevChapter = await this.theoryService.findOneChapter(
      +chapter_num - 1,
    );
    const nextChapter = await this.theoryService.findOneChapter(
      +chapter_num + 1,
    );

    return {
      chapter,
      subchapters,
      prevChapter: prevChapter ? prevChapter.chapter_num : null,
      nextChapter: nextChapter ? nextChapter.chapter_num : null,
      title: `Розділ ${chapter_num}: ${chapter.chapter_name}`,
    };
  }
}
