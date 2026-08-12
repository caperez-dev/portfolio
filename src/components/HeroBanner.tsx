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

const TYPEWRITER_WORDS = ['Full-Stack Developer', "It's Freelancer"];

export function HeroBanner({ currentTheme, isDarkMode, onOpenChat }: HeroBannerProps) {
  // Typewriter state
  const [wordIdx, setWordIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect loop
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

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden cursor-default select-none pt-20 pb-12 sm:pt-24 sm:pb-16 scroll-mt-16"
    >
      {/* Background Decorative Tech Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Ambient Pulsing Glow Blob */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-left">
        {/* Required Banner Headline Copy */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-2 mb-6"
        >
          <p className="text-xl sm:text-2xl font-mono font-semibold text-cyan-500">
            Hi, my name is
          </p>
          <h1
            className={`text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none ${
              isDarkMode ? currentTheme.darkText : currentTheme.lightText
            }`}
          >
            Carlos Alfonso Perez.
          </h1>

          {/* Typewriter Effect Text */}
          <div className="text-lg sm:text-2xl font-medium font-mono text-cyan-400/90 flex items-center h-7 sm:h-9 my-1">
            <span className="tracking-wide">{displayedText}</span>
            <span className="inline-block w-3 sm:w-4 h-[3px] bg-cyan-400 animate-pulse ml-1 rounded-full self-end mb-1.5" />
          </div>

          <h2 className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold font-outfit tracking-tight leading-tight ${
            isDarkMode
              ? 'bg-gradient-to-r from-slate-300 via-slate-100 to-cyan-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-slate-800 via-slate-700 to-cyan-600 bg-clip-text text-transparent'
          }`}>
            I build websites for you.
          </h2>
        </motion.div>

        {/* Punching Statement */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-base sm:text-xl font-medium max-w-3xl mb-3 leading-relaxed ${
            isDarkMode ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          {resumeData.punchingStatement}
        </motion.p>

        {/* Location Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex items-center gap-2 mb-8 text-xs sm:text-sm font-mono text-cyan-400 font-semibold tracking-wide"
        >
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>{resumeData.contact.location}</span>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
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
            className="px-6 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
            style={{ backgroundColor: isDarkMode ? currentTheme.darkAccent : currentTheme.lightAccent }}
          >
            <span>Explore Projects</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            onClick={generateResumePDF}
            className={`px-6 py-3.5 rounded-xl font-bold text-sm border transition-all flex items-center gap-2 ${
              isDarkMode
                ? 'border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800'
                : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Download Resume</span>
          </button>

          <button
            onClick={onOpenChat}
            className="px-5 py-3.5 rounded-xl font-medium text-sm text-cyan-400 border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
            <span>Ask AI Assistant</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
