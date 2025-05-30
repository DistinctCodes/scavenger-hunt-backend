

@Entity()

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Game } from '../../games/entities/game.entity';

@Entity('puzzles')
export class Puzzle {
  @PrimaryGeneratedColumn()
  id: number;


  @Column({ length: 255 })
  name: string;

  @ManyToOne(() => Game, (game) => game.puzzles)
  game: Game;

  @Column({ name: 'gameId', nullable: false })
  gameId: number;
}
