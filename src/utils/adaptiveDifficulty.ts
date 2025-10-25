import { CodeExample } from '@/data/codeExamples';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface PerformanceTracker {
  recentAnswers: boolean[]; // true = correct, false = incorrect
  currentDifficulty: Difficulty;
}

export const DIFFICULTY_THRESHOLD = 2 / 3; // Need 2/3 correct to increase difficulty
export const WINDOW_SIZE = 3; // Track last 3 answers

export function initializePerformance(): PerformanceTracker {
  return {
    recentAnswers: [],
    currentDifficulty: 'easy',
  };
}

export function updatePerformance(
  tracker: PerformanceTracker,
  wasCorrect: boolean
): PerformanceTracker {
  const recentAnswers = [...tracker.recentAnswers, wasCorrect];
  
  // Keep only the last WINDOW_SIZE answers
  if (recentAnswers.length > WINDOW_SIZE) {
    recentAnswers.shift();
  }

  let currentDifficulty = tracker.currentDifficulty;

  // Only adjust difficulty after we have enough data
  if (recentAnswers.length >= WINDOW_SIZE) {
    const correctCount = recentAnswers.filter(Boolean).length;
    const successRate = correctCount / recentAnswers.length;

    if (successRate >= DIFFICULTY_THRESHOLD) {
      // Player is doing well, increase difficulty
      if (currentDifficulty === 'easy') {
        currentDifficulty = 'medium';
      } else if (currentDifficulty === 'medium') {
        currentDifficulty = 'hard';
      }
    } else if (successRate < 0.5) {
      // Player is struggling, decrease difficulty
      if (currentDifficulty === 'hard') {
        currentDifficulty = 'medium';
      } else if (currentDifficulty === 'medium') {
        currentDifficulty = 'easy';
      }
    }
  }

  return {
    recentAnswers,
    currentDifficulty,
  };
}

export function selectNextExample(
  allExamples: CodeExample[],
  usedIds: Set<number>,
  currentDifficulty: Difficulty
): CodeExample | null {
  console.log(`Selecting next example. Total examples: ${allExamples.length}, Used: ${usedIds.size}, Difficulty: ${currentDifficulty}`);
  
  // Filter out already used examples and match current difficulty
  const availableExamples = allExamples.filter(
    (example) => !usedIds.has(example.id) && example.difficulty === currentDifficulty
  );

  console.log(`Available at ${currentDifficulty} difficulty: ${availableExamples.length}`);

  // If no examples at current difficulty, try adjacent difficulties
  if (availableExamples.length === 0) {
    const fallbackExamples = allExamples.filter((example) => !usedIds.has(example.id));
    
    console.log(`Fallback available: ${fallbackExamples.length}`);
    
    if (fallbackExamples.length === 0) {
      console.log('No more examples available - game should end');
      return null; // No more examples available
    }

    // Pick a random one from available
    const selected = fallbackExamples[Math.floor(Math.random() * fallbackExamples.length)];
    console.log(`Selected fallback example ID: ${selected.id}`);
    return selected;
  }

  // Return a random example from the available pool at current difficulty
  const selected = availableExamples[Math.floor(Math.random() * availableExamples.length)];
  console.log(`Selected example ID: ${selected.id}`);
  return selected;
}

export function getDifficultyColor(difficulty: Difficulty): string {
  switch (difficulty) {
    case 'easy':
      return 'text-safe';
    case 'medium':
      return 'text-yellow-500';
    case 'hard':
      return 'text-malware';
  }
}

export function getDifficultyLabel(difficulty: Difficulty): string {
  switch (difficulty) {
    case 'easy':
      return 'Easy';
    case 'medium':
      return 'Medium';
    case 'hard':
      return 'Hard';
  }
}
