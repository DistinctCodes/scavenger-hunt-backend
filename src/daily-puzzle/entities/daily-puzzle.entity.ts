import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { Game } from '../../games/entities/game.entity';

@Entity('daily_puzzles')
@Unique(['date'])
export class DailyPuzzle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', unique: true })
  date: string; // YYYY-MM-DD

  @ManyToOne(() => Game, { eager: true, nullable: false })
  game: Game;
}
