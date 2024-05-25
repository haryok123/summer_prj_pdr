import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({ length: 50 })
  user_login: string;

  @Column({ length: 150 })
  user_password: string;

  @Column('mediumblob', { nullable: true })
  user_photo: Buffer;
}
