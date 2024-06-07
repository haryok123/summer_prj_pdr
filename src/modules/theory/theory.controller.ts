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
import { AuthGuard } from '../auth/auth.guard';

@Controller('theory')
export class TheoryController {
  constructor(private readonly theoryService: TheoryService) {}

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
    const chapters = await this.theoryService.findAllChapters();
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

    const signs = await this.theoryService.findAllSigns();
    const markings = await this.theoryService.findAllMarkings();

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
    const types = await this.theoryService.findAllSignTypes();
    return {
      types,
      title: 'Дорожні знаки',
      currentUser: req['user'],
    };
  }

  @UseGuards(AuthGuard)
  @Get('road-markings')
  @Render('theory-items')
  async getRoadMarkingsPage(@Req() req: Request) {
    const types = await this.theoryService.findAllMarkingTypes();
    return { types, title: 'Дорожня розмітка', currentUser: req['user'] };
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

  @UseGuards(AuthGuard)
  @Get('traffic-lights')
  @Render('theory-dynamic-page')
  async getTrafficLights(@Req() req: Request) {
    return {
      title: 'Світлофор',
      contentType: 'trafficLightsContent.hbs',
      currentUser: req['user'],
    };
  }

  @UseGuards(AuthGuard)
  @Get('regulators')
  @Render('theory-dynamic-page')
  async getRegulatorsContent(@Req() req: Request) {
    return {
      title: 'Регулювальник',
      contentType: 'regulatorsContent',
      currentUser: req['user'],
    };
  }

  @UseGuards(AuthGuard)
  @Get('fines')
  @Render('theory-dynamic-page')
  async getFinesContent(@Req() req: Request) {
    return {
      title: 'Штрафи',
      contentType: 'finesContent',
      currentUser: req['user'],
    };
  }
}