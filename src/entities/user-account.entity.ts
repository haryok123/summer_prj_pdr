import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class UserAccount {
  @PrimaryColumn({ length: 50 })
  user_login: string;

  @Column({ length: 50 })
  user_email: string;

  @Column({ length: 50 })
  user_password: string;

  @Column('mediumblob', { nullable: true })
  user_photo: Buffer;
}
