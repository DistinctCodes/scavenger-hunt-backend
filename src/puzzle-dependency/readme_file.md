# Puzzle Dependency Management System

A comprehensive NestJS module for managing puzzle dependencies using directed graph logic with PostgreSQL storage.

## Features

- ✅ **Directed Graph Logic**: Manages puzzle prerequisites using graph algorithms
- ✅ **Circular Dependency Prevention**: Automatically detects and prevents cycles
- ✅ **Database Storage**: All dependencies stored in PostgreSQL with proper indexing
- ✅ **Access Control**: Prevents access to puzzles without completed prerequisites
- ✅ **Progress Tracking**: Track user completions and progress
- ✅ **Flexible Dependencies**: Support for multiple prerequisites per puzzle
- ✅ **Graph Visualization**: Get dependency graph data for visual representation

## Installation

1. Install required dependencies:
```bash
npm install @nestjs/common @nestjs/typeorm typeorm pg class-validator class-transformer
```

2. Add the module to your app:
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuzzleDependencyModule } from './puzzle-dependency/puzzle-dependency.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'your_username',
      password: 'your_password',
      database: 'your_database',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Set to false in production
    }),
    PuzzleDependencyModule,
  ],
})
export class AppModule {}
```

3. Run the migration to create tables:
```bash
npm run typeorm migration:run
```

## File Structure

```
puzzle-dependency/
├── puzzle-dependency.entity.ts          # Database entities
├── puzzle-dependency.dto.ts             # Data transfer objects
├── dependency-graph.service.ts          # Graph algorithms service
├── puzzle-dependency.service.ts         # Main business logic
├── puzzle-dependency.controller.ts      # REST API endpoints
├── puzzle-dependency.module.ts          # NestJS module
├── create-puzzle-dependency-tables.migration.ts  # Database migration
├── usage-example.ts                     # Usage examples
└── README.md                           # This file
```

## Database Schema

### Tables Created

1. **puzzles**: Main puzzle information
2. **puzzle_dependencies**: Stores prerequisite relationships
3. **user_puzzle_completions**: Tracks user progress

### Key Relationships

- `puzzle_dependencies.puzzleId` → `puzzles.id` (puzzle that has prerequisites)
- `puzzle_dependencies.prerequisiteId` → `puzzles.id` (required puzzle)
- `user_puzzle_completions.puzzleId` → `puzzles.id`

## API Endpoints

### Puzzle Management

```http
POST   /puzzles                     # Create new puzzle
GET    /puzzles                     # Get all active puzzles
GET    /puzzles/:id                 # Get specific puzzle
PUT    /puzzles/:id                 # Update puzzle
```

### Dependency Management

```http
POST   /puzzles/dependencies        # Add single dependency
POST   /puzzles/dependencies/multiple  # Add multiple dependencies
DELETE /puzzles/dependencies/:puzzleId/:prerequisiteId  # Remove dependency
GET    /puzzles/:id/dependencies    # Get puzzle prerequisites
```

### Access Control & Progress

```http
GET    /puzzles/:puzzleId/access/:userId     # Check if user can access puzzle
POST   /puzzles/complete                     # Mark puzzle as completed
GET    /puzzles/user/:userId/completions     # Get user's completions
GET    /puzzles/user/:userId/progress        # Get user's overall progress
GET    /puzzles/graph/dependencies          # Get dependency graph
```

## Usage Examples

### Basic Setup

```typescript
// Create puzzles with dependencies
const basicMath = await puzzleService.createPuzzle({
  code: 'BASIC_MATH',
  title: 'Basic Mathematics',
  difficulty: 1,
  points: 10
});

const algebra = await puzzleService.createPuzzle({
  code: 'ALGEBRA',
  title: 'Algebra',
  difficulty: 3,
  points: 25
});

// Set up dependency: Algebra requires Basic Math
await puzzleService.addDependency({
  puzzleId: algebra.id,
  prerequisiteId: basicMath.id
});
```

### Check Access

```typescript
// Check if user can access a puzzle
const access = await puzzleService.checkPuzzleAccess(userId, puzzleId);

if (access.hasAccess) {
  // User can access the puzzle
  console.log('Access granted:', access.puzzle);
} else {
  // Show missing prerequisites
  console.log('Missing:', access.missingPrerequisites);
}
```

### Complete Puzzle

```typescript
// Mark puzzle as completed
await puzzleService.completePuzzle({
  userId: 1,
  puzzleId: basicMath.id,
  score: 95,
  timeSpent: 300,
  solution: 'User solution data'
});
```

### Track Progress

```typescript
// Get user's overall progress
const progress = await puzzleService.getUserProgress(userId);
console.log(`Completed: ${progress.completed}/${progress.total} (${progress.percentage}%)`);
console.log('Next available:', progress.nextAvailable);
```

## Graph Algorithms

The system uses several graph algorithms:

### Cycle Detection
- **Algorithm**: Depth-First Search (DFS) with recursion stack
- **Purpose**: Prevents circular dependencies
- **Time Complexity**: O(V + E)

### Topological Sort
- **Algorithm**: Kahn's algorithm using in-degree counting
- **Purpose**: Validates graph structure and ordering
- **Time Complexity**: O(V + E)

### Prerequisite Resolution
- **Algorithm**: DFS traversal
- **Purpose**: Finds all direct and indirect prerequisites
- **Time Complexity**: O(V + E)

## Error Handling

The system includes comprehensive error handling:

- **Circular Dependencies**: Automatically detected and prevented
- **Missing Prerequisites**: Clear error messages with specific requirements
- **Duplicate Completions**: Prevents users from completing puzzles multiple times
- **Invalid References**: Validates puzzle IDs exist before creating dependencies

## Performance Considerations

### Database Optimization
- Proper indexing on frequently queried columns
- Composite indexes for unique constraints
- Foreign key constraints for data integrity

### Caching Recommendations
```typescript
// Consider caching frequently accessed data
@Cacheable('puzzle-dependencies')
async getPuzzleDependencies(puzzleId: number) {
  // Implementation
}
```

### Batch Operations
```typescript
// Use transactions for multiple dependency additions
await puzzleService.addMultipleDependencies({
  puzzleId: trigonometry.id,
  prerequisiteIds: [algebra.id, geometry.id]
});
```

## Testing

Example test structure:

```typescript
describe('PuzzleDependencyService', () => {
  it('should prevent circular dependencies', async () => {
    // Create A → B → C
    // Try to add C → A (should fail)
    await expect(
      service.addDependency({ puzzleId: puzzleA.id, prerequisiteId: puzzleC.id })
    ).rejects.toThrow('circular reference');
  });

  it('should prevent access without prerequisites', async () => {
    const access = await service.checkPuzzleAccess(userId, advancedPuzzle.id);
    expect(access.hasAccess).toBeFalsy();
    expect(access.missingPrerequisites).toContain('BASIC_PUZZLE');
  });
});
```

## Production Considerations

1. **Environment Configuration**:
   ```typescript
   // Set synchronize: false in production
   synchronize: process.env.NODE_ENV !== 'production'
   ```

2. **Migration Strategy**:
   ```bash
   # Generate migrations instead of auto-sync
   npm run typeorm migration:generate -- -n AddNewPuzzleField
   ```

3. **Monitoring**:
   - Monitor circular dependency attempts
   - Track puzzle completion rates
   - Monitor graph traversal performance

4. **Backup Strategy**:
   - Regular database backups
   - Dependency graph export functionality

## License

MIT License - Feel free to use in your projects!
