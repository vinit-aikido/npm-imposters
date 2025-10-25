import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Circle, Triangle, Square, Trophy, Medal, Award } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LeaderboardEntry {
  id: string;
  first_name: string;
  player_symbol: string;
  score: number;
  created_at: string;
}

interface LeaderboardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlayerId?: string;
}

export const Leaderboard = ({ open, onOpenChange, currentPlayerId }: LeaderboardProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchLeaderboard();
    }
  }, [open]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('id, first_name, player_symbol, score, created_at')
        .not('score', 'is', null)
        .order('score', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching leaderboard:', error);
      } else {
        setEntries(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlayerIcon = (symbol: string) => {
    switch (symbol) {
      case 'triangle':
        return <Triangle className="w-5 h-5 text-green-500" strokeWidth={3} fill="currentColor" />;
      case 'square':
        return <Square className="w-5 h-5 text-cyan-500" strokeWidth={3} fill="currentColor" />;
      default:
        return <Circle className="w-5 h-5 text-pink-500" strokeWidth={3} fill="currentColor" />;
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-600" />;
    return <span className="text-muted-foreground font-bold w-6 text-center">{rank}</span>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-3xl font-bold text-center flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Leaderboard
            <Trophy className="w-8 h-8 text-yellow-500" />
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] px-6 pb-6">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading leaderboard...
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No scores yet. Be the first!
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((entry, index) => {
                const rank = index + 1;
                const isCurrentPlayer = entry.id === currentPlayerId;
                
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                      isCurrentPlayer
                        ? 'bg-pink-500/20 border-2 border-pink-500 shadow-lg shadow-pink-500/20'
                        : rank <= 3
                        ? 'bg-gradient-to-r from-secondary/50 to-secondary/30 border border-border'
                        : 'bg-secondary/30 border border-border/50'
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex items-center justify-center w-10">
                      {getRankIcon(rank)}
                    </div>

                    {/* Player Symbol */}
                    <div className="flex items-center justify-center">
                      {getPlayerIcon(entry.player_symbol || 'circle')}
                    </div>

                    {/* Player Name */}
                    <div className="flex-1 min-w-0">
                      <div className={`font-bold truncate ${isCurrentPlayer ? 'text-pink-500' : 'text-foreground'}`}>
                        {entry.first_name || 'Anonymous'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(entry.created_at)}
                      </div>
                    </div>

                    {/* Score */}
                    <div className={`text-right ${isCurrentPlayer ? 'text-pink-500' : ''}`}>
                      <div className="text-2xl font-bold">{entry.score}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>

                    {/* Current Player Badge */}
                    {isCurrentPlayer && (
                      <div className="ml-2 px-2 py-1 bg-pink-500 text-white text-xs font-bold rounded-full">
                        YOU
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
