import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { TheoryItem } from './theory-item.entity';

@Entity()
export class TheoryItemType {
  @PrimaryColumn()
  type_id: number;

  @Column({ length: 100 })
  type_name: string;

  @Column('text')
  type_description: string;

  @Column('blob')
  type_image: Buffer;

  @Column({ type: 'enum', enum: ['sign', 'marking'] })
  theory_type: 'sign' | 'marking';

  @OneToMany(() => TheoryItem, (item) => item.type_id)
  items: TheoryItem[];
}
