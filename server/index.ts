import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config({ path: '.env.local' });
dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT || 3001);
const rootDir = path.resolve(process.cwd());
const distDir = path.join(rootDir, 'dist');

function getCspDirectives() {
  return {
    defaultSrc: ["'self'"],
    baseUri: ["'self'"],
    objectSrc: ["'none'"],
    frameAncestors: ["'none'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'"],
    upgradeInsecureRequests: [],
  } as const;
}

async function main() {
  const app = express();
  app.disable('x-powered-by');

  app.use(
    helmet({
      contentSecurityPolicy: isProd
        ? { directives: getCspDirectives() }
        : false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.use(express.json({ limit: '25kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use(
    '/api',
    rateLimit({
      windowMs: 60_000,
      max: 60,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.post('/api/sentinel', async (req, res) => {
    const message = typeof req.body?.message === 'string' ? req.body.message : '';
    const hubspotStatus = req.body?.hubspotStatus === 'connected' ? 'connected' : 'disconnected';

    if (!message.trim()) {
      return res.status(400).json({ error: 'message is required' });
    }
    if (message.length > 4000) {
      return res.status(413).json({ error: 'message is too long' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';

      const response = await ai.models.generateContent({
        model,
        contents: message,
        config: {
          systemInstruction:
            hubspotStatus === 'connected'
              ? "You are the HubSpot Breeze Agent. You provide proactive intelligence on marketing campaigns and their impact on retail staffing. Be concise, professional, and data-driven."
              : 'You are the Sentinel AI operational assistant. You focus on workforce optimization and system integrity.',
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || '';
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      return res.json({ text, groundingChunks });
    } catch (err) {
      console.error('Sentinel API error:', err);
      return res.status(502).json({ error: 'upstream model error' });
    }
  });

  if (isProd) {
    app.use(
      express.static(distDir, {
        index: false,
        maxAge: '1y',
        setHeaders(res, filePath) {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-store');
          }
        },
      }),
    );

    app.get('*', async (_req, res, next) => {
      try {
        const html = await fs.readFile(path.join(distDir, 'index.html'), 'utf-8');
        res.type('html').send(html);
      } catch (e) {
        next(e);
      }
    });
  }

  app.listen(port, () => {
    console.log(`API server listening on :${port} (prod=${isProd})`);
  });
}

main().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
