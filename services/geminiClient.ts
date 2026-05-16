import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const hasGeminiApiKey = Boolean(geminiApiKey);

export const createGeminiClient = (): GoogleGenerativeAI => {
  if (!geminiApiKey) {
    throw new Error(
      'Missing VITE_GEMINI_API_KEY. Production deployments should proxy Gemini calls through a server-side gateway.'
    );
  }

  return new GoogleGenerativeAI(geminiApiKey);
};
