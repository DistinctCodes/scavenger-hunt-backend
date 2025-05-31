import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { GameCategory } from './game-category.entity';
import { Puzzle } from '../../puzzle/entities/puzzle.entity';

export enum GameDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'cover_image', nullable: true })
  coverImage: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @Column({
    type: 'enum',
    enum: GameDifficulty,
    default: GameDifficulty.INTERMEDIATE,
  })
  difficulty: GameDifficulty;

  @Column({ name: 'estimated_completion_time', nullable: true })
  estimatedCompletionTime: number;

  @Column({ name: 'total_puzzles', default: 0 })
  totalPuzzles: number;

  @Column({ name: 'total_points', default: 0 })
  totalPoints: number;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @Column({ default: 'pending' })
  status: string;

  @Column({ default: 1 })
  currentLevel: number;

  @Column({ default: 0 })
  score: number;

  @Column('jsonb', { default: [] })
  completedPuzzles: string[];

  @ManyToMany(() => GameCategory)
  @JoinTable({
    name: 'game_categories_mapping',
    joinColumn: { name: 'game_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: GameCategory[];

  @OneToMany(() => Puzzle, (puzzle) => puzzle.game)
  puzzles: Puzzle[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
