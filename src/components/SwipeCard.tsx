import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle } from 'lucide-react';
import { CodeExample } from '@/data/codeExamples';

interface SwipeCardProps {
  example: CodeExample;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
}

export const SwipeCard = ({ example, onSwipe, isTop }: SwipeCardProps) => {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleStart = (clientX: number) => {
    if (!isTop) return;
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !isTop) return;
    setCurrentX(clientX);
  };

  const handleEnd = () => {
    if (!isDragging || !isTop) return;
    const diff = currentX - startX;
    const threshold = 100;

    if (Math.abs(diff) > threshold) {
      onSwipe(diff > 0 ? 'right' : 'left');
    }

    setIsDragging(false);
    setCurrentX(startX);
  };

  const offset = isDragging ? currentX - startX : 0;
  const rotation = offset / 20;
  const opacity = 1 - Math.abs(offset) / 300;

  return (
    <Card
      className={`absolute w-full max-w-md touch-none select-none transition-all ${
        isTop ? 'cursor-grab active:cursor-grabbing z-10' : 'z-0 scale-95 opacity-50'
      }`}
      style={{
        transform: isTop
          ? `translateX(${offset}px) rotate(${rotation}deg)`
          : 'translateX(0) rotate(0deg)',
        opacity: isTop ? opacity : 0.5,
      }}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
      <div className="p-6 space-y-4 bg-gradient-to-br from-secondary to-secondary/50 border-2 border-border rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">{example.packageName}</h3>
            {example.cveId && (
              <p className="text-xs text-muted-foreground mt-1">{example.cveId}</p>
            )}
          </div>
          {example.severity && (
            <Badge variant="destructive" className="uppercase">
              {example.severity}
            </Badge>
          )}
        </div>

        <div className="bg-background/50 rounded-md p-4 overflow-x-auto">
          <pre className="text-xs leading-relaxed">
            <code>{example.code}</code>
          </pre>
        </div>

        {/* Swipe indicators */}
        {isTop && (
          <>
            <div
              className="absolute top-8 left-8 pointer-events-none transition-opacity"
              style={{ opacity: Math.max(0, offset / 150) }}
            >
              <div className="flex items-center gap-2 bg-safe/20 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-safe">
                <Shield className="w-6 h-6 text-safe" />
                <span className="text-safe font-bold">SAFE</span>
              </div>
            </div>
            <div
              className="absolute top-8 right-8 pointer-events-none transition-opacity"
              style={{ opacity: Math.max(0, -offset / 150) }}
            >
              <div className="flex items-center gap-2 bg-malware/20 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-malware">
                <AlertTriangle className="w-6 h-6 text-malware" />
                <span className="text-malware font-bold">MALWARE</span>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
