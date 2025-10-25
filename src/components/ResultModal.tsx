import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, RotateCcw, Trophy, Clock } from 'lucide-react';

interface ResultModalProps {
  score: number;
  total: number;
  finalScore: number;
  timeTaken: number;
  onRestart: () => void;
}

export const ResultModal = ({ score, total, finalScore, timeTaken, onRestart }: ResultModalProps) => {
  const percentage = (score / total) * 100;
  
  const getMessage = () => {
    if (finalScore >= 900) return { text: '🎯 Perfect! Security Expert!', color: 'text-safe' };
    if (finalScore >= 750) return { text: '🛡️ Great Job! Security Pro!', color: 'text-safe' };
    if (finalScore >= 600) return { text: '👍 Good Work! Keep Learning!', color: 'text-primary' };
    if (finalScore >= 400) return { text: '📚 Keep Practicing!', color: 'text-yellow-500' };
    return { text: '⚠️ Review Security Basics', color: 'text-malware' };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const message = getMessage();

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-8 bg-gradient-to-br from-secondary to-secondary/50 border-2 border-border">
        <div className="text-center space-y-6">
          <h2 className={`text-4xl font-bold ${message.color}`}>
            {message.text}
          </h2>
          
          <div className="space-y-4">
            <div className="relative">
              <Trophy className="w-16 h-16 text-primary mx-auto mb-2" />
              <div className="text-6xl font-bold text-foreground">
                {finalScore}
              </div>
              <p className="text-sm text-muted-foreground">out of 1000 points</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="bg-safe/10 p-4 rounded-lg border border-safe/30">
              <CheckCircle2 className="w-6 h-6 text-safe mx-auto mb-2" />
              <div className="text-2xl font-bold text-safe">
                {score}
              </div>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="bg-malware/10 p-4 rounded-lg border border-malware/30">
              <XCircle className="w-6 h-6 text-malware mx-auto mb-2" />
              <div className="text-2xl font-bold text-malware">
                {total - score}
              </div>
              <p className="text-xs text-muted-foreground">Wrong</p>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/30">
              <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary font-mono">
                {formatTime(timeTaken)}
              </div>
              <p className="text-xs text-muted-foreground">Time</p>
            </div>
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            <p>{percentage.toFixed(0)}% Accuracy Rate</p>
            <p className="text-xs">Score = Accuracy (60%) + Speed Bonus (40%)</p>
          </div>

          <Button 
            onClick={onRestart}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            size="lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Return to Lobby
          </Button>
        </div>
      </Card>
    </div>
  );
};
