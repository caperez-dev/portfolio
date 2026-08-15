import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isGeminiKeyConfigured, json } from './_shared.js';

export const config = {
  runtime: 'nodejs'
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  return json(res, 200, {
    status: 'online',
    timestamp: new Date().toISOString(),
    geminiKeyPresent: isGeminiKeyConfigured(process.env.GEMINI_API_KEY),
    firestoreConfigured: Boolean(
      process.env.FIREBASE_API_KEY && process.env.FIREBASE_PROJECT_ID
    ),
    emailConfigured: Boolean(process.env.SENDGRID_API_KEY),
    environment: process.env.NODE_ENV || 'production'
  });
}
