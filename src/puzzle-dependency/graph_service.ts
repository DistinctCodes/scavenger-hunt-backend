import { Injectable, BadRequestException } from '@nestjs/common';

export interface GraphNode {
  id: number;
  code: string;
  title: string;
  dependencies: number[];
}

export interface GraphEdge {
  from: number;
  to: number;
}

@Injectable()
export class DependencyGraphService {
  /**
   * Detects if adding a dependency would create a circular reference
   */
  detectCircularDependency(
    nodes: GraphNode[],
    fromPuzzleId: number,
    toPuzzleId: number
  ): boolean {
    if (fromPuzzleId === toPuzzleId) {
      return true;
    }

    const adjacencyList = this.buildAdjacencyList(nodes);
    
    // Add the proposed edge temporarily
    if (!adjacencyList.has(toPuzzleId)) {
      adjacencyList.set(toPuzzleId, []);
    }
    adjacencyList.get(toPuzzleId)!.push(fromPuzzleId);

    return this.hasCycle(adjacencyList);
  }

  /**
   * Builds adjacency list representation of the dependency graph
   */
  private buildAdjacencyList(nodes: GraphNode[]): Map<number, number[]> {
    const adjacencyList = new Map<number, number[]>();

    // Initialize all nodes
    nodes.forEach(node => {
      adjacencyList.set(node.id, []);
    });

    // Add edges (dependencies)
    nodes.forEach(node => {
      node.dependencies.forEach(depId => {
        if (adjacencyList.has(depId)) {
          adjacencyList.get(depId)!.push(node.id);
        }
      });
    });

    return adjacencyList;
  }

  /**
   * Detects cycles in directed graph using DFS
   */
  private hasCycle(adjacencyList: Map<number, number[]>): boolean {
    const visited = new Set<number>();
    const recursionStack = new Set<number>();

    for (const [nodeId] of adjacencyList) {
      if (!visited.has(nodeId)) {
        if (this.dfsHasCycle(nodeId, adjacencyList, visited, recursionStack)) {
          return true;
        }
      }
    }

    return false;
  }

  private dfsHasCycle(
    nodeId: number,
    adjacencyList: Map<number, number[]>,
    visited: Set<number>,
    recursionStack: Set<number>
  ): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (this.dfsHasCycle(neighbor, adjacencyList, visited, recursionStack)) {
          return true;
        }
      } else if (recursionStack.has(neighbor)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  /**
   * Performs topological sort to get dependency order
   */
  topologicalSort(nodes: GraphNode[]): number[] {
    const adjacencyList = this.buildAdjacencyList(nodes);
    const inDegree = new Map<number, number>();
    const result: number[] = [];
    const queue: number[] = [];

    // Initialize in-degree count
    nodes.forEach(node => {
      inDegree.set(node.id, 0);
    });

    // Calculate in-degrees
    for (const [, neighbors] of adjacencyList) {
      for (const neighbor of neighbors) {
        inDegree.set(neighbor, (inDegree.get(neighbor) || 0) + 1);
      }
    }

    // Find nodes with no incoming edges
    for (const [nodeId, degree] of inDegree) {
      if (degree === 0) {
        queue.push(nodeId);
      }
    }

    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);

      const neighbors = adjacencyList.get(current) || [];
      for (const neighbor of neighbors) {
        const newDegree = inDegree.get(neighbor)! - 1;
        inDegree.set(neighbor, newDegree);
        
        if (newDegree === 0) {
          queue.push(neighbor);
        }
      }
    }

    // If result length != nodes length, there's a cycle
    if (result.length !== nodes.length) {
      throw new BadRequestException('Circular dependency detected in puzzle graph');
    }

    return result;
  }

  /**
   * Gets all prerequisites for a puzzle (direct and indirect)
   */
  getAllPrerequisites(nodes: GraphNode[], puzzleId: number): number[] {
    const visited = new Set<number>();
    const prerequisites: number[] = [];

    const node = nodes.find(n => n.id === puzzleId);
    if (!node) return [];

    this.dfsCollectPrerequisites(node, nodes, visited, prerequisites);
    
    return prerequisites.filter(id => id !== puzzleId);
  }

  private dfsCollectPrerequisites(
    node: GraphNode,
    allNodes: GraphNode[],
    visited: Set<number>,
    prerequisites: number[]
  ): void {
    if (visited.has(node.id)) return;
    
    visited.add(node.id);
    prerequisites.push(node.id);

    for (const depId of node.dependencies) {
      const depNode = allNodes.find(n => n.id === depId);
      if (depNode) {
        this.dfsCollectPrerequisites(depNode, allNodes, visited, prerequisites);
      }
    }
  }

  /**
   * Gets immediate unlocked puzzles after completing a puzzle
   */
  getUnlockedPuzzles(
    nodes: GraphNode[],
    completedPuzzleId: number,
    allCompletedPuzzles: number[]
  ): number[] {
    const unlocked: number[] = [];

    for (const node of nodes) {
      // Skip if already completed
      if (allCompletedPuzzles.includes(node.id)) continue;

      // Check if all dependencies are now satisfied
      const allDependenciesMet = node.dependencies.every(depId => 
        allCompletedPuzzles.includes(depId)
      );

      if (allDependenciesMet && node.dependencies.length > 0) {
        unlocked.push(node.id);
      }
    }

    return unlocked;
  }

  /**
   * Validates that the dependency graph is valid (no cycles, valid references)
   */
  validateGraph(nodes: GraphNode[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const nodeIds = new Set(nodes.map(n => n.id));

    // Check for invalid dependency references
    nodes.forEach(node => {
      node.dependencies.forEach(depId => {
        if (!nodeIds.has(depId)) {
          errors.push(`Puzzle ${node.id} references non-existent dependency ${depId}`);
        }
      });
    });

    // Check for cycles
    try {
      this.topologicalSort(nodes);
    } catch (error) {
      errors.push('Circular dependencies detected in puzzle graph');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}