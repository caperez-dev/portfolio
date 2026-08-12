import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, ShieldCheck, Database, Key, Globe, Terminal, Code2, Lock } from 'lucide-react';
import { ThemeOption } from '../types';

interface TechStackGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeOption;
  isDarkMode: boolean;
}

export function TechStackGuideModal({
  isOpen,
  onClose,
  currentTheme,
  isDarkMode
}: TechStackGuideModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`w-full max-w-3xl max-h-[85vh] rounded-2xl border shadow-2xl overflow-hidden flex flex-col ${
            isDarkMode
              ? 'bg-slate-900 border-slate-700 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950 text-white">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-mono">Tech Stack & Deployment Activation Guide</h3>
                <p className="text-xs text-slate-400">Vercel Setup, Firebase Firestore Activation & Security Specs</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto space-y-6 text-xs font-sans leading-relaxed">
            {/* 1. Vercel Deployment Instructions */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
              <div className="flex items-center gap-2 font-mono font-bold text-cyan-400 text-sm">
                <Globe className="w-4 h-4" />
                <span>1. Deploying on Vercel</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                <li>Push this repository to your personal GitHub account (`github.com/carlos-perez/portfolio`).</li>
                <li>Go to <strong>Vercel Dashboard</strong> &rarr; Click <strong>New Project</strong> &rarr; Import your repository.</li>
                <li>Set the Framework Preset to <strong>Vite</strong> or <strong>Other</strong>.</li>
                <li>In <strong>Environment Variables</strong> on Vercel, add:
                  <ul className="list-disc list-inside ml-4 mt-1 font-mono text-[11px] text-cyan-300 space-y-0.5">
                    <li>`GEMINI_API_KEY`: Your Gemini API Key from Google AI Studio</li>
                    <li>`FIREBASE_API_KEY`: Your Firebase project API key</li>
                    <li>`FIREBASE_PROJECT_ID`: Your Firebase project ID</li>
                  </ul>
                </li>
                <li>Click <strong>Deploy</strong>. Vercel will build the frontend and serve API routes automatically.</li>
              </ol>
            </div>

            {/* 2. Firebase Firestore Activation Instructions */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
              <div className="flex items-center gap-2 font-mono font-bold text-amber-400 text-sm">
                <Database className="w-4 h-4" />
                <span>2. Activating Firebase Firestore (Contact Submissions)</span>
              </div>
              <p className="text-slate-300">
                Firestore handles secure, encrypted storage for contact inquiries and audit logs.
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">Firebase Console</a> and create a project named <code className="text-cyan-300 font-mono">carlos-portfolio</code>.</li>
                <li>Navigate to <strong>Build &gt; Firestore Database</strong> &rarr; Click <strong>Create Database</strong>.</li>
                <li>Choose <strong>Start in production mode</strong> and select a Firestore region (e.g., `asia-east1`).</li>
                <li>In Project Settings &gt; Web App, copy your Firebase config values and add them to your <code className="text-cyan-300 font-mono">.env</code> or Vercel environment variables.</li>
              </ol>
            </div>

            {/* 3. Security Specifications Implemented */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
              <div className="flex items-center gap-2 font-mono font-bold text-emerald-400 text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>3. Implemented Security & Validation Architecture</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300 pt-1">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Rate Limiting
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Tracks client IP addresses on Express backend. Caps submissions at max 5 messages per 15 minutes.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Anti-SQLi & XSS
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Sanitizes all string parameters, escaping HTML characters (`&lt; &gt; &quot; &#x27;`) and preventing injection vectors.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Field Validation
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Server-side regex checks for RFC 5322 emails and phone formats before accepting data.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> SHA-256 Hashing
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Generates a cryptographic hash for each submission audit log combining timestamp and client signature.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Grounded AI Assistant Specs */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
              <div className="flex items-center gap-2 font-mono font-bold text-cyan-400 text-sm">
                <Code2 className="w-4 h-4" />
                <span>4. Grounded Gemini AI Assistant</span>
              </div>
              <p className="text-slate-300">
                The AI chat backend at <code className="text-cyan-300 font-mono">/api/chat</code> uses `@google/genai` with a strict grounding system prompt. It ONLY uses facts from Carlos's provided resume (UST Cum Laude, Henkel internship, 6 projects, certifications) and strictly declines to invent fabricated details.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">Carlos Alfonso B. Perez &bull; Portfolio</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs font-mono transition-all"
            >
              Close Guide
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
