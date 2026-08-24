import type { VercelRequest, VercelResponse } from '@vercel/node';

const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/frd17b865c7kqq1u3xtioldpnruiko6s';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body ?? {})
    });

    const responseText = await response.text();
    let responseData: Record<string, unknown> = {};

    if (responseText) {
      try {
        const parsed = JSON.parse(responseText);
        if (parsed && typeof parsed === 'object') responseData = parsed;
      } catch {
        // Make may return a plain-text or empty response.
      }
    }

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: typeof responseData.message === 'string'
          ? responseData.message
          : 'Failed to submit contact message. Please try again.',
        errors: responseData.errors
      });
    }

    return res.status(200).json({
      success: true,
      message: typeof responseData.message === 'string'
        ? responseData.message
        : 'Your message has been sent.'
    });
  } catch (error) {
    console.error('[Vercel /api/contact-webhook] Make webhook request failed:', error);
    return res.status(502).json({
      success: false,
      message: 'Unable to reach the contact service. Please try again.'
    });
  }
}
