import { Injectable } from '@nestjs/common';
import { TheoryItem } from '../entities/theory-item.entity';
import { Chapter } from '../entities/chapter.entity';
import { TheoryItemType } from '../entities/theory-item-type.entity';

@Injectable()
export class DataStorage {
  private _signTypes: TheoryItemType[] = [];
  private _markingTypes: TheoryItemType[] = [];
  private _signs: TheoryItem[] = [];
  private _markings: TheoryItem[] = [];
  private _chapters: Chapter[] = [];

  get signs(): TheoryItem[] {
    return this._signs;
  }

  set signs(value: TheoryItem[]) {
    this._signs = value;
  }

  get markings(): TheoryItem[] {
    return this._markings;
  }

  set markings(value: TheoryItem[]) {
    this._markings = value;
  }

  get chapters(): Chapter[] {
    return this._chapters;
  }

  set chapters(value: Chapter[]) {
    this._chapters = value;
  }

  get signTypes(): TheoryItemType[] {
    return this._signTypes;
  }

  set signTypes(value: TheoryItemType[]) {
    this._signTypes = value;
  }

  get markingTypes(): TheoryItemType[] {
    return this._markingTypes;
  }

  set markingTypes(value: TheoryItemType[]) {
    this._markingTypes = value;
  }
}
