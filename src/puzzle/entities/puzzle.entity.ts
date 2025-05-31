import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Game } from '../../games/entities/game.entity';

export enum PuzzleDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
}

@Entity('puzzles')
export class Puzzle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: PuzzleDifficulty,
    default: PuzzleDifficulty.EASY,
  })
  difficulty: PuzzleDifficulty;

  @Column('jsonb', { nullable: true })
  solution: any;

  @Column('jsonb', { nullable: true })
  hints: string[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'game_id', nullable: true })
  gameId: string;

  @ManyToOne(() => Game, (game) => game.puzzles)
  game: Game;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
