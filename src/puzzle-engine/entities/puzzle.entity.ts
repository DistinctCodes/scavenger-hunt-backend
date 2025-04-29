import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm"
import { Game } from "../../games/entities/game.entity"
import { UserPuzzleProgress } from "./user-puzzle-progress.entity"

export enum PuzzleType {
  TEXT = "text",
  CODE = "code",
  IMAGE = "image",
  RIDDLE = "riddle",
  BLOCKCHAIN = "blockchain",
  CRYPTOGRAPHY = "cryptography",
  INTERACTIVE = "interactive",
}

export enum PuzzleDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
  EXPERT = "expert",
}

@Entity("puzzles")
export class Puzzle {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 255 })
  title: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ name: "game_id" })
  gameId: number

  @ManyToOne(
    () => Game,
    (game) => game.puzzles,
  )
  @JoinColumn({ name: "game_id" })
  game: Game

  @Column({
    type: "enum",
    enum: PuzzleType,
    default: PuzzleType.TEXT,
  })
  type: PuzzleType

  @Column({
    type: "enum",
    enum: PuzzleDifficulty,
    default: PuzzleDifficulty.MEDIUM,
  })
  difficulty: PuzzleDifficulty

  @Column({ type: "jsonb" })
  content: Record<string, any>

  @Column({ type: "jsonb" })
  solution: Record<string, any>

  @Column({ type: "text", array: true, default: [] })
  hints: string[]

  @Column({ default: 10 })
  points: number

  @Column({ name: "order_index", default: 0 })
  orderIndex: number

  @OneToMany(
    () => UserPuzzleProgress,
    (progress) => progress.puzzle,
  )
  userProgress: UserPuzzleProgress[]

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}
