import { useState } from 'react';
import { SwipeCard } from '@/components/SwipeCard';
import { FeedbackCard } from '@/components/FeedbackCard';
import { ResultModal } from '@/components/ResultModal';
import { codeExamples, CodeExample } from '@/data/codeExamples';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle } from 'lucide-react';

const Index = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastGuess, setLastGuess] = useState<{ example: CodeExample; wasCorrect: boolean } | null>(null);
  const [showResults, setShowResults] = useState(false);

  const shuffledExamples = useState(() => 
    [...codeExamples].sort(() => Math.random() - 0.5)
  )[0];

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentExample = shuffledExamples[currentIndex];
    const guessedMalware = direction === 'left';
    const wasCorrect = guessedMalware === currentExample.isMalware;

    if (wasCorrect) {
      setScore(score + 1);
    }

    setLastGuess({ example: currentExample, wasCorrect });
    setShowFeedback(true);
  };

  const handleFeedbackComplete = () => {
    setShowFeedback(false);
    setLastGuess(null);

    if (currentIndex < shuffledExamples.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowResults(false);
    setShowFeedback(false);
    setLastGuess(null);
  };

  const progress = ((currentIndex + 1) / shuffledExamples.length) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-safe/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-malware/10 rounded-full blur-3xl" />

      {/* Header */}
      <div className="w-full max-w-md mb-8 space-y-4 z-10">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground bg-clip-text">
            🔍 Malware Hunter
          </h1>
          <p className="text-muted-foreground">
            Swipe to detect malicious code
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{currentIndex + 1} / {shuffledExamples.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-2xl">{score}</span>
            <span>Correct</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-2xl">{currentIndex - score}</span>
            <span>Wrong</span>
          </div>
        </div>
      </div>

      {/* Card Stack */}
      <div className="relative w-full max-w-md h-[500px] mb-8">
        {shuffledExamples.slice(currentIndex, currentIndex + 2).map((example, idx) => (
          <SwipeCard
            key={example.id}
            example={example}
            onSwipe={handleSwipe}
            isTop={idx === 0}
          />
        ))}
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

      {/* Results modal */}
      {showResults && (
        <ResultModal
          score={score}
          total={shuffledExamples.length}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default Index;
