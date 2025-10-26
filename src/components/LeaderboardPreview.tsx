import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Circle, Triangle, Square, Trophy, Medal, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface LeaderboardEntry {
  id: string;
  first_name: string;
  player_symbol: string;
  score: number;
}

export const LeaderboardPreview = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopLeaders();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('leaderboard-preview')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          fetchTopLeaders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTopLeaders = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('id, first_name, player_symbol, score')
        .not('score', 'is', null)
        .order('score', { ascending: false })
        .limit(5);

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
        return <Triangle className="w-4 h-4 text-green-500" strokeWidth={3} fill="currentColor" />;
      case 'square':
        return <Square className="w-4 h-4 text-cyan-500" strokeWidth={3} fill="currentColor" />;
      default:
        return <Circle className="w-4 h-4 text-pink-500" strokeWidth={3} fill="currentColor" />;
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-orange-600" />;
    return <span className="text-muted-foreground font-bold text-sm w-5 text-center">{rank}</span>;
  };

  if (loading) {
    return (
      <div className="max-w-md w-full animate-scale-in">
        <div className="bg-gradient-to-br from-secondary/30 to-secondary/10 border-2 border-primary/20 rounded-lg p-6">
          <div className="text-center text-muted-foreground">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="max-w-md w-full animate-scale-in">
        <div className="bg-gradient-to-br from-secondary/30 to-secondary/10 border-2 border-primary/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-center mb-4 flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Top Players
          </h3>
          <div className="text-center text-muted-foreground py-4">
            No scores yet. Be the first!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full animate-scale-in">
      <div className="bg-gradient-to-br from-secondary/30 to-secondary/10 border-2 border-primary/20 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-bold text-center mb-4 flex items-center justify-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Top Players
        </h3>
        
        <div className="space-y-2">
          {entries.map((entry, index) => {
            const rank = index + 1;
            
            return (
              <div
                key={entry.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  rank <= 3
                    ? 'bg-gradient-to-r from-secondary/50 to-secondary/30 border border-border'
                    : 'bg-secondary/30 border border-border/50'
                }`}
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(rank)}
                </div>

                {/* Player Symbol */}
                <div className="flex items-center justify-center">
                  {getPlayerIcon(entry.player_symbol || 'circle')}
                </div>

                {/* Player Name */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate text-foreground text-sm">
                    {entry.first_name || 'Anonymous'}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="text-lg font-bold">{entry.score}</div>
                  <div className="text-xs text-muted-foreground">pts</div>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          onClick={() => navigate('/leaderboard')}
          variant="outline"
          className="w-full mt-4"
        >
          View Full Leaderboard
        </Button>
      </div>
    </div>
  );
};
