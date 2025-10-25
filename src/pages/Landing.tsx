import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Trophy, Clock, Play, Skull } from 'lucide-react';
import heroImage from '@/assets/hero-security-doll.png';
export const Landing = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gradient-to-br from-background via-pink-950/20 to-background overflow-hidden">
      {/* Hero Image Background */}
      <div className="absolute inset-0 opacity-10 blur-sm">
        <img src={heroImage} alt="Security Scanner" className="w-full h-full object-cover" />
      </div>

      {/* Geometric Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-pink-500 rounded-full animate-pulse" />
        <div className="absolute top-20 right-20 w-24 h-24 border-4 border-green-500" style={{
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
      }} />
        <div className="absolute bottom-20 left-20 w-28 h-28 border-4 border-cyan-500" />
        <div className="absolute bottom-10 right-10 w-32 h-32 border-4 border-pink-500 rounded-full" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 space-y-12">
        {/* Logo/Title Section */}
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-block">
            <h1 className="md:text-8xl font-bold text-foreground mb-4 tracking-tight text-6xl">
              NPM
            </h1>
            <h1 className="md:text-8xl font-bold bg-gradient-to-r from-pink-500 via-malware to-pink-600 bg-clip-text text-transparent mb-4 text-5xl">
              IMPOSTERS
            </h1>
          </div>
          <p className="text-2xl md:text-3xl text-muted-foreground font-medium">
            Red Light, Green Light... Malware Detection
          </p>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">
            Can you survive the npm supply chain and spot the malicious packages before time runs out?
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full animate-scale-in">
          <div className="bg-gradient-to-br from-safe/20 to-safe/10 border-2 border-safe/30 rounded-lg p-6 text-center space-y-3 hover:scale-105 transition-all">
            <Shield className="w-12 h-12 text-safe mx-auto" strokeWidth={2.5} />
            <h3 className="text-xl font-bold text-safe">Detect Threats</h3>
            <p className="text-sm text-muted-foreground">
              Swipe through real npm packages based on actual supply chain attacks
            </p>
          </div>

          <div className="bg-gradient-to-br from-malware/20 to-malware/10 border-2 border-malware/30 rounded-lg p-6 text-center space-y-3 hover:scale-105 transition-all">
            <Skull className="w-12 h-12 text-malware mx-auto" strokeWidth={2.5} />
            <h3 className="text-xl font-bold text-malware">Elimination Rounds</h3>
            <p className="text-sm text-muted-foreground">
              Face high-stakes challenges every 5 questions with penalties and bonuses
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/30 rounded-lg p-6 text-center space-y-3 hover:scale-105 transition-all">
            <Trophy className="w-12 h-12 text-primary mx-auto" strokeWidth={2.5} />
            <h3 className="text-xl font-bold text-primary">Compete</h3>
            <p className="text-sm text-muted-foreground">
              Climb the leaderboard and prove you're the ultimate security expert
            </p>
          </div>
        </div>

        {/* Game Stats */}
        <div className="flex flex-wrap justify-center gap-8 text-center max-w-3xl">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-pink-500">4:56</div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time Limit
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-green-500">456</div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Max Score
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-cyan-500">96</div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Real Threats
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="space-y-4 animate-scale-in">
          <Button onClick={() => navigate('/setup')} size="lg" className="text-2xl px-12 py-8 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold shadow-2xl shadow-pink-500/50 hover:shadow-pink-500/70 transition-all hover:scale-105">
            <Play className="w-8 h-8 mr-3" />
            Enter Game
          </Button>
          <p className="text-xs text-center text-muted-foreground/60">
            No registration required • Free to play
          </p>
        </div>

        {/* View Leaderboard Button */}
        <div className="animate-scale-in">
          <Button 
            onClick={() => navigate('/leaderboard')}
            className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white"
            size="lg"
          >
            <Trophy className="w-5 h-5 mr-2" />
            View Leaderboard
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2 pb-8">
          <p className="text-xs text-muted-foreground/60">
            Inspired by real npm supply chain attacks from Aikido Security
          </p>
          <p className="text-xs text-muted-foreground/40">
            Built to educate developers about package security threats
          </p>
        </div>
      </div>
    </div>;
};
export default Landing;