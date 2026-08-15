import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, Sparkles, ArrowRight, MapPin } from 'lucide-react';
import { resumeData } from '../data/resume';
import { generateResumePDF } from '../utils/pdfGenerator';
import { ThemeOption } from '../types';

interface HeroBannerProps {
  currentTheme: ThemeOption;
  isDarkMode: boolean;
  onOpenChat: () => void;
}

const TYPEWRITER_WORDS = ['Full-Stack Developer', 'Freelancer'];

export function HeroBanner({ currentTheme, isDarkMode, onOpenChat }: HeroBannerProps) {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const targetWord = TYPEWRITER_WORDS[wordIdx];
    let timer: NodeJS.Timeout;

    if (!isDeleting && displayedText === targetWord) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayedText === '') {
      setIsDeleting(false);
      setWordIdx((prev) => (prev + 1) % TYPEWRITER_WORDS.length);
    } else {
      const speed = isDeleting ? 45 : 95;
      timer = setTimeout(() => {
        setDisplayedText((prev) =>
          isDeleting
            ? targetWord.substring(0, prev.length - 1)
            : targetWord.substring(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, wordIdx]);

  const easeOutExpo = [0.22, 1, 0.36, 1] as const;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: easeOutExpo,
      },
    },
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden cursor-default select-none pt-20 pb-12 sm:pt-24 sm:pb-16 scroll-mt-16 bg-black"
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:22px_22px] opacity-60" />

      <div
        className="pointer-events-none absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, #ff9500 0%, #ffb340 50%, transparent 70%)',
          animation: 'float-slow 8s ease-in-out infinite',
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-32 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, #ffb340 0%, #ff9500 50%, transparent 70%)',
          animation: 'float-slow 10s ease-in-out infinite reverse',
        }}
      />

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -15px) scale(1.05); }
          66% { transform: translate(-10px, 10px) scale(0.98); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 149, 0, 0.7); }
          50% { opacity: 0.7; transform: scale(1.15); box-shadow: 0 0 0 8px rgba(255, 149, 0, 0); }
        }
        @keyframes pulse-icon-3s {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.08); }
        }
        .pulse-dot {
          animation: pulse-dot 2.2s ease-in-out infinite;
        }
        .pulse-icon-3s {
          animation: pulse-icon-3s 3s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-left">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-2 mb-6"
        >
          <motion.p variants={itemVariants} className="text-2xl font-semibold tracking-tight text-[#ff9500]">
            Hi, my name is
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-none text-white drop-shadow-sm"
            style={{ fontWeight: 800, letterSpacing: '-0.03em' }}
          >
            Carlos Alfonso Perez.
          </motion.h1>

          <motion.div variants={itemVariants} className="text-lg sm:text-2xl font-medium flex items-center h-7 sm:h-9 my-1 text-[#ff9500]/90">
            <span className="tracking-wide">{displayedText}</span>
            <span className="inline-block w-3 sm:w-4 h-[3px] bg-[#ff9500] animate-pulse ml-1 rounded-full self-end mb-1.5" />
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-outfit leading-tight bg-gradient-to-r from-white via-white to-[#ff9500] bg-clip-text text-transparent"
            style={{ fontWeight: 900 }}
          >
            I build websites for you.
          </motion.h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: easeOutExpo }}
          className="text-base sm:text-xl font-medium max-w-3xl mb-3 leading-relaxed text-slate-300"
        >
          {resumeData.punchingStatement}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: easeOutExpo }}
          className="flex items-center gap-2 mb-4 text-sm text-[#ff9500] font-medium tracking-wide"
        >
          <MapPin className="w-4 h-4 text-[#ff9500]" />
          <span>{resumeData.contact.location}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: easeOutExpo }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#ff9500]/30 bg-[#ff9500]/10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff9500] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff9500] pulse-dot"></span>
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-white/90">Available for work</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.72, ease: easeOutExpo }}
          className="flex flex-wrap items-center gap-4"
        >
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              const projectsEl = document.querySelector('#projects');
              if (projectsEl) {
                projectsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="px-6 py-3.5 rounded-2xl font-bold text-sm text-black shadow-2xl shadow-[#ff9500]/25 transition-all duration-300 flex items-center gap-2 hover:-translate-y-1 active:scale-95 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #ff9500 0%, #ffb340 100%)' }}
          >
            <span>Explore Projects</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            onClick={generateResumePDF}
            className="px-6 py-3.5 rounded-2xl font-bold text-sm border border-white/12 bg-white/[0.04] backdrop-blur-xl text-white hover:bg-white/[0.08] transition-all duration-300 flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#ff9500]" />
            <span>Download Resume</span>
          </button>

          <button
            onClick={onOpenChat}
            className="px-5 py-3.5 rounded-2xl font-medium text-sm text-[#ff9500] border border-[#ff9500]/30 bg-[#ff9500]/10 hover:bg-[#ff9500]/18 transition-all duration-300 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#ff9500] pulse-icon-3s" />
            <span>Ask AI Assistant</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
