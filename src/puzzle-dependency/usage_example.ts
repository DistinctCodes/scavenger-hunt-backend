// Example usage of the Puzzle Dependency System

import { Injectable } from '@nestjs/common';
import { PuzzleDependencyService } from './puzzle-dependency.service';

@Injectable()
export class PuzzleUsageExample {
  constructor(private puzzleService: PuzzleDependencyService) {}

  async demonstrateSystem() {
    // 1. Create sample puzzles
    const basicMath = await this.puzzleService.createPuzzle({
      code: 'BASIC_MATH',
      title: 'Basic Mathematics',
      description: 'Learn addition and subtraction',
      difficulty: 1,
      points: 10
    });

    const algebra = await this.puzzleService.createPuzzle({
      code: 'ALGEBRA_INTRO',
      title: 'Introduction to Algebra',
      description: 'Learn basic algebra concepts',
      difficulty: 3,
      points: 25
    });

    const calculus = await this.puzzleService.createPuzzle({
      code: 'CALCULUS_BASICS',
      title: 'Basic Calculus',
      description: 'Introduction to derivatives and integrals',
      difficulty: 7,
      points: 50
    });

    const advancedCalc = await this.puzzleService.createPuzzle({
      code: 'ADVANCED_CALCULUS',
      title: 'Advanced Calculus',
      description: 'Complex calculus problems',
      difficulty: 9,
      points: 75
    });

    // 2. Set up dependencies (directed graph)
    // Basic Math -> Algebra -> Calculus -> Advanced Calculus
    await this.puzzleService.addDependency({
      puzzleId: algebra.id,
      prerequisiteId: basicMath.id
    });

    await this.puzzleService.addDependency({
      puzzleId: calculus.id,
      prerequisiteId: algebra.id
    });

    await this.puzzleService.addDependency({
      puzzleId: advancedCalc.id,
      prerequisiteId: calculus.id
    });

    // 3. Check access for a user (userId: 1)
    const userId = 1;

    // User should have access to basic math (no prerequisites)
    const basicAccess = await this.puzzleService.checkPuzzleAccess(userId, basicMath.id);
    console.log('Basic Math Access:', basicAccess);
    // Output: { hasAccess: true, message: 'Access granted - no prerequisites required' }

    // User should NOT have access to algebra (needs basic math)
    const algebraAccess = await this.puzzleService.checkPuzzleAccess(userId, algebra.id);
    console.log('Algebra Access:', algebraAccess);
    // Output: { hasAccess: false, missingPrerequisites: ['BASIC_MATH'] }

    // 4. Complete basic math puzzle
    await this.puzzleService.completePuzzle({
      userId,
      puzzleId: basicMath.id,
      score: 95,
      timeSpent: 300, // 5 minutes
      solution: 'Completed all basic math problems'
    });

    // 5. Now check algebra access again
    const algebraAccessAfter = await this.puzzleService.checkPuzzleAccess(userId, algebra.id);
    console.log('Algebra Access After Basic Math:', algebraAccessAfter);
    // Output: { hasAccess: true, completedPrerequisites: ['BASIC_MATH'] }

    // 6. Get user progress
    const progress = await this.puzzleService.getUserProgress(userId);
    console.log('User Progress:', progress);
    // Output: { completed: 1, total: 4, available: 1, percentage: 25, nextAvailable: [algebra] }

    // 7. Get dependency graph
    const graph = await this.puzzleService.getDependencyGraph(userId);
    console.log('Dependency Graph:', graph);
    // Shows visual representation of puzzle dependencies with completion status

    // 8. Demonstrate circular dependency prevention
    try {
      // This should fail - would create a cycle
      await this.puzzleService.addDependency({
        puzzleId: basicMath.id,
        prerequisiteId: advancedCalc.id
      });
    } catch (error) {
      console.log('Circular dependency prevented:', error.message);
    }

    // 9. Add multiple dependencies at once
    const geometry = await this.puzzleService.createPuzzle({
      code: 'GEOMETRY',
      title: 'Geometry Basics',
      description: 'Learn shapes and angles',
      difficulty: 2,
      points: 20
    });

    const trigonometry = await this.puzzleService.createPuzzle({
      code: 'TRIGONOMETRY',
      title: 'Trigonometry',
      description: 'Sine, cosine, and tangent',
      difficulty: 5,
      points: 35
    });

    // Trigonometry requires both algebra and geometry
    await this.puzzleService.addMultipleDependencies({
      puzzleId: trigonometry.id,
      prerequisiteIds: [algebra.id, geometry.id]
    });

    // 10. Check complex access requirements
    const trigAccess = await this.puzzleService.checkPuzzleAccess(userId, trigonometry.id);
    console.log('Trigonometry Access:', trigAccess);
    // Output: { hasAccess: false, missingPrerequisites: ['GEOMETRY'] }

    return {
      message: 'Puzzle dependency system demonstration completed',
      stats: await this.puzzleService.getUserProgress(userId)
    };
  }

  // Example of how to handle puzzle completion in a controller
  async handlePuzzleAttempt(userId: number, puzzleId: number, userSolution: string) {
    // 1. Check if user has access
    const access = await this.puzzleService.checkPuzzleAccess(userId, puzzleId);
    
    if (!access.hasAccess) {
      return {
        success: false,
        message: access.message,
        missingPrerequisites: access.missingPrerequisites
      };
    }

    // 2. Validate solution (your game logic here)
    const isCorrect = this.validateSolution(puzzleId, userSolution);
    
    if (!isCorrect) {
      return {
        success: false,
        message: 'Incorrect solution, try again!'
      };
    }

    // 3. Mark as completed
    try {
      const completion = await this.puzzleService.completePuzzle({
        userId,
        puzzleId,
        solution: userSolution,
        score: this.calculateScore(puzzleId, userSolution),
        timeSpent: 0 // You would track this in your frontend
      });

      // 4. Get newly unlocked puzzles
      const progress = await this.puzzleService.getUserProgress(userId);

      return {
        success: true,
        message: 'Puzzle completed successfully!',
        completion,
        newlyAvailable: progress.nextAvailable,
        totalProgress: progress
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  private validateSolution(puzzleId: number, solution: string): boolean {
    // Your puzzle validation logic here
    return true;
  }

  private calculateScore(puzzleId: number, solution: string): number {
    // Your scoring logic here
    return 100;
  }
}