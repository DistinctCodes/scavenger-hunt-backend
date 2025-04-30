import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Puzzle } from './puzzle.entity';

@Entity('user_puzzle_progress')
@Unique(['userId', 'puzzleId'])
export class UserPuzzleProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'puzzle_id' })
  puzzleId: number;

  @ManyToOne(() => Puzzle, (puzzle) => puzzle.userProgress)
  @JoinColumn({ name: 'puzzle_id' })
  puzzle: Puzzle;

  @Column({ default: 0 })
  attempts: number;

  @Column({ default: false })
  completed: boolean;

  @Column({
    name: 'completed_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  completedAt: Date;

  @Column({ name: 'points_earned', default: 0 })
  pointsEarned: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
