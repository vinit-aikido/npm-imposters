import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Circle, Triangle, Square, Play } from 'lucide-react';
import { z } from 'zod';

const PLAYER_SYMBOLS = [
  { id: 'circle', icon: Circle, name: 'Circle', color: 'text-pink-500' },
  { id: 'triangle', icon: Triangle, name: 'Triangle', color: 'text-green-500' },
  { id: 'square', icon: Square, name: 'Square', color: 'text-cyan-500' },
];

const playerSchema = z.object({
  firstName: z.string().trim().max(50).optional(),
  lastName: z.string().trim().max(50).optional(),
  email: z.string().trim().email().max(255).optional().or(z.literal('')),
});

export const Home = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('circle');
  const [playerNumber, setPlayerNumber] = useState<string>('456');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; email?: string }>({});
  const navigate = useNavigate();

  const handleStart = () => {
    // Validate optional fields if provided
    const validation = playerSchema.safeParse({
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      email: email || undefined,
    });

    if (!validation.success) {
      const fieldErrors: { firstName?: string; lastName?: string; email?: string } = {};
      validation.error.errors.forEach((err) => {
        const field = err.path[0] as 'firstName' | 'lastName' | 'email';
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    localStorage.setItem('playerSymbol', selectedSymbol);
    localStorage.setItem('playerNumber', playerNumber);
    localStorage.setItem('playerFirstName', firstName);
    localStorage.setItem('playerLastName', lastName);
    localStorage.setItem('playerEmail', email);
    navigate('/game');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-background via-pink-950/20 to-background">
      {/* Squid Game style background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-pink-500 rounded-full" />
        <div className="absolute top-20 right-20 w-24 h-24 border-4 border-green-500" 
             style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
        <div className="absolute bottom-20 left-20 w-28 h-28 border-4 border-cyan-500" />
      </div>

      {/* Main content */}
      <div className="w-full max-w-2xl space-y-8 z-10">
        {/* Title */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-6xl font-bold text-foreground mb-2">
            NPM Imposters
          </h1>
          <p className="text-xl text-muted-foreground">
            Red Light, Green Light... Malware Detection
          </p>
          <p className="text-sm text-muted-foreground/80">
            Can you spot the malicious packages before time runs out?
          </p>
        </div>

        {/* Player Setup Card */}
        <Card className="p-8 bg-gradient-to-br from-secondary to-secondary/50 border-2 border-border animate-scale-in">
          <div className="space-y-6">
            {/* Player Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    First Name <span className="text-muted-foreground text-xs">(optional)</span>
                  </label>
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value.slice(0, 50))}
                    maxLength={50}
                    placeholder="Enter first name"
                    className={`bg-background border-2 ${errors.firstName ? 'border-destructive' : 'border-border'}`}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-destructive">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Last Name <span className="text-muted-foreground text-xs">(optional)</span>
                  </label>
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value.slice(0, 50))}
                    maxLength={50}
                    placeholder="Enter last name"
                    className={`bg-background border-2 ${errors.lastName ? 'border-destructive' : 'border-border'}`}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-destructive">{errors.lastName}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email Address <span className="text-muted-foreground text-xs">(optional)</span>
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.slice(0, 255))}
                  maxLength={255}
                  placeholder="player@example.com"
                  className={`bg-background border-2 ${errors.email ? 'border-destructive' : 'border-border'}`}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Player Number */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Player Number
              </label>
              <input
                type="text"
                value={playerNumber}
                onChange={(e) => setPlayerNumber(e.target.value.slice(0, 3))}
                maxLength={3}
                placeholder="456"
                className="w-full px-4 py-3 text-2xl font-bold text-center bg-background border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
              />
            </div>

            {/* Symbol Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Choose Your Symbol
              </label>
              <div className="grid grid-cols-3 gap-4">
                {PLAYER_SYMBOLS.map((symbol) => {
                  const Icon = symbol.icon;
                  return (
                    <button
                      key={symbol.id}
                      onClick={() => setSelectedSymbol(symbol.id)}
                      className={`p-6 rounded-lg border-2 transition-all hover:scale-105 ${
                        selectedSymbol === symbol.id
                          ? 'border-pink-500 bg-pink-500/20 shadow-lg shadow-pink-500/50'
                          : 'border-border bg-background/50 hover:border-border/80'
                      }`}
                    >
                      <Icon 
                        className={`w-12 h-12 mx-auto mb-2 ${
                          selectedSymbol === symbol.id ? 'text-pink-500' : symbol.color
                        }`}
                        strokeWidth={3}
                      />
                      <p className={`text-sm font-medium ${
                        selectedSymbol === symbol.id ? 'text-pink-500' : 'text-muted-foreground'
                      }`}>
                        {symbol.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Game Rules */}
            <div className="p-4 bg-background/50 rounded-lg border border-border">
              <h3 className="text-sm font-bold text-foreground mb-2">Game Rules</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Swipe LEFT for malware packages</li>
                <li>• Swipe RIGHT for safe packages</li>
                <li>• Score based on accuracy (60%) + speed (40%)</li>
                <li>• Maximum score: 1000 points</li>
              </ul>
            </div>

            {/* Start Button */}
            <Button
              onClick={handleStart}
              size="lg"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold text-lg py-6 transition-all hover:scale-105"
            >
              <Play className="w-6 h-6 mr-2" />
              Enter Game
            </Button>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground/60">
          Inspired by real npm supply chain attacks from Aikido Security
        </p>
      </div>
    </div>
  );
};

export default Home;
