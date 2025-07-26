import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type ContributionStatus = 'pending' | 'approved' | 'rejected';

@Entity()
export class Contribution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ default: 'pending' })
  status: ContributionStatus;

  @CreateDateColumn()
  submittedAt: Date;

  @Column({ nullable: true })
  submittedBy?: string; // optional contributor info
}

