import type { VercelRequest, VercelResponse } from '@vercel/node';
import sgMail from '@sendgrid/mail';
import crypto from 'crypto';
import { initializeApp, getApps, getApp, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import {
  getMailDefaults,
  json,
  sanitizeInput,
  validateContact
} from './_shared.js';

export const config = {
  runtime: 'nodejs',
  maxDuration: 30
};

let firestoreDb: ReturnType<typeof getFirestore> | null = null;
let firestoreInitAttempted = false;
let emailConfigured = false;
let emailInitError: string | null = null;
let firestoreInitError: string | null = null;
let firestoreEnabled = true;

function stripOuterQuotes(s: string): string {
  if (s.length >= 2) {
    const first = s.charAt(0);
    const last = s.charAt(s.length - 1);
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return s.slice(1, -1);
    }
  }
  return s;
}

function parseServiceAccount(): { parsed: ServiceAccount | null; wasProvided: boolean } {
  const envRaw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const rawProvided = typeof envRaw === 'string' && envRaw.trim().length > 0;
  if (!rawProvided) {
    return { parsed: null, wasProvided: false };
  }
  let raw = envRaw!.trim();
  raw = stripOuterQuotes(raw);
  raw = raw.replace(/\r/g, '').trim();
  try {
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== 'object') {
      throw new Error('Parsed value is not a JSON object.');
    }
    if (!obj.project_id) {
      throw new Error('Service account JSON is missing required "project_id" field.');
    }
    if (!obj.private_key) {
      throw new Error('Service account JSON is missing required "private_key" field.');
    }
    if (!obj.client_email) {
      throw new Error('Service account JSON is missing required "client_email" field.');
    }
    if (typeof obj.private_key === 'string') {
      obj.private_key = obj.private_key.replace(/\\n/g, '\n');
    }
    console.log('[Vercel /api/contact] Service account JSON parsed OK:', {
      project_id: obj.project_id,
      client_email: obj.client_email
    });
    return { parsed: obj as ServiceAccount, wasProvided: true };
  } catch (parseErr: any) {
    firestoreInitError = `FIREBASE_SERVICE_ACCOUNT_JSON is set but not valid JSON: ${parseErr?.message || parseErr}. ` +
      `Tip: In Vercel env vars, paste the RAW JSON object contents WITHOUT wrapping extra quotes.`;
    console.warn('[Vercel /api/contact]', firestoreInitError);
    console.warn('[Vercel /api/contact] Raw value preview (first 200 chars):', (envRaw || '').slice(0, 200));
    firestoreEnabled = false;
    return { parsed: null, wasProvided: true };
  }
}

function initFirestore() {
  if (firestoreInitAttempted) return firestoreDb;
  firestoreInitAttempted = true;
  if (!firestoreEnabled) {
    return null;
  }
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
    const { parsed: serviceAccount, wasProvided } = parseServiceAccount();

    if (!projectId && !serviceAccount) {
      firestoreInitError = 'FIREBASE_PROJECT_ID and FIREBASE_SERVICE_ACCOUNT_JSON are both missing. Firestore writes disabled.';
      console.warn('[Vercel /api/contact] Firestore init skipped:', firestoreInitError);
      firestoreEnabled = false;
      return null;
    }
    if (!projectId && serviceAccount?.projectId) {
      // projectId already on credential is OK, admin SDK will pick it up
    }
    if (!serviceAccount) {
      if (wasProvided) {
        firestoreInitError = firestoreInitError || 'FIREBASE_SERVICE_ACCOUNT_JSON failed to parse (see earlier log). Firestore writes disabled.';
      } else {
        firestoreInitError = 'FIREBASE_SERVICE_ACCOUNT_JSON is NOT set. Falling back to Application Default Credentials on Vercel will FAIL — Firestore writes disabled.';
      }
      console.warn('[Vercel /api/contact] Firestore disabled:', firestoreInitError);
      firestoreEnabled = false;
      return null;
    }

    if (getApps().length === 0) {
      initializeApp({
        credential: cert(serviceAccount),
        projectId: projectId || serviceAccount.projectId
      });
      console.log('[Vercel /api/contact] Firebase Admin initialized OK (with service account credential)');
    } else {
      getApp();
    }

    firestoreDb = getFirestore();
    firestoreInitError = null;
    return firestoreDb;
  } catch (err: any) {
    firestoreInitError = `Firebase Admin init failed: ${err?.message || String(err)}`;
    console.error('[Vercel /api/contact]', firestoreInitError, err);
    firestoreDb = null;
    firestoreEnabled = false;
    return null;
  }
}

function looksLikeValidSendgridKey(key: string): { ok: boolean; reason?: string } {
  const trimmed = key.trim();
  if (!trimmed.startsWith('SG.')) {
    return { ok: false, reason: `SendGrid API keys MUST start with "SG." prefix (found prefix: "${trimmed.slice(0, 6)}..."). Generate a new one from SendGrid → Settings → API Keys → Create API Key → "Full Access" or "Restricted Access: Mail Send".` };
  }
  const parts = trimmed.split('.');
  if (parts.length < 3) {
    return { ok: false, reason: `SendGrid API key should have 3 dot-separated segments (SG.<public>.<secret>). Got ${parts.length} segments.` };
  }
  const len = trimmed.length;
  if (len < 40) {
    return { ok: false, reason: `SendGrid API key looks suspiciously short (${len} chars). It is probably truncated.` };
  }
  return { ok: true };
}

function initEmail() {
  const { sendgridApiKey } = getMailDefaults();
  if (emailConfigured) return true;
  if (!sendgridApiKey) {
    emailInitError = 'SENDGRID_API_KEY env var is missing or empty.';
    console.warn('[Vercel /api/contact] SendGrid init skipped:', emailInitError);
    return false;
  }
  const trimmedKey = sendgridApiKey.trim();
  const keyCheck = looksLikeValidSendgridKey(trimmedKey);
  if (!keyCheck.ok) {
    emailInitError = `Invalid SendGrid API key format: ${keyCheck.reason} (prefix observed: "${trimmedKey.slice(0, 6)}...", length: ${trimmedKey.length})`;
    console.warn('[Vercel /api/contact] SendGrid init aborted:', emailInitError);
    return false;
  }
  try {
    sgMail.setApiKey(sendgridApiKey);
    emailConfigured = true;
    emailInitError = null;
    return true;
  } catch (err: any) {
    emailInitError = err?.message || String(err);
    console.warn('[Vercel /api/contact] SendGrid setApiKey failed:', err);
    return false;
  }
}

function formatSendGridError(err: any): Record<string, any> {
  const out: Record<string, any> = {
    message: err?.message || String(err)
  };
  if (err?.name) out.name = err.name;
  if (err?.code) out.code = err.code;
  if (typeof err?.statusCode !== 'undefined') out.statusCode = err.statusCode;
  if (typeof err?.response?.statusCode !== 'undefined') {
    out.sgStatusCode = err.response.statusCode;
  }
  if (typeof err?.response?.statusMessage !== 'undefined') {
    out.sgStatusMessage = err.response.statusMessage;
  }
  if (err?.response?.headers) {
    out.sgHeaders = {
      'x-message-id': err.response.headers['x-message-id'],
      'content-type': err.response.headers['content-type']
    };
  }
  const body = err?.response?.body;
  if (body) {
    try {
      out.sgBody = typeof body === 'string' ? JSON.parse(body) : body;
    } catch {
      out.sgBody = body;
    }
  }
  return out;
}

async function sendContactNotificationEmail(contact: {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}): Promise<{ sent: boolean; error?: any; debug?: any }> {
  const mailDefaults = getMailDefaults();
  const { contactRecipient, mailFromEmail, mailFromName, sendgridApiKey } = mailDefaults;

  const debug: any = {
    toEmail: contactRecipient,
    fromEmail: mailFromEmail,
    fromName: mailFromName,
    sendgridKeyPrefix: sendgridApiKey ? `${sendgridApiKey.trim().slice(0, 8)}...` : '(missing)'
  };

  if (!initEmail()) {
    return { sent: false, error: emailInitError, debug };
  }

  if (!mailFromEmail) {
    const err = 'MAIL_FROM/MAIL_FROM_EMAIL env var is missing — SendGrid requires a verified sender.';
    console.error('[Vercel /api/contact] Email send skipped:', err, debug);
    return { sent: false, error: err, debug };
  }

  if (!contactRecipient) {
    const err = 'MAIL_TO env var is missing — no recipient to send to.';
    console.error('[Vercel /api/contact] Email send skipped:', err, debug);
    return { sent: false, error: err, debug };
  }

  try {
    console.log('[Vercel /api/contact] Attempting SendGrid send with params:', debug);

    const [sgResponse] = await sgMail.send({
      from: { email: mailFromEmail, name: mailFromName },
      to: contactRecipient,
      replyTo: { email: contact.email, name: contact.fullName },
      subject: `Portfolio contact form: ${contact.subject}`,
      text: `New contact message from ${contact.fullName} <${contact.email}>\n\nPhone: ${contact.phone}\nSubject: ${contact.subject}\n\nMessage:\n${contact.message}\n\nSubmitted: ${contact.createdAt}`,
      html: `
        <div style="background:#0b132b;color:#e2e8f0;font-family:Arial,Helvetica,sans-serif;padding:24px;">
          <div style="max-width:600px;margin:0 auto;border:1px solid #233554;border-radius:20px;overflow:hidden;background:#111e3a;box-shadow:0 20px 60px rgba(0,0,0,.25);">
            <div style="background:linear-gradient(135deg,#0b132b 0%,#1a2d4c 100%);padding:28px 32px;text-align:center;">
              <p style="margin:0;font-size:14px;text-transform:uppercase;letter-spacing:.2em;color:#7dd3fc;">New message received</p>
              <h1 style="margin:10px 0 0;font-size:28px;color:#ffffff;">Portfolio Contact Form</h1>
            </div>
            <div style="padding:28px 32px;line-height:1.6;color:#cbd5e1;">
              <p style="margin:0 0 16px;font-size:15px;">You have a new inquiry from the website contact form. Review the message below and follow up as needed.</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
                <tr><td style="padding:12px 0;border-bottom:1px solid rgba(148,163,184,.15);font-size:13px;color:#94a3b8;width:28%;">Name</td><td style="padding:12px 0;border-bottom:1px solid rgba(148,163,184,.15);font-weight:600;color:#ffffff;">${contact.fullName}</td></tr>
                <tr><td style="padding:12px 0;border-bottom:1px solid rgba(148,163,184,.15);font-size:13px;color:#94a3b8;">Email</td><td style="padding:12px 0;border-bottom:1px solid rgba(148,163,184,.15);font-weight:600;color:#ffffff;">${contact.email}</td></tr>
                <tr><td style="padding:12px 0;border-bottom:1px solid rgba(148,163,184,.15);font-size:13px;color:#94a3b8;">Phone</td><td style="padding:12px 0;border-bottom:1px solid rgba(148,163,184,.15);font-weight:600;color:#ffffff;">${contact.phone}</td></tr>
                <tr><td style="padding:12px 0;font-size:13px;color:#94a3b8;">Subject</td><td style="padding:12px 0;font-weight:600;color:#ffffff;">${contact.subject}</td></tr>
              </table>
              <div style="background:#152a4a;border:1px solid rgba(148,163,184,.12);border-radius:16px;padding:20px;">
                <p style="margin:0 0 12px;font-size:14px;color:#7dd3fc;font-weight:700;">Message</p>
                <p style="margin:0;font-size:14px;white-space:pre-wrap;color:#e2e8f0;">${contact.message.replace(
                  /\n/g,
                  '<br>'
                )}</p>
              </div>
              <p style="margin:24px 0 0;font-size:13px;color:#94a3b8;">Received: <strong style="color:#ffffff;">${contact.createdAt}</strong></p>
            </div>
            <div style="background:#0b132b;border-top:1px solid rgba(148,163,184,.12);padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:13px;color:#7dd3fc;">Carlos Alfonso Perez</p>
              <p style="margin:6px 0 0;font-size:12px;color:#94a3b8;">Makati City, Metro Manila, Philippines</p>
            </div>
          </div>
        </div>
      `
    });

    const sgStatusCode = sgResponse?.[0]?.statusCode;
    const sgMsgId = sgResponse?.[0]?.headers?.['x-message-id'];
    console.log('[Vercel /api/contact] SendGrid send succeeded:', {
      sgStatusCode,
      sgMsgId,
      ...debug
    });

    return { sent: true, debug: { ...debug, sgStatusCode, sgMsgId } };
  } catch (err: any) {
    const formatted = formatSendGridError(err);
    console.error('[Vercel /api/contact] SendGrid FAILED:', JSON.stringify({ ...formatted, ...debug }, null, 2));
    return { sent: false, error: formatted, debug };
  }
}

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

  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    (req as any).socket?.remoteAddress ||
    '127.0.0.1';

  const { errors, values } = validateContact(req.body);
  if (Object.keys(errors).length > 0) {
    return json(res, 400, {
      success: false,
      message: 'Validation failed. Please correct highlighted fields.',
      errors
    });
  }

  const cleanFullName = sanitizeInput(values.fullName);
  const cleanEmail = sanitizeInput(values.email);
  const cleanPhone = sanitizeInput(values.phone);
  const cleanSubject = sanitizeInput(values.subject);
  const cleanMessage = sanitizeInput(values.message);

  const timestampStr = new Date().toISOString();
  const auditHash = crypto
    .createHash('sha256')
    .update(`${cleanEmail}-${timestampStr}-${clientIp}`)
    .digest('hex');

  const contactDoc = {
    fullName: cleanFullName,
    email: cleanEmail,
    phone: cleanPhone,
    subject: cleanSubject,
    message: cleanMessage,
    auditHash,
    clientIpHash: crypto.createHash('sha256').update(clientIp).digest('hex'),
    createdAt: timestampStr
  };

  let savedToFirestore = false;
  let firestoreError: string | null = firestoreInitError;
  let emailSent = false;
  let emailError: any = emailInitError ? { init: emailInitError } : undefined;
  let emailDebug: any = undefined;

  try {
    const db = initFirestore();
    if (db) {
      await db.collection('contacts').add({
        ...contactDoc,
        timestamp: FieldValue.serverTimestamp()
      });
      savedToFirestore = true;
    } else if (firestoreInitError) {
      firestoreError = firestoreInitError;
    }
  } catch (dbErr: any) {
    firestoreError = dbErr?.message || String(dbErr);
    console.error('[Vercel /api/contact] Firestore save failed:', dbErr);
  }

  try {
    const result = await sendContactNotificationEmail({
      fullName: cleanFullName,
      email: cleanEmail,
      phone: cleanPhone,
      subject: cleanSubject,
      message: cleanMessage,
      createdAt: timestampStr
    });
    emailSent = result.sent;
    if (result.error) emailError = result.error;
    if (result.debug) emailDebug = result.debug;
  } catch (emailErr: any) {
    emailError = { unexpected: emailErr?.message || String(emailErr) };
    console.error('[Vercel /api/contact] Unexpected email send error:', emailErr);
  }

  const isDev = process.env.NODE_ENV === 'development';

  const userMessage = savedToFirestore
    ? emailSent
      ? "Thanks! Your message was received and I'll review it shortly."
      : "Thanks! Your message was saved. However, the email notification could not be sent right now — I will still review the submission shortly."
    : emailSent
      ? "Thanks! Your message was received and I'll review it shortly."
      : 'Thanks! Your message was submitted. If you do not hear back within 24 hours, please email me directly at alfonso.cperez08@gmail.com.';

  const responseBody: any = {
    success: true,
    message: userMessage,
    savedToFirestore,
    emailSent
  };

  if (firestoreError) responseBody.firestoreError = firestoreError;
  if (emailError) responseBody.emailError = isDev ? emailError : (typeof emailError === 'string' ? emailError : emailError?.message || 'Email send failed.');
  if (isDev) {
    responseBody.debug = {
      email: emailDebug
    };
  }

  return json(res, 200, responseBody);
}
