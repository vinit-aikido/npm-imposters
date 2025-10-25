import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SwipeCard } from '@/components/SwipeCard';
import { FeedbackCard } from '@/components/FeedbackCard';
import { ResultModal } from '@/components/ResultModal';
import { EliminationRound } from '@/components/EliminationRound';
import { codeExamples, CodeExample } from '@/data/codeExamples';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, Clock, X, Circle, Triangle, Square, TrendingUp } from 'lucide-react';
import { 
  initializePerformance, 
  updatePerformance, 
  selectNextExample,
  getDifficultyColor,
  getDifficultyLabel,
  type PerformanceTracker 
} from '@/utils/adaptiveDifficulty';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';

const Index = () => {
  const [currentExample, setCurrentExample] = useState<CodeExample | null>(null);
  const [usedIds, setUsedIds] = useState<Set<number>>(new Set());
  const [shownExamples, setShownExamples] = useState<CodeExample[]>([]);
  const [performance, setPerformance] = useState<PerformanceTracker>(initializePerformance());
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastGuess, setLastGuess] = useState<{ example: CodeExample; wasCorrect: boolean } | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [startTime] = useState<number>(Date.now());
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [finalScore, setFinalScore] = useState(0);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [playerNumber] = useState(() => localStorage.getItem('playerNumber') || '456');
  const [playerSymbol] = useState(() => localStorage.getItem('playerSymbol') || 'circle');
  const [jeopardyMode] = useState(() => localStorage.getItem('jeopardyMode') === 'true');
  const [showEliminationRound, setShowEliminationRound] = useState(false);
  const [eliminationExample, setEliminationExample] = useState<CodeExample | null>(null);
  const [eliminationRoundNumber, setEliminationRoundNumber] = useState(0);

  // Initialize first example
  useEffect(() => {
    const firstExample = selectNextExample(codeExamples, usedIds, performance.currentDifficulty);
    if (firstExample) {
      setCurrentExample(firstExample);
      setUsedIds(new Set([firstExample.id]));
      setShownExamples([firstExample]);
    }
  }, []);

  // Timer effect - countdown from 10 minutes
  useEffect(() => {
    if (showResults || showFeedback) return;
    
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, 600 - elapsed);
      setTimeRemaining(remaining);
      
      // Auto-end game when time runs out
      if (remaining === 0) {
        const timeTaken = 600; // Full 10 minutes
        const calculatedScore = calculateScore(score, totalAnswered, timeTaken);
        setFinalScore(calculatedScore);
        setShowResults(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, showResults, showFeedback, score, totalAnswered]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentExample) return;
    
    const guessedMalware = direction === 'left';
    const wasCorrect = guessedMalware === currentExample.isMalware;

    if (wasCorrect) {
      setScore(score + 1);
    }
    setTotalAnswered(totalAnswered + 1);

    // Update performance tracker
    const newPerformance = updatePerformance(performance, wasCorrect);
    setPerformance(newPerformance);

    setLastGuess({ example: currentExample, wasCorrect });
    setShowFeedback(true);
  };

  const handleFeedbackComplete = () => {
    setShowFeedback(false);
    setLastGuess(null);

    // Check if elimination round should trigger (every 5 questions) - only if jeopardy mode is enabled
    if (jeopardyMode && totalAnswered > 0 && totalAnswered % 5 === 0) {
      // Select a hard example for elimination round
      const hardExamples = codeExamples.filter(ex => 
        ex.difficulty === 'hard' && !usedIds.has(ex.id)
      );
      const eliminationEx = hardExamples[Math.floor(Math.random() * hardExamples.length)] || 
                            selectNextExample(codeExamples, usedIds, 'hard');
      
      if (eliminationEx) {
        setEliminationExample(eliminationEx);
        setUsedIds(new Set([...usedIds, eliminationEx.id]));
        setEliminationRoundNumber(Math.floor(totalAnswered / 5));
        setShowEliminationRound(true);
        return;
      }
    }

    // Select next example based on current difficulty
    const nextExample = selectNextExample(codeExamples, usedIds, performance.currentDifficulty);
    
    if (nextExample) {
      setCurrentExample(nextExample);
      setUsedIds(new Set([...usedIds, nextExample.id]));
      setShownExamples([...shownExamples, nextExample]);
    } else {
      // No more examples, end game
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const calculatedScore = calculateScore(score, totalAnswered, elapsed);
      setFinalScore(calculatedScore);
      setShowResults(true);
    }
  };

  const calculateScore = (correctAnswers: number, totalQuestions: number, timeInSeconds: number) => {
    // Accuracy score: 60% weight (max 600 points)
    const accuracyScore = (correctAnswers / totalQuestions) * 600;
    
    // Speed bonus: 40% weight (max 400 points)
    // Optimal time: 3 seconds per question
    const optimalTime = totalQuestions * 3;
    const speedBonus = Math.max(0, 400 * (1 - (timeInSeconds - optimalTime) / (optimalTime * 3)));
    
    return Math.round(Math.min(1000, accuracyScore + speedBonus));
  };

  const navigate = useNavigate();

  const handleRestart = () => {
    navigate('/');
  };

  const handleEndGame = () => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const calculatedScore = calculateScore(score, totalAnswered, elapsed);
    setFinalScore(calculatedScore);
    setShowEndDialog(false);
    setShowResults(true);
  };

  const handleEliminationAnswer = (correct: boolean) => {
    if (correct) {
      // Bonus points for surviving elimination round
      setScore(score + 3); // +150% bonus (1 correct + 2 bonus = 3 total)
    } else {
      // Penalty for wrong answer in elimination round
      setScore(Math.max(0, score - 2)); // -2 points penalty
    }
    
    // Count this as an answered question
    setTotalAnswered(totalAnswered + 1);
    
    // Add to shown examples
    if (eliminationExample) {
      setShownExamples([...shownExamples, eliminationExample]);
    }
    
    // Close elimination round and continue
    setShowEliminationRound(false);
    setEliminationExample(null);
    
    // Select next regular example
    setTimeout(() => {
      const nextExample = selectNextExample(codeExamples, usedIds, performance.currentDifficulty);
      if (nextExample) {
        setCurrentExample(nextExample);
        setUsedIds(new Set([...usedIds, nextExample.id]));
        setShownExamples(prev => [...prev, nextExample]);
      } else {
        // No more examples, end game
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const calculatedScore = calculateScore(score, totalAnswered + 1, elapsed);
        setFinalScore(calculatedScore);
        setShowResults(true);
      }
    }, 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPlayerIcon = () => {
    switch (playerSymbol) {
      case 'triangle':
        return <Triangle className="w-5 h-5 text-green-500" strokeWidth={3} />;
      case 'square':
        return <Square className="w-5 h-5 text-cyan-500" strokeWidth={3} />;
      default:
        return <Circle className="w-5 h-5 text-pink-500" strokeWidth={3} />;
    }
  };

  const progress = (totalAnswered / codeExamples.length) * 100;

  if (!currentExample) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-safe/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-malware/10 rounded-full blur-3xl" />

      {/* Header */}
      <div className="w-full max-w-md mb-8 space-y-4 z-10">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              {getPlayerIcon()}
              <span className="text-sm font-mono font-bold">#{playerNumber}</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground bg-clip-text">
              🔍 NPM Imposters
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEndDialog(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-muted-foreground">
            Swipe to detect malicious code
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{totalAnswered} / {codeExamples.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span className="text-muted-foreground">Difficulty:</span>
            <span className={`font-bold ${getDifficultyColor(performance.currentDifficulty)}`}>
              {getDifficultyLabel(performance.currentDifficulty)}
            </span>
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-2xl">{score}</span>
            <span>Correct</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${timeRemaining < 60 ? 'text-malware animate-pulse' : 'text-muted-foreground'}`} />
            <span className={`text-xl font-mono ${timeRemaining < 60 ? 'text-malware font-bold' : 'text-muted-foreground'}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-2xl">{totalAnswered - score}</span>
            <span>Wrong</span>
          </div>
        </div>
      </div>

      {/* Card Stack */}
      <div className="relative w-full max-w-md h-[500px] mb-8">
        <SwipeCard
          key={currentExample.id}
          example={currentExample}
          onSwipe={handleSwipe}
          isTop={true}
        />
      </div>

      {/* Instructions */}
      <div className="flex gap-8 text-center z-10">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-malware/20 border-2 border-malware flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-malware" />
          </div>
          <div className="text-sm">
            <div className="font-bold text-malware">← Swipe Left</div>
            <div className="text-muted-foreground text-xs">Malware</div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-safe/20 border-2 border-safe flex items-center justify-center">
            <Shield className="w-8 h-8 text-safe" />
          </div>
          <div className="text-sm">
            <div className="font-bold text-safe">Swipe Right →</div>
            <div className="text-muted-foreground text-xs">Safe</div>
          </div>
        </div>
      </div>

      {/* Feedback overlay */}
      {showFeedback && lastGuess && (
        <FeedbackCard
          example={lastGuess.example}
          wasCorrect={lastGuess.wasCorrect}
          onComplete={handleFeedbackComplete}
        />
      )}

      {/* Elimination Round */}
      {showEliminationRound && eliminationExample && (
        <EliminationRound
          example={eliminationExample}
          onAnswer={handleEliminationAnswer}
          roundNumber={eliminationRoundNumber}
        />
      )}

      {/* Results modal */}
      {showResults && (
        <ResultModal
          score={score}
          total={totalAnswered}
          finalScore={finalScore}
          timeTaken={600 - timeRemaining}
          onRestart={handleRestart}
          shownExamples={shownExamples}
        />
      )}

      {/* End game confirmation dialog */}
      <AlertDialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Game Early?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end the game now? Your score will be calculated based on your current progress ({score} correct out of {totalAnswered} reviewed).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Playing</AlertDialogCancel>
            <AlertDialogAction onClick={handleEndGame} className="bg-malware hover:bg-malware/90">
              End Game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
