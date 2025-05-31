import { Game } from 'src/games/entities/game.entity';
import { User } from 'src/users/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

export enum PuzzleDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
}

export enum PuzzleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Entity()
export class Puzzle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  clues: string;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column({
    type: 'enum',
    enum: PuzzleDifficulty,
    default: PuzzleDifficulty.EASY,
  })
  difficulty: PuzzleDifficulty;

    @Column({
    type: 'enum',
    enum: PuzzleStatus,
    default: PuzzleStatus.DRAFT,
  })
  status: PuzzleStatus;

   @ManyToOne(() => User, user => user.puzzles)
  creator: User;

  @Column('tsvector', { nullable: true })
  searchVector: string;

  @OneToMany(() => Game, (game) => game.puzzles)
  game: Game[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
