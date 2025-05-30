// src/puzzle-feedback/entities/puzzle-rating.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/users.entity';

@Entity()
export class PuzzleRating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', width: 1 })
  rating: number; 

  @Column({ type: 'text', nullable: true })
  feedback?: string;

  @Column()
  puzzleId: number;  

  @ManyToOne(() => User, { eager: true })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
