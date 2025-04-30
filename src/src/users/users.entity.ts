import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { UserProfile } from './user-profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: true,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  password: string;

  @OneToOne(() => UserProfile, (profile) => profile.user, {
    cascade: true,
    eager: true,
  })
  profile: UserProfile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  @Column({ unique: true, nullable: true })
  walletAddress: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  loggedInAt: Date;

  roles: any[];

  @Column({
    type: 'varchar',
    length: 96,
    nullable: true,
  })
  resetPasswordCode?: string;

  @Column({nullable: true})
  tokenExpires?: Date

}
