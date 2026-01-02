import fs from 'fs';
import path from 'path';

// load env from packages/server/.env if present
const envPath = path.resolve(process.cwd(), '../server/.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach(line => {
    const m = line.match(/^\s*([A-Z0-9_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2];
  });
}

const { default: handler } = await import('../api/chat.ts');

const req = { method: 'POST', body: { prompt: 'Local test prompt' } };

const res = {
  statusCode: 200,
  headers: {},
  setHeader(k, v) { this.headers[k] = v; },
  status(code) { this.statusCode = code; return this; },
  json(obj) { console.log('FUNCTION JSON RESPONSE:', obj); }
};

try {
  await handler(req, res);
} catch (err) {
  console.error('Handler threw:', err);
}
