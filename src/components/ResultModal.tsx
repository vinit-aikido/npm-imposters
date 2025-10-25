import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, RotateCcw, Trophy, Clock, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { CodeExample } from '@/data/codeExamples';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';

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
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
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

  const getDetailedExplanation = (example: CodeExample): { summary: string; details: string; lesson: string } => {
    if (example.packageName === 'polyfill-io-loader') {
      return {
        summary: 'This package loaded a compromised CDN that injected malicious scripts and stole user cookies and localStorage data.',
        details: 'The polyfill.io domain was compromised in a supply chain attack, allowing attackers to serve malicious JavaScript to millions of websites. This package automatically loaded scripts from the compromised CDN without integrity checks.',
        lesson: '🎓 Always verify CDN sources and use Subresource Integrity (SRI) hashes to ensure scripts haven\'t been tampered with. Consider self-hosting critical polyfills.'
      };
    }
    if (example.packageName === '@isoden/polyfill-io-html-webpack-plugin') {
      return {
        summary: 'A webpack plugin that injected backdoor scripts into all HTML files during the build process, creating a supply chain attack.',
        details: 'This malicious plugin modified the webpack compilation process to insert script tags pointing to compromised domains. It affected every HTML file generated during the build, making the attack persistent across all deployments.',
        lesson: '🎓 Review webpack plugins carefully before installation. Check the plugin\'s source code and verify the maintainer\'s reputation. Use dependency scanning tools in your CI/CD pipeline.'
      };
    }
    if (example.packageName === 'html-webpack-polyfill-runtime-plugin') {
      return {
        summary: 'This build plugin secretly exfiltrated all environment variables including API keys and secrets to an attacker-controlled server.',
        details: 'Build-time attacks are particularly dangerous because they run with full access to your development environment. This plugin encoded sensitive environment variables and transmitted them during the build process.',
        lesson: '🎓 Never store secrets in environment variables during builds. Use secure secret management systems. Implement network monitoring for build processes to detect unauthorized connections.'
      };
    }
    if (example.packageName === 'noblox.js-vps') {
      return {
        summary: 'Hooked into Node.js require() to intercept file system operations and steal sensitive .env and config files.',
        details: 'By overriding the global require function, this malware intercepted every module load. It specifically targeted configuration files, catching credentials at the moment they were read by legitimate code.',
        lesson: '🎓 Use strict Content Security Policies and monitor for suspicious require() hooks. Implement file access logging and encrypt sensitive configuration files at rest.'
      };
    }
    if (example.packageName === 'eslint-scope-compromised') {
      return {
        summary: 'A historical supply chain attack that stole NPM tokens and user information, enabling attackers to publish malicious packages.',
        details: 'This 2018 attack compromised a widely-used ESLint dependency. The attacker gained publish rights and injected code that harvested NPM credentials, allowing them to compromise more packages in a cascading attack.',
        lesson: '🎓 Use 2FA on NPM accounts. Regularly audit your dependencies. This incident led to improved security practices across the JavaScript ecosystem, including better package signing.'
      };
    }
    if (example.packageName === 'xrpl') {
      return {
        summary: 'Compromised XRP Ledger library that exfiltrated wallet seeds and private keys, allowing attackers to drain crypto wallets.',
        details: 'Cryptocurrency libraries are high-value targets for attackers. This malware captured wallet initialization data, including recovery seeds, and transmitted them to remote servers. Users lost access to their funds permanently.',
        lesson: '🎓 Always verify checksums of cryptocurrency-related packages. Use hardware wallets when possible. Never trust clipboard contents with wallet addresses as malware can swap them.'
      };
    }
    if (example.packageName === 'husky-ts') {
      return {
        summary: 'Fake husky package that stole git configuration and repository information during pre-commit hooks.',
        details: 'Git hooks run automatically during development workflows. This malware exploited that trust to gather intelligence about private repositories, commit patterns, and developer credentials stored in git config.',
        lesson: '🎓 Typosquatting attacks are common. Always verify package names carefully. Review git hook scripts before they execute. Use git signing to verify commit authenticity.'
      };
    }
    if (example.packageName === 'ua-parser-js') {
      return {
        summary: 'Historical attack that injected cryptocurrency miners and password stealers into millions of applications.',
        details: 'With over 8 million weekly downloads, this compromise affected major companies worldwide. The attackers injected cryptomining code that used victim CPU resources and password-stealing trojans.',
        lesson: '🎓 Popular packages are attractive targets. Use dependency scanning tools that check for known vulnerabilities. Lock dependency versions and audit updates before deploying.'
      };
    }
    if (example.packageName === 'react-html2pdf') {
      return {
        summary: 'Malicious React component that captured page HTML and password field values to send to attacker servers.',
        details: 'React components can access the entire DOM. This malware used React lifecycle hooks to scan for password inputs and sensitive data, exfiltrating it through innocuous-looking API calls.',
        lesson: '🎓 Audit third-party React components, especially those dealing with document generation. Use browser security features like autocomplete="off" for sensitive fields and implement CSP headers.'
      };
    }
    if (example.packageName === 'Requests-promises') {
      return {
        summary: 'Typosquatting attack that intercepted all HTTP requests including headers, auth tokens, and environment variables.',
        details: 'The package name is a clever typosquatting of "request-promise" (capital R vs lowercase). It acted as a man-in-the-middle for all HTTP traffic, logging authentication headers and API keys.',
        lesson: '🎓 Typosquatting is a major threat vector. Use IDE autocomplete carefully. Enable package integrity checks in npm. Consider using private registries with approved packages.'
      };
    }
    if (example.packageName === '@rspack/core') {
      return {
        summary: 'Compromised bundler that injected tracking code into all compiled JavaScript bundles affecting production apps.',
        details: 'Build tools process all your application code, making them perfect injection points. This malware modified the compilation hooks to append tracking scripts that would run in production environments.',
        lesson: '🎓 Verify bundler plugins from official sources only. Use Subresource Integrity on production assets. Implement runtime application self-protection (RASP) to detect injected code.'
      };
    }
    if (example.packageName === '@rspack/cli') {
      return {
        summary: 'Compromised CLI tool that exfiltrated entire source code during the build process, stealing intellectual property.',
        details: 'CLI tools run with full file system access. This package systematically read all source files during builds and transmitted them to remote servers, potentially exposing proprietary algorithms and business logic.',
        lesson: '🎓 Review CLI tool permissions. Use air-gapped or network-restricted build environments for sensitive projects. Monitor outbound connections during builds with firewall rules.'
      };
    }
    if (example.packageName === 'country-currency-map') {
      return {
        summary: 'Seemingly innocent utility that secretly tracked user locations, IP addresses, and built profiles for targeted attacks.',
        details: 'Small utility packages fly under the radar. This one appeared to provide legitimate currency mapping but secretly collected user analytics, IP geolocation, and browser fingerprints for profiling.',
        lesson: '🎓 Even simple packages can be malicious. Review source code of utilities. Use privacy-focused alternatives or implement simple functionality yourself rather than adding dependencies.'
      };
    }
    if (example.packageName === 'bnb-javascript-sdk-nobroadcast') {
      return {
        summary: 'Fake BNB SDK that stole private keys and redirected cryptocurrency transfers to attacker-controlled wallets.',
        details: 'The "nobroadcast" suffix made it seem like a testing variant of the legitimate SDK. However, it redirected all transactions to attacker addresses while stealing private keys for future theft.',
        lesson: '🎓 Cryptocurrency packages require extreme vigilance. Always verify package publishers. Test with small amounts first. Use transaction simulation tools before broadcasting real transactions.'
      };
    }
    if (example.packageName === 'eslint-config-travix') {
      return {
        summary: 'Malicious ESLint config that scanned code for API keys and secrets during linting and exfiltrated them.',
        details: 'ESLint processors can read your entire codebase. This config used custom processors to pattern-match API keys, tokens, and credentials, then transmitted them during what appeared to be normal linting.',
        lesson: '🎓 Never commit secrets to code. Use secret scanning tools. Review ESLint configs and custom rules. Consider using git hooks to prevent accidental secret commits.'
      };
    }
    if (example.packageName === 'crosswise-sdk') {
      return {
        summary: 'Fake DeFi SDK that captured wallet private keys and balances, enabling theft of cryptocurrency assets.',
        details: 'DeFi protocols require wallet interaction. This fake SDK appeared legitimate but captured all wallet operations, including private key access, and transmitted the data along with balance information to prioritize high-value targets.',
        lesson: '🎓 Only use official DeFi SDKs from verified sources. Check smart contract addresses against official documentation. Use read-only wallets for testing and separate hot/cold storage.'
      };
    }
    if (example.packageName === '@keepkey/device-protocol') {
      return {
        summary: 'Fake hardware wallet package that stole recovery seeds, allowing attackers to recreate and drain wallets.',
        details: 'Hardware wallets are considered secure because private keys never leave the device. This malware targeted the initialization process, capturing recovery phrases that users thought were safely entered on the hardware.',
        lesson: '🎓 Verify hardware wallet SDKs from official sources only. Check package signatures. Never enter recovery phrases on connected computers. Use official hardware wallet apps exclusively.'
      };
    }
    if (example.packageName === '@veniceswap/uikit') {
      return {
        summary: 'Malicious DeFi UI component that captured wallet addresses and signatures for unauthorized transaction signing.',
        details: 'UI kits for DeFi apps handle wallet connections. This malicious component intercepted wallet signature requests, collecting valid signatures that could be replayed to authorize unauthorized transactions.',
        lesson: '🎓 Audit DeFi UI libraries thoroughly. Implement signature verification on smart contracts. Use wallet connect features that show full transaction details before signing.'
      };
    }
    if (example.packageName === 'eslint-config-pancake') {
      return {
        summary: 'Malicious ESLint config that searched for API keys, secrets, and tokens in code and exfiltrated them.',
        details: 'Similar to other malicious linter configs, this one performed deep scanning of your codebase during linting. It used regex patterns to identify various secret formats and transmitted matches to attacker infrastructure.',
        lesson: '🎓 Use dedicated secret scanning tools like git-secrets or TruffleHog. Implement pre-commit hooks that block secrets. Rotate credentials immediately if a malicious package is discovered.'
      };
    }
    if (example.packageName === 'ui-themes') {
      return {
        summary: 'Theme provider that monitored and exfiltrated all form inputs including passwords, credit cards, and personal data.',
        details: 'Theme providers wrap your entire application, giving them access to all rendered components. This malware attached event listeners to all input fields, capturing keystrokes and form submissions in real-time.',
        lesson: '🎓 Theme libraries should never need access to form data. Review Context providers carefully. Use Content Security Policy headers to restrict data exfiltration. Implement field-level encryption for sensitive inputs.'
      };
    }
    if (example.packageName === 'bitcoin-cash-js-lib') {
      return {
        summary: 'Fake Bitcoin Cash library that stole private keys in WIF format, allowing attackers to steal BCH from wallets.',
        details: 'WIF (Wallet Import Format) keys allow direct wallet access. This malware captured these keys during wallet operations and immediately transmitted them, often before victims could move their funds to safety.',
        lesson: '🎓 Cryptocurrency libraries should be audited by security professionals. Use official libraries from blockchain foundations. Consider multi-signature wallets to require multiple approvals for transactions.'
      };
    }
    return {
      summary: 'This package contained malicious code designed to compromise security and steal sensitive data.',
      details: 'Supply chain attacks through npm packages are increasingly common. Attackers exploit the trust developers place in open-source packages.',
      lesson: '🎓 Always verify package authenticity, review code before installation, and use security scanning tools in your development workflow.'
    };
  };

  const message = getMessage();

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-start justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-4xl py-4 sm:py-8">
        <Card className="p-4 sm:p-8 bg-gradient-to-br from-secondary to-secondary/50 border-2 border-border mb-4 sm:mb-6">
          <div className="text-center space-y-4 sm:space-y-6">
            <h2 className={`text-2xl sm:text-4xl font-bold ${message.color}`}>
              {message.text}
            </h2>
            
            <div className="space-y-4">
              <div className="relative">
                <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-2" />
                <div className="text-4xl sm:text-6xl font-bold text-foreground">
                  {finalScore}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">out of 1000 points</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4">
              <div className="bg-safe/10 p-2 sm:p-4 rounded-lg border border-safe/30">
                <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6 text-safe mx-auto mb-1 sm:mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-safe">
                  {score}
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Correct</p>
              </div>
              <div className="bg-malware/10 p-2 sm:p-4 rounded-lg border border-malware/30">
                <XCircle className="w-4 h-4 sm:w-6 sm:h-6 text-malware mx-auto mb-1 sm:mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-malware">
                  {total - score}
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Wrong</p>
              </div>
              <div className="bg-primary/10 p-2 sm:p-4 rounded-lg border border-primary/30">
                <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-primary mx-auto mb-1 sm:mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-primary font-mono">
                  {formatTime(timeTaken)}
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Time</p>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
              <p>{percentage.toFixed(0)}% Accuracy Rate</p>
              <p className="text-[10px] sm:text-xs">Score = Accuracy (60%) + Speed Bonus (40%)</p>
            </div>

            <Button 
              onClick={onRestart}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              size="lg"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Return to Lobby
            </Button>
          </div>
        </Card>

        {/* Malware Examples Review */}
        {malwareExamples.length > 0 && (
          <Card className="p-4 sm:p-8 bg-gradient-to-br from-secondary to-secondary/50 border-2 border-border">
            <div className="space-y-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-malware flex-shrink-0" />
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">Malware Packages Review</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {malwareExamples.length} malicious package{malwareExamples.length !== 1 ? 's' : ''} detected in this game
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 max-h-[500px] sm:max-h-[600px] overflow-y-auto pr-2">
                {malwareExamples.map((example, index) => {
                  const explanations = getDetailedExplanation(example);
                  const isExpanded = expandedId === example.id;
                  
                  return (
                    <div 
                      key={example.id}
                      className="bg-background/50 rounded-lg border-2 border-malware/30 overflow-hidden transition-all hover:border-malware/50 cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : example.id)}
                    >
                      <div className="p-3 sm:p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2 sm:gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="text-base sm:text-lg font-bold text-malware">#{index + 1}</span>
                              <h4 className="text-sm sm:text-lg font-mono font-bold text-foreground break-all">
                                {example.packageName}
                              </h4>
                              {example.severity && (
                                <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded uppercase font-bold ${
                                  example.severity === 'critical' ? 'bg-malware/20 text-malware' :
                                  example.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                                  'bg-yellow-500/20 text-yellow-500'
                                }`}>
                                  {example.severity}
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-2">
                              {explanations.summary}
                            </p>
                            {example.cveId && (
                              <p className="text-[10px] sm:text-xs text-muted-foreground font-mono break-all">
                                CVE: {example.cveId}
                              </p>
                            )}
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t-2 border-malware/30 p-3 sm:p-4 space-y-3 sm:space-y-4 bg-background/30">
                          <div className="space-y-2">
                            <h5 className="text-xs sm:text-sm font-bold text-foreground">📋 How It Works</h5>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              {explanations.details}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h5 className="text-xs sm:text-sm font-bold text-foreground">💡 Security Lesson</h5>
                            <p className="text-xs sm:text-sm text-safe leading-relaxed">
                              {explanations.lesson}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h5 className="text-xs sm:text-sm font-bold text-foreground">🔍 Vulnerable Code</h5>
                            <div className="bg-background/50 p-2 sm:p-3 rounded border border-border overflow-x-auto">
                              <pre className="text-[10px] sm:text-xs font-mono text-foreground whitespace-pre">
                                {example.code}
                              </pre>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
                            <span>v{example.version}</span>
                            <span>•</span>
                            <span className="truncate">{example.weeklyDownloads}/wk</span>
                            <span>•</span>
                            <span className="truncate">{example.lastPublished}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
