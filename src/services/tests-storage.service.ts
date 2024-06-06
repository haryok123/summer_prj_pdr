import { Injectable } from '@nestjs/common';
import { QuestionTheme } from '../entities/question-theme.entity';
import { Question } from '../entities/question.entity';

@Injectable()
export class TestsStorage {
  private _questionThemes: QuestionTheme[] = [];
  private _questions: Question[] = [];

  get questionThemes(): QuestionTheme[] {
    return this._questionThemes;
  }

  set questionThemes(value: QuestionTheme[]) {
    this._questionThemes = value;
  }

  get questions(): Question[] {
    return this._questions;
  }

  set questions(value: Question[]) {
    this._questions = value;
  }
}
