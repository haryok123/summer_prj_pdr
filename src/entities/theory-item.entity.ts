import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { TheoryItemType } from './theory-item-type.entity';

@Entity('theory_item')
export class TheoryItem {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  item_id: string;

  @ManyToOne(() => TheoryItemType, (type) => type.items)
  type_id: TheoryItemType;

  @PrimaryColumn({ type: 'varchar', length: 200 })
  item_name: string;

  @Column('text')
  item_description: string;

  @Column('blob')
  item_image: Buffer;

  @Column('mediumblob', { nullable: true })
  item_example_image: Buffer;
}
