import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreatePuzzleDependencyTables1640000000000 implements MigrationInterface {
  name = 'CreatePuzzleDependencyTables1640000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create puzzles table
    await queryRunner.createTable(
      new Table({
        name: 'puzzles',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'code',
            type: 'varchar',
            length: '100',
            isUnique: true,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'difficulty',
            type: 'int',
            default: 1,
          },
          {
            name: 'points',
            type: 'int',
            default: 0,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create puzzle_dependencies table
    await queryRunner.createTable(
      new Table({
        name: 'puzzle_dependencies',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'puzzleId',
            type: 'int',
          },
          {
            name: 'prerequisiteId',
            type: 'int',
          },
          {
            name: 'isRequired',
            type: 'boolean',
            default: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create user_puzzle_completions table
    await queryRunner.createTable(
      new Table({
        name: 'user_puzzle_completions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'puzzleId',
            type: 'int',
          },
          {
            name: 'score',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'timeSpent',
            type: 'int',
            isNullable: true,
            comment: 'Time spent in seconds',
          },
          {
            name: 'solution',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'completedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create indexes for puzzles table
    await queryRunner.createIndex(
      'puzzles',
      new TableIndex({
        name: 'IDX_puzzles_isActive',
        columnNames: ['isActive'],
      }),
    );

    await queryRunner.createIndex(
      'puzzles',
      new TableIndex({
        name: 'IDX_puzzles_difficulty',
        columnNames: ['difficulty'],
      }),
    );

    // Create indexes for puzzle_dependencies table
    await queryRunner.createIndex(
      'puzzle_dependencies',
      new TableIndex({
        name: 'IDX_puzzle_dependencies_unique',
        columnNames: ['puzzleId', 'prerequisiteId'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'puzzle_dependencies',
      new TableIndex({
        name: 'IDX_puzzle_dependencies_puzzleId',
        columnNames: ['puzzleId'],
      }),
    );

    await queryRunner.createIndex(
      'puzzle_dependencies',
      new TableIndex({
        name: 'IDX_puzzle_dependencies_prerequisiteId',
        columnNames: ['prerequisiteId'],
      }),
    );

    // Create indexes for user_puzzle_completions table
    await queryRunner.createIndex(
      'user_puzzle_completions',
      new TableIndex({
        name: 'IDX_user_puzzle_completions_unique',
        columnNames: ['userId', 'puzzleId'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'user_puzzle_completions',
      new TableIndex({
        name: 'IDX_user_puzzle_completions_userId',
        columnNames: ['userId'],
      }),
    );

    await queryRunner.createIndex(
      'user_puzzle_completions',
      new TableIndex({
        name: 'IDX_user_puzzle_completions_completedAt',
        columnNames: ['completedAt'],
      }),
    );

    // Create foreign key constraints
    await queryRunner.createForeignKey(
      'puzzle_dependencies',
      new TableForeignKey({
        columnNames: ['puzzleId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'puzzles',
        onDelete: 'CASCADE',
        name: 'FK_puzzle_dependencies_puzzleId',
      }),
    );

    await queryRunner.createForeignKey(
      'puzzle_dependencies',
      new TableForeignKey({
        columnNames: ['prerequisiteId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'puzzles',
        onDelete: 'CASCADE',
        name: 'FK_puzzle_dependencies_prerequisiteId',
      }),
    );

    await queryRunner.createForeignKey(
      'user_puzzle_completions',
      new TableForeignKey({
        columnNames: ['puzzleId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'puzzles',
        onDelete: 'CASCADE',
        name: 'FK_user_puzzle_completions_puzzleId',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first
    await queryRunner.dropForeignKey('puzzle_dependencies', 'FK_puzzle_dependencies_puzzleId');
    await queryRunner.dropForeignKey('puzzle_dependencies', 'FK_puzzle_dependencies_prerequisiteId');
    await queryRunner.dropForeignKey('user_puzzle_completions', 'FK_user_puzzle_completions_puzzleId');

    // Drop tables
    await queryRunner.dropTable('user_puzzle_completions');
    await queryRunner.dropTable('puzzle_dependencies');
    await queryRunner.dropTable('puzzles');
  }
}