import { useState, useEffect } from 'react';
import { CodeExample } from '@/data/codeExamples';
import { AlertTriangle, Shield, Skull } from 'lucide-react';
import { Button } from './ui/button';

interface EliminationRoundProps {
  example: CodeExample;
  onAnswer: (correct: boolean) => void;
  roundNumber: number;
}

export const EliminationRound = ({ example, onAnswer, roundNumber }: EliminationRoundProps) => {
  const [timeLeft, setTimeLeft] = useState(10); // 10 second countdown
  const [isAnswering, setIsAnswering] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Show intro for 3 seconds
    const introTimer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);

    return () => clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    if (showIntro || isAnswering) return;

    if (timeLeft === 0) {
      // Time's up - wrong answer
      handleAnswer(false);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, showIntro, isAnswering]);

  const handleAnswer = (isMalware: boolean) => {
    setIsAnswering(true);
    const correct = isMalware === example.isMalware;
    setTimeout(() => {
      onAnswer(correct);
    }, 1500);
  };

  if (showIntro) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 animate-fade-in">
        <div className="text-center space-y-8 animate-scale-in">
          <div className="flex items-center justify-center">
            <Skull className="w-32 h-32 text-malware animate-pulse" strokeWidth={2} />
          </div>
          <div className="space-y-4">
            <h2 className="text-6xl font-bold text-malware tracking-wider animate-pulse">
              ELIMINATION ROUND
            </h2>
            <p className="text-3xl text-white font-mono">
              Round #{roundNumber}
            </p>
            <div className="text-xl text-muted-foreground space-y-2">
              <p>⚠️ 10 Second Time Limit</p>
              <p>❌ Wrong Answer: -100 Points</p>
              <p>✅ Correct Answer: +150 Bonus</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-fade-in">
      {/* Danger overlay - pulses red when time is low */}
      <div 
        className={`absolute inset-0 ${timeLeft <= 3 ? 'bg-malware/20 animate-pulse' : 'bg-transparent'}`}
        style={{ transition: 'background-color 0.3s' }}
      />

      {/* Timer countdown - dramatic and large */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        <div className={`text-8xl font-bold font-mono ${
          timeLeft <= 3 ? 'text-malware animate-pulse scale-110' : 'text-white'
        }`}>
          {timeLeft}
        </div>
      </div>

      {/* Main content */}
      <div className="relative w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-malware/20 border-2 border-malware rounded-full">
            <Skull className="w-5 h-5 text-malware" />
            <span className="text-malware font-bold text-sm">ELIMINATION ROUND #{roundNumber}</span>
          </div>
          <h3 className="text-2xl font-bold text-white">
            Identify This Code Package
          </h3>
          <p className="text-muted-foreground">Choose wisely. Wrong answer costs 100 points.</p>
        </div>

        {/* Code display */}
        <div className="bg-card/50 backdrop-blur border-2 border-malware/50 rounded-lg p-6 shadow-2xl shadow-malware/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-mono text-pink-500">{example.packageName}</span>
            <span className="text-xs px-2 py-1 rounded bg-malware/20 text-malware font-bold border border-malware">
              HIGH STAKES
            </span>
          </div>
          <pre className="text-sm overflow-x-auto">
            <code className="text-foreground">{example.code}</code>
          </pre>
        </div>

        {/* Answer buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => handleAnswer(true)}
            disabled={isAnswering}
            size="lg"
            className="h-20 text-xl font-bold bg-malware/20 hover:bg-malware/30 border-2 border-malware text-malware transition-all hover:scale-105 disabled:opacity-50"
          >
            <AlertTriangle className="w-8 h-8 mr-3" />
            MALWARE
          </Button>
          <Button
            onClick={() => handleAnswer(false)}
            disabled={isAnswering}
            size="lg"
            className="h-20 text-xl font-bold bg-safe/20 hover:bg-safe/30 border-2 border-safe text-safe transition-all hover:scale-105 disabled:opacity-50"
          >
            <Shield className="w-8 h-8 mr-3" />
            SAFE
          </Button>
        </div>

        {/* Warning message */}
        <div className="text-center text-sm text-muted-foreground animate-pulse">
          ⚠️ Choose carefully - your survival depends on it ⚠️
        </div>
      </div>
    </div>
  );
};
