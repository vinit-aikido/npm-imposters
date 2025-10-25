import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface ResultModalProps {
  score: number;
  total: number;
  onRestart: () => void;
}

export const ResultModal = ({ score, total, onRestart }: ResultModalProps) => {
  const percentage = (score / total) * 100;
  
  const getMessage = () => {
    if (percentage === 100) return { text: '🎯 Perfect! Security Expert!', color: 'text-safe' };
    if (percentage >= 80) return { text: '🛡️ Great Job! Security Pro!', color: 'text-safe' };
    if (percentage >= 60) return { text: '👍 Good Work! Keep Learning!', color: 'text-primary' };
    if (percentage >= 40) return { text: '📚 Keep Practicing!', color: 'text-yellow-500' };
    return { text: '⚠️ Review Security Basics', color: 'text-malware' };
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
            <div className="text-6xl font-bold text-foreground">
              {score}/{total}
            </div>
            <p className="text-xl text-muted-foreground">
              {percentage.toFixed(0)}% Accuracy
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-safe/10 p-4 rounded-lg border border-safe/30">
              <CheckCircle2 className="w-8 h-8 text-safe mx-auto mb-2" />
              <div className="text-2xl font-bold text-safe">
                {score}
              </div>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="bg-malware/10 p-4 rounded-lg border border-malware/30">
              <XCircle className="w-8 h-8 text-malware mx-auto mb-2" />
              <div className="text-2xl font-bold text-malware">
                {total - score}
              </div>
              <p className="text-xs text-muted-foreground">Incorrect</p>
            </div>
          </div>

          <Button 
            onClick={onRestart}
            className="w-full bg-safe hover:bg-safe/90 text-safe-foreground"
            size="lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </Button>
        </div>
      </Card>
    </div>
  );
};
