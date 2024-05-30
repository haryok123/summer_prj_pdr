import { Injectable } from '@nestjs/common';
import { TheoryItem } from '../entities/theory-item.entity';
import { Chapter } from '../entities/chapter.entity';

@Injectable()
export class DataStorage {
  private signs: TheoryItem[] = [];
  private markings: TheoryItem[] = [];
  private chapters: Chapter[] = [];

  setSigns(signs: TheoryItem[]) {
    this.signs = signs;
  }

  setMarkings(markings: TheoryItem[]) {
    this.markings = markings;
  }

  setChapters(chapters: Chapter[]) {
    this.chapters = chapters;
  }

  getSigns(): TheoryItem[] {
    return this.signs;
  }

  getMarkings(): TheoryItem[] {
    return this.markings;
  }

  getChapters(): Chapter[] {
    return this.chapters;
  }
}
