import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from "typeorm"
import { Game } from "./game.entity"

@Entity("game_categories")
export class GameCategory {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 50, unique: true })
  name: string

  @Column({ length: 50, unique: true })
  slug: string

  @Column({ type: "text", nullable: true })
  description: string

  @ManyToMany(
    () => Game,
    (game) => game.categories,
  )
  games: Game[]

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}
