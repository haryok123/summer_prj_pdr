import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Subchapter } from './subchapter.entity';

@Entity('chapter')
export class Chapter {
  @PrimaryColumn()
  chapter_num: number;

  @Column({ length: 100 })
  chapter_name: string;

  @OneToMany(() => Subchapter, (subchapter) => subchapter.chapter)
  subchapters: Subchapter[];
}
