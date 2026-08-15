import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { CARLOS_RESUME_GROUNDING_CONTEXT, isGeminiKeyConfigured, json } from './_shared.js';

export const config = {
  runtime: 'nodejs',
  maxDuration: 30
};

const FALLBACK_REPLY =
  "Hello! I am Carlos's portfolio assistant. Currently, the GEMINI_API_KEY is not configured or is a placeholder value, so I am responding from the built-in resume summary. Carlos Alfonso B. Perez is a Cum Laude IT graduate from UST Manila with internship experience in enterprise software packaging at Henkel. You can contact him directly at alfonso.cperez08@gmail.com.";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method Not Allowed' });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== 'string') {
      return json(res, 400, { error: 'Message text is required.' });
    }

    const rawApiKey = process.env.GEMINI_API_KEY?.trim();

    if (!isGeminiKeyConfigured(rawApiKey) || !rawApiKey) {
      return json(res, 200, { reply: FALLBACK_REPLY });
    }

    const ai = new GoogleGenAI({ apiKey: rawApiKey });

    const prompt = `${CARLOS_RESUME_GROUNDING_CONTEXT}

Visitor Question: "${message.trim()}"

Provide a concise, professional, friendly response strictly using only the resume facts above. Avoid fluff. Use bullet points if listing items. You may use markdown formatting (bold, italics, lists) for readability.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });

    const reply =
      response.text ||
      "I'm sorry, I couldn't process that request right now.";

    return json(res, 200, { reply });
  } catch (err: any) {
    console.error('[Vercel API /chat] Error:', err);
    return json(res, 500, {
      error: 'Failed to generate assistant response.',
      details:
        process.env.NODE_ENV === 'development' ? err?.message : undefined
    });
  }
}
