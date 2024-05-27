import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TheoryItemType } from './theory-item-type.entity';

@Entity('theory_item')
export class TheoryItem {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  item_id: string;

  @PrimaryColumn()
  type_id: number;

  @PrimaryColumn({ type: 'enum', enum: ['sign', 'marking'] })
  theory_type: 'sign' | 'marking';

  @Column({ type: 'varchar', length: 200 })
  item_name: string;

  @Column('text')
  item_description: string;

  @Column('blob')
  item_image: Buffer;

  @Column('mediumblob', { nullable: true })
  item_example_image: Buffer;

  @ManyToOne(() => TheoryItemType, (type) => type.items)
  @JoinColumn([
    { name: 'type_id', referencedColumnName: 'type_id' },
    { name: 'theory_type', referencedColumnName: 'theory_type' },
  ])
  type: TheoryItemType;
}
