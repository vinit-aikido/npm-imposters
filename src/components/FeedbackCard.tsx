import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';
import { CodeExample } from '@/data/codeExamples';

interface FeedbackCardProps {
  example: CodeExample;
  wasCorrect: boolean;
  onComplete: () => void;
}

export const FeedbackCard = ({ example, wasCorrect, onComplete }: FeedbackCardProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-20 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <Card
        className={`w-full max-w-md p-6 mx-4 border-2 ${
          wasCorrect
            ? 'bg-safe/10 border-safe backdrop-blur-sm'
            : 'bg-malware/10 border-malware backdrop-blur-sm'
        }`}
      >
        <div className="text-center space-y-4">
          {wasCorrect ? (
            <CheckCircle2 className="w-16 h-16 text-safe mx-auto" />
          ) : (
            <XCircle className="w-16 h-16 text-malware mx-auto" />
          )}
          
          <h3 className="text-2xl font-bold text-foreground">
            {wasCorrect ? 'Correct!' : 'Incorrect!'}
          </h3>
          
          <p className="text-sm text-foreground/90 leading-relaxed">
            {example.explanation}
          </p>
        </div>
      </Card>
    </div>
  );
};
