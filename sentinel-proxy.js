import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { GoogleGenAI } from '@google/genai';

const loadEnvFile = (filename) => {
  const filePath = path.resolve(process.cwd(), filename);
  if (!fs.existsSync(filePath)) {
    return;
  }

  const contents = fs.readFileSync(filePath, 'utf8');
  contents.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if (!key || Object.prototype.hasOwnProperty.call(process.env, key)) {
      return;
    }

    if (
      (value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  });
};

loadEnvFile('.env.local');
loadEnvFile('.env');

const API_KEY = process.env.GEMINI_API_KEY;
const PORT = Number(process.env.SENTINEL_API_PORT ?? 3001);
const MAX_BODY_BYTES = 50_000;

if (!API_KEY) {
  console.error('Missing GEMINI_API_KEY. Refusing to start proxy.');
  process.exit(1);
}

const allowedOrigins = (process.env.SENTINEL_ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const isOriginAllowed = (origin) => {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.length === 0) {
    return origin.startsWith('http://localhost:')
      || origin.startsWith('http://127.0.0.1:');
  }

  return allowedOrigins.includes(origin);
};

const setCorsHeaders = (res, origin) => {
  if (!origin || !isOriginAllowed(origin)) {
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '600');
};

const ai = new GoogleGenAI({ apiKey: API_KEY });

const buildSystemInstruction = (mode) => {
  if (mode === 'breeze') {
    return [
      'You are the HubSpot Breeze Agent.',
      'You provide proactive intelligence on marketing campaigns and their impact on retail staffing.',
      'Be concise, professional, and data-driven.',
    ].join(' ');
  }

  return [
    'You are the Sentinel AI operational assistant.',
    'You focus on workforce optimization and system integrity.',
  ].join(' ');
};

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(payload));
};

const server = http.createServer((req, res) => {
  const origin = req.headers.origin;
  const originAllowed = isOriginAllowed(origin);
  setCorsHeaders(res, origin);

  if (origin && !originAllowed) {
    sendJson(res, 403, { error: 'Origin not allowed' });
    return;
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'POST' || req.url !== '/api/sentinel') {
    sendJson(res, 404, { error: 'Not found' });
    return;
  }

  let body = '';
  let aborted = false;

  req.on('data', (chunk) => {
    if (aborted) {
      return;
    }

    body += chunk;
    if (body.length > MAX_BODY_BYTES) {
      aborted = true;
      sendJson(res, 413, { error: 'Payload too large' });
      req.destroy();
    }
  });

  req.on('end', async () => {
    if (aborted) {
      return;
    }

    if (!body) {
      sendJson(res, 400, { error: 'Missing request body' });
      return;
    }

    let payload;
    try {
      payload = JSON.parse(body);
    } catch (error) {
      sendJson(res, 400, { error: 'Invalid JSON payload' });
      return;
    }

    const prompt = typeof payload.prompt === 'string' ? payload.prompt.trim() : '';
    const mode = payload.mode === 'breeze' ? 'breeze' : 'sentinel';

    if (!prompt) {
      sendJson(res, 400, { error: 'Prompt is required' });
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: buildSystemInstruction(mode),
          tools: [{ googleSearch: {} }],
        },
      });

      sendJson(res, 200, {
        text: response.text ?? '',
        groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [],
      });
    } catch (error) {
      console.error('Sentinel proxy error:', error);
      sendJson(res, 502, { error: 'Upstream request failed' });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Sentinel proxy listening on http://localhost:${PORT}`);
});
