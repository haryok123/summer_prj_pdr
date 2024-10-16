import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Chapter } from './chapter.entity';

@Entity('subchapter')
export class Subchapter {
  @PrimaryColumn()
  chapter_num: number;

  @PrimaryColumn()
  subchapter_num: number;

  @Column('text')
  subchapter_content: string;

  @Column({ length: 150, nullable: true })
  subchapter_video_link: string;

  @ManyToOne(() => Chapter, (chapter) => chapter.subchapters)
  @JoinColumn({ name: 'chapter_num', referencedColumnName: 'chapter_num' })
  chapter: Chapter;
}
