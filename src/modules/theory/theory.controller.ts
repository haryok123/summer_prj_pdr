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
import { DataStorage } from '../data-storage.service';
@Controller('theory')
export class TheoryController {
  constructor(
    private readonly theoryService: TheoryService,
    private readonly storage: DataStorage,
  ) {
    this.uploadStorage();
  }

  async uploadStorage(): Promise<void> {
    const signs = await this.theoryService.findAllSigns();
    const markings = await this.theoryService.findAllMarkings();
    const chapters = await this.theoryService.findAllChapters();

    this.storage.setSigns(signs);
    this.storage.setMarkings(markings);
    this.storage.setChapters(chapters);
  }

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

  // @Get(':theory_type(road-signs|road-markings)/:type_id')
  // async findOneTheoryItemType(
  //   @Param('theory_type') theory_type: string,
  //   @Param('type_id') type_id: number,
  // ): Promise<TheoryItemType> {
  //   const normalizedType = theory_type.replace('road-', '').slice(0, -1);
  //
  //   if (normalizedType !== 'sign' && normalizedType !== 'marking') {
  //     throw new NotFoundException(`Theory_${theory_type} not found`);
  //   }
  //   return this.theoryService.findOneTheoryItemType(type_id, normalizedType);
  // }
  //
  // @Get(':theory_type(road-signs|road-markings)/:type_id/:item_id')
  // async findOneTheoryItem(
  //   @Param('theory_type') theory_type: string,
  //   @Param('type_id') type_id: number,
  //   @Param('item_id') item_id: string,
  // ): Promise<TheoryItem> {
  //   const normalizedType = theory_type.replace('road-', '').slice(0, -1);
  //
  //   if (normalizedType !== 'sign' && normalizedType !== 'marking') {
  //     throw new NotFoundException(`Theory_${theory_type} not found`);
  //   }
  //   return this.theoryService.findOneTheoryItem(
  //     item_id,
  //     type_id,
  //     normalizedType,
  //   );
  // }

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
  getChapter(@Param('chapter_num') chapter_num: number) {
    let chapters = this.storage.getChapters();
    if (chapters.length === 0)
      this.uploadStorage().then((r) => (chapters = this.storage.getChapters()));
    const chapter = chapters.find((chap) => +chap.chapter_num === +chapter_num);

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    const subchapters = chapter.subchapters;

    const prevChapter = chapters.find(
      (chap) => chap.chapter_num === chapter.chapter_num - 1,
    );
    const nextChapter = chapters.find(
      (chap) => chap.chapter_num === chapter.chapter_num + 1,
    );

    const signs = this.storage.getSigns();
    const markings = this.storage.getMarkings();

    return {
      chapter,
      subchapters,
      signs,
      markings,
      chapters,
      prevChapter: prevChapter ? prevChapter.chapter_num : null,
      nextChapter: nextChapter ? nextChapter.chapter_num : null,
      title: `Розділ ${chapter_num}: ${chapter.chapter_name}`,
    };
  }

  @Get('road-signs')
  @Render('theory-items')
  async getRoadSignsPage() {
    const types = await this.theoryService.findAllSignTypes();
    return { types, title: 'Дорожні знаки' };
  }

  // Endpoint to render road markings page
  @Get('road-markings')
  @Render('theory-items')
  async getRoadMarkingsPage() {
    const types = await this.theoryService.findAllMarkingTypes();
    return { types, title: 'Дорожня розмітка' };
  }

  // Endpoint to fetch items of a specific type
  @Get('road-signs/:type_id')
  async getSignsByType(@Param('type_id') type_id: number) {
    return await this.theoryService.findAllTheoryItemsByType(type_id, 'sign');
  }

  @Get('road-markings/:type_id')
  async getMarkingsByType(@Param('type_id') type_id: number) {
    return await this.theoryService.findAllTheoryItemsByType(
      type_id,
      'marking',
    );
  }

  @Get('road-signs/:type_id/:item_id')
  @Render('item-detail')
  async getSignDetail(
    @Param('type_id') type_id: number,
    @Param('item_id') item_id: string,
  ) {
    const item = await this.theoryService.findOneTheoryItem(
      item_id,
      type_id,
      'sign',
    );
    return { item, title: item.item_name };
  }

  @Get('road-markings/:type_id/:item_id')
  @Render('item-detail')
  async getMarkingDetail(
    @Param('type_id') type_id: number,
    @Param('item_id') item_id: string,
  ) {
    const item = await this.theoryService.findOneTheoryItem(
      item_id,
      type_id,
      'marking',
    );
    return { item, title: item.item_name };
  }
}
