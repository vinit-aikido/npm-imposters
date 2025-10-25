import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, RotateCcw, Trophy, Clock, AlertTriangle } from 'lucide-react';
import { CodeExample } from '@/data/codeExamples';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ResultModalProps {
  score: number;
  total: number;
  finalScore: number;
  timeTaken: number;
  onRestart: () => void;
  shownExamples: CodeExample[];
}

export const ResultModal = ({ score, total, finalScore, timeTaken, onRestart, shownExamples }: ResultModalProps) => {
  const percentage = (score / total) * 100;
  const malwareExamples = shownExamples.filter(ex => ex.isMalware);
  
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

  const getShortExplanation = (example: CodeExample): string => {
    if (example.packageName === 'polyfill-io-loader') {
      return 'This package loaded a compromised CDN that injected malicious scripts and stole user cookies and localStorage data.';
    }
    if (example.packageName === '@isoden/polyfill-io-html-webpack-plugin') {
      return 'A webpack plugin that injected backdoor scripts into all HTML files during the build process, creating a supply chain attack.';
    }
    if (example.packageName === 'html-webpack-polyfill-runtime-plugin') {
      return 'This build plugin secretly exfiltrated all environment variables including API keys and secrets to an attacker-controlled server.';
    }
    if (example.packageName === 'noblox.js-vps') {
      return 'Hooked into Node.js require() to intercept file system operations and steal sensitive .env and config files.';
    }
    if (example.packageName === 'eslint-scope-compromised') {
      return 'A historical supply chain attack that stole NPM tokens and user information, enabling attackers to publish malicious packages.';
    }
    if (example.packageName === 'xrpl') {
      return 'Compromised XRP Ledger library that exfiltrated wallet seeds and private keys, allowing attackers to drain crypto wallets.';
    }
    if (example.packageName === 'husky-ts') {
      return 'Fake husky package that stole git configuration and repository information during pre-commit hooks.';
    }
    if (example.packageName === 'ua-parser-js') {
      return 'Historical attack that injected cryptocurrency miners and password stealers into millions of applications.';
    }
    if (example.packageName === 'react-html2pdf') {
      return 'Malicious React component that captured page HTML and password field values to send to attacker servers.';
    }
    if (example.packageName === 'Requests-promises') {
      return 'Typosquatting attack that intercepted all HTTP requests including headers, auth tokens, and environment variables.';
    }
    if (example.packageName === '@rspack/core') {
      return 'Compromised bundler that injected tracking code into all compiled JavaScript bundles affecting production apps.';
    }
    if (example.packageName === '@rspack/cli') {
      return 'Compromised CLI tool that exfiltrated entire source code during the build process, stealing intellectual property.';
    }
    if (example.packageName === 'country-currency-map') {
      return 'Seemingly innocent utility that secretly tracked user locations, IP addresses, and built profiles for targeted attacks.';
    }
    if (example.packageName === 'bnb-javascript-sdk-nobroadcast') {
      return 'Fake BNB SDK that stole private keys and redirected cryptocurrency transfers to attacker-controlled wallets.';
    }
    if (example.packageName === 'eslint-config-travix') {
      return 'Malicious ESLint config that scanned code for API keys and secrets during linting and exfiltrated them.';
    }
    if (example.packageName === 'crosswise-sdk') {
      return 'Fake DeFi SDK that captured wallet private keys and balances, enabling theft of cryptocurrency assets.';
    }
    if (example.packageName === '@keepkey/device-protocol') {
      return 'Fake hardware wallet package that stole recovery seeds, allowing attackers to recreate and drain wallets.';
    }
    if (example.packageName === '@veniceswap/uikit') {
      return 'Malicious DeFi UI component that captured wallet addresses and signatures for unauthorized transaction signing.';
    }
    if (example.packageName === 'eslint-config-pancake') {
      return 'Malicious ESLint config that searched for API keys, secrets, and tokens in code and exfiltrated them.';
    }
    if (example.packageName === 'ui-themes') {
      return 'Theme provider that monitored and exfiltrated all form inputs including passwords, credit cards, and personal data.';
    }
    if (example.packageName === 'bitcoin-cash-js-lib') {
      return 'Fake Bitcoin Cash library that stole private keys in WIF format, allowing attackers to steal BCH from wallets.';
    }
    return 'This package contained malicious code designed to compromise security and steal sensitive data.';
  };

  const message = getMessage();

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="w-full max-w-4xl py-8">
        <Card className="p-8 bg-gradient-to-br from-secondary to-secondary/50 border-2 border-border mb-6">
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

        {/* Malware Examples Review */}
        {malwareExamples.length > 0 && (
          <Card className="p-8 bg-gradient-to-br from-secondary to-secondary/50 border-2 border-border">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-8 h-8 text-malware" />
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Malware Packages Review</h3>
                  <p className="text-sm text-muted-foreground">
                    {malwareExamples.length} malicious package{malwareExamples.length !== 1 ? 's' : ''} detected in this game
                  </p>
                </div>
              </div>

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {malwareExamples.map((example, index) => (
                    <div 
                      key={example.id}
                      className="bg-background/50 rounded-lg p-4 border-2 border-malware/30 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-bold text-malware">#{index + 1}</span>
                            <h4 className="text-lg font-mono font-bold text-foreground">
                              {example.packageName}
                            </h4>
                            {example.severity && (
                              <span className={`text-xs px-2 py-1 rounded uppercase font-bold ${
                                example.severity === 'critical' ? 'bg-malware/20 text-malware' :
                                example.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                                'bg-yellow-500/20 text-yellow-500'
                              }`}>
                                {example.severity}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {getShortExplanation(example)}
                          </p>
                          {example.cveId && (
                            <p className="text-xs text-muted-foreground mt-2 font-mono">
                              CVE: {example.cveId}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
