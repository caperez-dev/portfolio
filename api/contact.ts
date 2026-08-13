import type { VercelRequest, VercelResponse } from '@vercel/node';
import sgMail from '@sendgrid/mail';
import crypto from 'crypto';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  getMailDefaults,
  json,
  sanitizeInput,
  validateContact
} from './_shared';

export const config = {
  runtime: 'nodejs',
  maxDuration: 30
};

let firestoreDb: any = null;
let emailConfigured = false;

function initFirestore() {
  if (firestoreDb) return firestoreDb;
  try {
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID
    };

    if (firebaseConfig.apiKey && firebaseConfig.projectId) {
      const firebaseApp = initializeApp(firebaseConfig);
      firestoreDb = getFirestore(firebaseApp);
    }
  } catch (err) {
    console.warn('[Vercel /api/contact] Firestore init notice:', err);
    firestoreDb = null;
  }
  return firestoreDb;
}

function initEmail() {
  const { sendgridApiKey } = getMailDefaults();
  if (sendgridApiKey && !emailConfigured) {
    try {
      sgMail.setApiKey(sendgridApiKey);
      emailConfigured = true;
    } catch (err) {
      console.warn('[Vercel /api/contact] SendGrid init notice:', err);
    }
  }
  return emailConfigured;
}

async function sendContactNotificationEmail(contact: {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}): Promise<boolean> {
  if (!initEmail()) return false;
  const { contactRecipient, mailFromEmail, mailFromName } = getMailDefaults();

  try {
    await sgMail.send({
      from: { email: mailFromEmail, name: mailFromName },
      to: contactRecipient,
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
    return true;
  } catch (err: any) {
    console.error(
      '[Vercel /api/contact] Failed to send email:',
      err?.response?.body || err?.message || err
    );
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

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
  let emailSent = false;

  try {
    const db = initFirestore();
    if (db) {
      await addDoc(collection(db, 'contacts'), {
        ...contactDoc,
        timestamp: serverTimestamp()
      });
      savedToFirestore = true;
    }
  } catch (dbErr) {
    console.error('[Vercel /api/contact] Firestore save failed:', dbErr);
  }

  try {
    emailSent = await sendContactNotificationEmail({
      fullName: cleanFullName,
      email: cleanEmail,
      phone: cleanPhone,
      subject: cleanSubject,
      message: cleanMessage,
      createdAt: timestampStr
    });
  } catch (emailErr) {
    console.error('[Vercel /api/contact] Email send error:', emailErr);
  }

  const userMessage = savedToFirestore
    ? emailSent
      ? "Thanks! Your message was received and I'll review it shortly."
      : "Thanks! Your message was received. I'll review it shortly, even though email notification could not be sent right now."
    : 'Thanks! Your message was sent successfully.';

  return json(res, 200, {
    success: true,
    message: userMessage,
    savedToFirestore,
    emailSent
  });
}
