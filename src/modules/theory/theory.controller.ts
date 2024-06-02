import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TheoryService } from './theory.service';
import { Chapter } from '../../entities/chapter.entity';
import { Subchapter } from '../../entities/subchapter.entity';
import { DataStorage } from '../data-storage.service';
import { AuthGuard } from '../auth/auth.guard';

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
    const signTypes = await this.theoryService.findAllSignTypes();
    const markingTypes = await this.theoryService.findAllMarkingTypes();

    this.storage.signs = signs;
    this.storage.markings = markings;
    this.storage.chapters = chapters;
    this.storage.signTypes = signTypes;
    this.storage.markingTypes = markingTypes;
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

  @UseGuards(AuthGuard)
  @Get()
  @Render('theory')
  getTheory(@Req() req: Request) {
    return {
      title: 'Вивчення теорії',
      currentUser: req['user'],
    };
  }

  @UseGuards(AuthGuard)
  @Get('rules')
  @Render('chapters-list')
  async getChapters(@Req() req: Request) {
    const chapters = await this.theoryService.findAllChapters();
    return { chapters, title: 'Перелік розділів', currentUser: req['user'] };
  }

  @UseGuards(AuthGuard)
  @Get('rules/:chapter_num')
  @Render('chapter')
  async getChapter(
    @Param('chapter_num') chapter_num: number,
    @Req() req: Request,
  ) {
    let chapters = this.storage.chapters;
    if (chapters.length === 0)
      await this.uploadStorage().then(() => (chapters = this.storage.chapters));
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

    const signs = this.storage.signs;
    const markings = this.storage.markings;

    return {
      chapter,
      subchapters,
      signs,
      markings,
      chapters,
      prevChapter: prevChapter ? prevChapter.chapter_num : null,
      nextChapter: nextChapter ? nextChapter.chapter_num : null,
      title: `Розділ ${chapter_num}: ${chapter.chapter_name}`,
      currentUser: req['user'],
    };
  }

  @UseGuards(AuthGuard)
  @Get('road-signs')
  @Render('theory-items')
  async getRoadSignsPage(@Req() req: Request) {
    let types = this.storage.signTypes;
    if (types.length === 0)
      await this.uploadStorage().then(() => (types = this.storage.signTypes));
    return {
      types,
      title: 'Дорожні знаки',
      currentUser: req['user'],
    };
  }

  // Endpoint to render road markings page
  @UseGuards(AuthGuard)
  @Get('road-markings')
  @Render('theory-items')
  async getRoadMarkingsPage(@Req() req: Request) {
    let types = this.storage.markingTypes;
    if (types.length === 0)
      await this.uploadStorage().then(
        () => (types = this.storage.markingTypes),
      );
    return { types, title: 'Дорожня розмітка', currentUser: req['user'] };
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

  @UseGuards(AuthGuard)
  @Get('road-signs/:type_id/:item_id')
  @Render('item-detail')
  async getSignDetail(
    @Req() req: Request,
    @Param('type_id') type_id: number,
    @Param('item_id') item_id: string,
  ) {
    const item = await this.theoryService.findOneTheoryItem(
      item_id,
      type_id,
      'sign',
    );
    return { item, title: item.item_name, currentUser: req['user'] };
  }

  @UseGuards(AuthGuard)
  @Get('road-markings/:type_id/:item_id')
  @Render('item-detail')
  async getMarkingDetail(
    @Req() req: Request,
    @Param('type_id') type_id: number,
    @Param('item_id') item_id: string,
  ): Promise<any> {
    const item = await this.theoryService.findOneTheoryItem(
      item_id,
      type_id,
      'marking',
    );
    return { item, title: item.item_name, currentUser: req['user'] };
  }
}
