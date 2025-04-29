import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm"
import { Puzzle } from "../../puzzle-engine/entities/puzzle.entity"
import { GameCategory } from "./game-category.entity"

export enum GameDifficulty {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  EXPERT = "expert",
}

@Entity("games")
export class Game {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 255 })
  name: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ unique: true })
  slug: string

  @Column({ name: "cover_image", nullable: true })
  coverImage: string

  @Column({ name: "is_active", default: true })
  isActive: boolean

  @Column({ name: "is_featured", default: false })
  isFeatured: boolean

  @Column({
    type: "enum",
    enum: GameDifficulty,
    default: GameDifficulty.INTERMEDIATE,
  })
  difficulty: GameDifficulty

  @Column({ name: "estimated_completion_time", nullable: true })
  estimatedCompletionTime: number // in minutes

  @Column({ name: "total_puzzles", default: 0 })
  totalPuzzles: number

  @Column({ name: "total_points", default: 0 })
  totalPoints: number

  @ManyToMany(() => GameCategory)
  @JoinTable({
    name: "game_categories_mapping",
    joinColumn: { name: "game_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "category_id", referencedColumnName: "id" },
  })
  categories: GameCategory[]

  @OneToMany(
    () => Puzzle,
    (puzzle) => puzzle.game,
  )
  puzzles: Puzzle[]

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}
