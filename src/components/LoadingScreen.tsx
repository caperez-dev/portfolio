import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, CheckCircle2, Cpu, Shield, Code2 } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const logs = [
    "INITIALIZING_PORTFOLIO_SYSTEMS...",
    "LOADING_CARLOS_PEREZ_RESUME_DATA...",
    "CONNECTING_FIREBASE_FIRESTORE...",
    "SECURING_API_ROUTES_WITH_RATE_LIMITS...",
    "OPTIMIZING_REACT_AND_MOTION_COMPONENTS...",
    "PORTFOLIO_READY"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 400);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (progress < 20) setStep(0);
    else if (progress < 40) setStep(1);
    else if (progress < 60) setStep(2);
    else if (progress < 80) setStep(3);
    else if (progress < 95) setStep(4);
    else setStep(5);
  }, [progress]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.6 } }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0b132b] text-slate-100 font-mono px-4 select-none"
      >
        <div className="w-full max-w-md p-6 bg-[#1c2541] border border-[#3a506b]/60 rounded-2xl shadow-2xl shadow-cyan-950/40">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#3a506b]/40">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
              <Terminal className="w-4 h-4 animate-pulse" />
              <span>CARLOS_PEREZ_OS v2.6</span>
            </div>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
          </div>

          <div className="space-y-3 text-xs mb-6 min-h-[140px] flex flex-col justify-center">
            {logs.slice(0, step + 1).map((log, index) => (
              <motion.div
                key={log}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-2 ${
                  index === step ? 'text-cyan-300 font-bold' : 'text-slate-400'
                }`}
              >
                {index < step ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Code2 className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" />
                )}
                <span className="truncate">&gt; {log}</span>
              </motion.div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>BOOT_SEQUENCE</span>
              <span className="text-cyan-400 font-bold">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-[#0b132b] rounded-full overflow-hidden p-0.5 border border-[#3a506b]/50">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#3a506b]/30 flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" /> Security Active
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-400" /> UST IT Cum Laude
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
