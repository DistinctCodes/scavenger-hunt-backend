import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

@Entity()
@Unique(['date'])
export class DailyChallenge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  challengeId: string;

  @CreateDateColumn()
  date: Date;
}

