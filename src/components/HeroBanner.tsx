import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Paperclip, ArrowRight, MapPin } from 'lucide-react';
import { resumeData } from '../data/resume';
import { generateResumePDF } from '../utils/pdfGenerator';
import { scrollToSection } from '../utils/scrollToSection';
import { ThemeOption } from '../types';
import portraitSrc from '../assets/Perez, Carlos Alfonso B (IT) - No Logo.png';
import brandingSrc from '../assets/carlos branding.png';

interface HeroBannerProps {
  currentTheme: ThemeOption;
  isDarkMode: boolean;
}

interface StatBlockProps {
  value: string | number;
  label: string;
}

function StatBlock({ value, label }: StatBlockProps) {
  return (
    <div className="flex flex-col items-start gap-0.5">
      <div className="font-extrabold leading-none text-white" style={{ letterSpacing: '-0.03em', fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>
        {value}
      </div>
      <div className="text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </div>
    </div>
  );
}

const TYPEWRITER_WORDS = ['Full-Stack Developer', 'Freelancer'];

export function HeroBanner({ currentTheme, isDarkMode }: HeroBannerProps) {
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
      {/* Dot grid background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:22px_22px] opacity-60" />

      {/* Ambient blobs */}
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
        .pulse-dot {
          animation: pulse-dot 2.2s ease-in-out infinite;
        }
        .portrait-flip-container {
          perspective: 1000px;
        }
        .portrait-flip-card {
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.65s cubic-bezier(0.4, 0.2, 0.2, 1);
        }
        .portrait-flip-container:hover .portrait-flip-card {
          transform: rotateY(180deg);
        }
        .portrait-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 1.5rem;
          overflow: hidden;
        }
        .portrait-back {
          transform: rotateY(180deg);
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-4 lg:px-6 relative z-10 w-full">
        {/* Two-column layout: text left, portrait right */}
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">

          {/* ── LEFT: Text content — 60% of row on desktop ── */}
          <div className="flex-[6] min-w-0 text-left w-full">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-2 mb-6"
            >
              <motion.p variants={itemVariants} className="text-2xl font-semibold tracking-tight text-[#ff9500]">
                Hi, I'm
              </motion.p>

              <motion.h1
                variants={itemVariants}
                className="font-extrabold leading-none text-white drop-shadow-sm whitespace-nowrap"
                style={{
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  fontSize: 'clamp(1.75rem, 5vw, 4.5rem)',
                }}
              >
                Carlos Perez.
              </motion.h1>

              {/* Typewriter line — font-mono for that coding terminal feel */}
              <motion.div
                variants={itemVariants}
                className="text-lg sm:text-2xl font-medium flex items-center h-7 sm:h-9 my-1 text-[#ff9500]/90"
              >
                <span className="font-mono tracking-wide">{displayedText}</span>
                {/* Blinking cursor — vertical bar, matches monospace aesthetic */}
                <span className="inline-block w-[2px] h-[1.1em] bg-[#ff9500] ml-0.5 self-center animate-[blink_1s_step-end_infinite] rounded-sm" />
                <style>{`
                  @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                  }
                `}</style>
              </motion.div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: easeOutExpo }}
              className="text-base sm:text-xl font-medium max-w-2xl mb-3 leading-relaxed text-slate-300"
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
                  void scrollToSection('projects');
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
                <Paperclip className="w-4 h-4 text-[#ff9500]" />
                <span>My Resume</span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.82, ease: easeOutExpo }}
              className="mt-7 flex items-center gap-8"
            >
              <StatBlock value={resumeData.projects.length} label="Projects" />
            </motion.div>
          </div>

          {/* ── RIGHT: Portrait — 40% of row on desktop ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: easeOutExpo }}
            className="flex-[4] flex-shrink-0 w-48 sm:w-64 lg:w-auto"
          >
            {/* Flip card container */}
            <div className="portrait-flip-container">
              {/* The flip card — shadow and ring are ON the card so they flip with it */}
              <div
                className="portrait-flip-card w-full"
                style={{
                  boxShadow: '0 0 40px rgba(255, 149, 0, 0.22), 0 0 80px rgba(255, 149, 0, 0.10)',
                  borderRadius: '1.5rem',
                }}
              >
                {/* Front: portrait photo */}
                <div className="portrait-face portrait-front">
                  <img
                    src={portraitSrc}
                    alt="Carlos Perez"
                    className="w-full h-full object-cover block"
                    style={{ aspectRatio: '4/5' }}
                    draggable={false}
                  />
                  {/* Accent ring on front */}
                  <div
                    className="absolute inset-0 rounded-3xl pointer-events-none z-10"
                    style={{ boxShadow: 'inset 0 0 0 1.5px rgba(255, 149, 0, 0.25)' }}
                  />
                </div>

                {/* Back: brand logo */}
                <div
                  className="portrait-face portrait-back flex items-center justify-center"
                  style={{ backgroundColor: '#111111', aspectRatio: '4/5' }}
                >
                  <img
                    src={brandingSrc}
                    alt="Carlos Perez branding"
                    className="w-4/5 h-4/5 object-contain"
                    draggable={false}
                  />
                  {/* Accent ring on back */}
                  <div
                    className="absolute inset-0 rounded-3xl pointer-events-none z-10"
                    style={{ boxShadow: 'inset 0 0 0 1.5px rgba(255, 149, 0, 0.25)' }}
                  />
                </div>

                {/* Invisible spacer so the container has the right height */}
                <img
                  src={portraitSrc}
                  alt=""
                  aria-hidden="true"
                  className="w-full block invisible"
                  style={{ aspectRatio: '4/5' }}
                  draggable={false}
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
