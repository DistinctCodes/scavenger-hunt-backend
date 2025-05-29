import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('puzzles')
@Index(['isActive'])
export class Puzzle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('int', { default: 1 })
  difficulty: number;

  @Column('int', { default: 0 })
  points: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('puzzle_dependencies')
@Index(['puzzleId', 'prerequisiteId'], { unique: true })
@Index(['puzzleId'])
@Index(['prerequisiteId'])
export class PuzzleDependency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  puzzleId: number;

  @Column('int')
  prerequisiteId: number;

  @Column({ default: true })
  isRequired: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('user_puzzle_completions')
@Index(['userId', 'puzzleId'], { unique: true })
@Index(['userId'])
@Index(['completedAt'])
export class UserPuzzleCompletion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  userId: number;

  @Column('int')
  puzzleId: number;

  @Column('int', { nullable: true })
  score: number;

  @Column('int', { nullable: true })
  timeSpent: number; // in seconds

  @Column('text', { nullable: true })
  solution: string;

  @CreateDateColumn()
  completedAt: Date;
}