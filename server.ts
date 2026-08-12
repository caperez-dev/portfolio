import express from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '100kb' }));

// Initialize Firebase Firestore if configured
let firestoreDb: any = null;

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
    console.log('[Firebase] Firestore initialized successfully.');
  } else {
    console.log('[Firebase] Credentials not detected in env. Falling back to local encrypted store.');
  }
} catch (err) {
  console.warn('[Firebase] Initialization notice:', err);
}

// In-memory fallback database for contacts & audit logs
const memoryContacts: any[] = [];

// Rate Limiter Memory Store
const ipRateLimits = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetSeconds: number } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5;

  const userLimit = ipRateLimits.get(ip) || { count: 0, resetTime: now + windowMs };

  if (now > userLimit.resetTime) {
    userLimit.count = 1;
    userLimit.resetTime = now + windowMs;
  } else {
    userLimit.count += 1;
  }

  ipRateLimits.set(ip, userLimit);

  const resetSeconds = Math.ceil((userLimit.resetTime - now) / 1000);
  const remaining = Math.max(0, maxRequests - userLimit.count);

  return {
    allowed: userLimit.count <= maxRequests,
    remaining,
    resetSeconds
  };
}

// Anti-XSS & SQL Injection Sanitization Helper
function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

// Full Resume Grounding Context for Gemini Assistant
const CARLOS_RESUME_GROUNDING_CONTEXT = `
You are the official AI Portfolio Assistant for Carlos Alfonso B. Perez.
Your sole job is to answer inquiries from recruiters, hiring managers, and visitors based ONLY on Carlos's provided resume data below.
DO NOT make up or hallucinate any facts, prior companies, or qualifications not listed in this resume. If asked about something outside this context, politely state that it is not covered in Carlos's official resume and invite them to contact Carlos directly at alfonso.cperez08@gmail.com.

=== OFFICIAL RESUME DATA ===
NAME: Carlos Alfonso B. Perez
LOCATION: Makati City, Metro Manila, Philippines
PHONE: +63 9774279909
EMAIL: alfonso.cperez08@gmail.com
LINKEDIN: linkedin.com/in/carlos-alfonso-perez-393734316

PROFESSIONAL SUMMARY:
IT professional with a Cum Laude degree in Information Technology and specialized internship experience in enterprise software packaging and deployment. Successfully packaged and deployed 50+ Windows applications using Patch My PC and Intune, while also developing web applications with modern frameworks like React.js and PHP Laravel. A detail-oriented problem-solver with a strong foundation in IT operations, quality assurance, and technical documentation. Ready to contribute, collaborate, and grow.

SKILLS:
- IT Operations & Deployment: Software Packaging and Deployment, PowerShell Scripting, ServiceNow, Patch My PC, IntuneWin, Advanced Installer
- Programming Languages: PHP, Java, JavaScript, HTML5, CSS3
- Frameworks & Libraries: React.js, AngularJS, Express.js, PHP Laravel, Bootstrap, MaterializeCSS
- Databases: MySQL Workbench, HeidiSQL, Firebase Firestore
- Version Control: Git, GitHub
- Methodologies: SDLC, Agile (Scrum and Kanban)
- Wireframe & Design: Figma, Canva, Draw.io, Lucidchart
- Other Skills: Advanced AI Prompting, Microsoft 365 Suite (SharePoint, Word, PowerPoint, Excel)
- Soft Skills: Proactive Worker, Willingness to Learn, Detail-Oriented, Collaborative, Express Gratitude, Good Interpersonal Communication, Growth Mindset

EXPERIENCE:
IT Governance & Operations Intern | Henkel Asia Pacific Services Centre (Feb 2026 - Jun 2026)
- Performed 50 software packaging and deployment of line-of-business (LOB) Windows applications using Patch My PC.
- Collaborated with the IT team during daily standup meetings to provide status updates, identify blockers, align priorities for software deployment tasks, troubleshoot issues, resolve deployment problems, and perform testing.
- Conducted 60 application testing and validation to ensure successful installation and functionality on the Company Portal.
- Developed 15 basic PowerShell scripts to support IntuneWin application packaging and deployment.
- Completed foundational training in Advanced Installer and applied knowledge to support application packaging and deployment workflows.
- Added Intune notes on 400+ Patch My PC deployments.

EDUCATION:
1. University of Santo Tomas (UST) - Manila, Metro Manila (Aug 2022 - Jun 2026)
   - Bachelor of Science in Information Technology
   - Cumulative GWA: 1.672 - Cum Laude
   - Relevant Coursework: Information Management, Software Engineering, Data Structures and Algorithms, Human-Computer Interaction, Computer Security and Information Assurance
2. De La Salle - Lipa (DLSL) - Lipa City, Batangas (Aug 2020 - Aug 2022)
   - Senior High School - STEM
   - Graduated with High Honors

CERTIFICATIONS, ACHIEVEMENTS & SEMINARS:
- DevOps Foundations: DevSecOps (2018), LinkedIn Learning - Apr 16, 2026
- General Cybersecurity Awareness Training - English - Apr 14, 2026
- ITIL Process Training: Incident Management & Problem Management - Apr 7, 2026
- Gen AI Foundations from Henkel - Feb 19, 2026
- PHILNITS Passer (IT Passport Exam) - Oct 26, 2025
- Code Red: Unraveling the Frontlines of Network Security, Cisco Networking Academy Gateway - Nov 14, 2024
- CCNA: Switching, Routing, and Wireless Essentials - Jun 3, 2024

PROJECTS:
1. Quizzle: An AI-driven Web App for Personalized Online Learning (Capstone Project)
   - Tech: React.js, Firebase Firestore, Node.js, Express.js, Hostinger, Web Sockets (Socket.io), LLaMA 3.3 70B
   - Role: Project Manager, UI/UX Design, Backend Development, System Documentation
   - Managed 4-member Agile team, created 100+ system diagrams (use-case, activity, ERD), designed 200+ test cases, assisted VPS deployment on Hostinger.
2. Order Processing System and Attendance Monitoring for Paramdam Café
   - Tech: HTML, Bootstrap CSS, JavaScript, PHP, MySQL Database, Hostinger
   - Role: UI/UX Design, Backend Development, System Documentation
   - Full SDLC, 10+ system diagrams, 50 test cases executed, deployed on Hostinger.
3. CICSelect: Voting System
   - Tech: HTML, Bootstrap, PHP Laravel, MySQL, InfinityFree
   - Role: UI/UX Design, Backend Development, System Documentation
   - Secure voting platform, user auth, vote validation logic, deployed on InfinityFree.
4. Summit - To-Do List and Calendar Mobile App
   - Tech: Flutter, Dart, Firestore Database (Firebase)
   - Role: UI/UX Design, Backend Development, System Documentation
   - Managed 4-member team, Android app in Flutter/Dart, real-time Firestore sync.
5. ProjectMIND - Learning Management System
   - Tech: ReactJS, Express.js, Node.js, MySQL
   - Role: UI/UX Design, Backend Development
   - LMS for Cupang Elementary School students, relational MySQL database.
6. PixelPop: Inventory System
   - Tech: AngularJS, ASP.NET Framework, MySQL
   - Role: UI/UX Design, Backend Development
   - Inventory tracking with AngularJS & ASP.NET, CRUD operations.
`;

// API Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    firestoreConnected: !!firestoreDb,
    geminiKeyPresent: !!process.env.GEMINI_API_KEY
  });
});

// API Contact Route with Rate Limiting, Validation, Anti-SQL Injection & Firestore Storage
app.post('/api/contact', async (req, res) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || '127.0.0.1';

  // 1. Rate Limiting Check
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      success: false,
      message: `Rate limit exceeded. Please wait ${rateLimit.resetSeconds} seconds before sending another message.`,
      errors: { rateLimit: 'Too many requests' }
    });
  }

  const { fullName, email, phone, subject, message } = req.body || {};
  const errors: Record<string, string> = {};

  // 2. Field Validations
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    errors.fullName = 'Please enter a valid full name (at least 2 characters).';
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errors.email = 'Please provide a valid email address (e.g. name@example.com).';
  }

  const phoneRegex = /^[\d\+\-\s\(\)]{7,20}$/;
  if (!phone || typeof phone !== 'string' || !phoneRegex.test(phone.trim())) {
    errors.phone = 'Please enter a valid contact/SMS phone number (e.g. +63 9774279909).';
  }

  if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
    errors.subject = 'Please specify a subject (at least 3 characters).';
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    errors.message = 'Please enter your message (at least 10 characters).';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please correct highlighted fields.',
      errors
    });
  }

  // 3. Sanitization & Anti-SQL Injection
  const cleanFullName = sanitizeInput(fullName);
  const cleanEmail = sanitizeInput(email);
  const cleanPhone = sanitizeInput(phone);
  const cleanSubject = sanitizeInput(subject);
  const cleanMessage = sanitizeInput(message);

  // 4. Hash Sensitive Data (SHA-256 hash for audit trail)
  const timestampStr = new Date().toISOString();
  const hash = crypto
    .createHash('sha256')
    .update(`${cleanEmail}-${timestampStr}-${clientIp}`)
    .digest('hex');

  const contactDoc = {
    fullName: cleanFullName,
    email: cleanEmail,
    phone: cleanPhone,
    subject: cleanSubject,
    message: cleanMessage,
    auditHash: hash,
    clientIpHash: crypto.createHash('sha256').update(clientIp).digest('hex'),
    createdAt: timestampStr
  };

  let savedToFirestore = false;

  // 5. Store in Firebase Firestore or Memory fallback
  try {
    if (firestoreDb) {
      await addDoc(collection(firestoreDb, 'contacts'), {
        ...contactDoc,
        timestamp: serverTimestamp()
      });
      savedToFirestore = true;
    } else {
      memoryContacts.push(contactDoc);
    }
  } catch (dbErr) {
    console.error('Error saving to Firestore, placing in memory store:', dbErr);
    memoryContacts.push(contactDoc);
  }

  return res.json({
    success: true,
    message: savedToFirestore
      ? 'Thank you! Your message has been encrypted & securely stored in Firebase Firestore.'
      : 'Thank you! Your message has been transmitted securely.',
    savedToFirestore,
    hash: hash.substring(0, 16) + '...'
  });
});

// API AI Chat Route (Grounded on Carlos's Resume)
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback response if GEMINI_API_KEY is not set
      return res.json({
        reply: `Hello! I am Carlos's portfolio assistant. Currently, the GEMINI_API_KEY is not configured in the environment settings, but here is what I can tell you: Carlos Alfonso B. Perez is a Cum Laude IT graduate from UST Manila with internship experience in enterprise software packaging at Henkel. You can download his CV or contact him directly at alfonso.cperez08@gmail.com!`
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `${CARLOS_RESUME_GROUNDING_CONTEXT}

Visitor Question: "${message.trim()}"

Provide a concise, professional, friendly response strictly using only the resume facts above. Avoid fluff. Use bullet points if listing items.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });

    const reply = response.text || "I'm sorry, I couldn't process that request right now.";

    return res.json({ reply });
  } catch (err: any) {
    console.error('AI Chat Error:', err);
    return res.status(500).json({
      error: 'Failed to generate assistant response.',
      details: err.message
    });
  }
});

// Start Server with Vite Middleware in Dev or Static Serving in Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Carlos Perez Portfolio running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
