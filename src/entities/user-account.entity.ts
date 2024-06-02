import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Expose } from 'class-transformer';

@Entity('user_account')
export class UserAccount {
  @PrimaryColumn({ length: 50 })
  user_login: string;

  @Column({ length: 50 })
  user_email: string;

  @Column({ length: 50 })
  user_password: string;

  @Column('int')
  user_photo: number;

  @Expose()
  get avatar(): string {
    return `/images/avatar${this.user_photo}.gif`;
  }
}
