/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, lazy, Suspense, type MouseEvent, type ReactNode } from 'react';
import { developerThemes } from './data/themes';
import { ThemeOption } from './types';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { FloatingSidebar } from './components/FloatingSidebar';
import { HeroBanner } from './components/HeroBanner';
import { resumeData } from './data/resume';
import { Code2, ArrowUp, Sparkles, ShieldCheck, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ProjectsSection = lazy(() =>
  import('./components/ProjectsSection').then((mod) => ({ default: mod.ProjectsSection }))
);
const SkillsSection = lazy(() =>
  import('./components/SkillsSection').then((mod) => ({ default: mod.SkillsSection }))
);
const ExperienceSection = lazy(() =>
  import('./components/ExperienceSection').then((mod) => ({ default: mod.ExperienceSection }))
);
const CertificationsSection = lazy(() =>
  import('./components/CertificationsSection').then((mod) => ({ default: mod.CertificationsSection }))
);
const ContactSection = lazy(() =>
  import('./components/ContactSection').then((mod) => ({ default: mod.ContactSection }))
);
const AIChatAssistant = lazy(() =>
  import('./components/AIChatAssistant').then((mod) => ({ default: mod.AIChatAssistant }))
);

function LazySection({
  children,
  rootMargin = '0px 0px 320px 0px',
  placeholder,
}: {
  children: ReactNode;
  rootMargin?: string;
  placeholder: ReactNode;
}) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible || !sectionRef.current || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.04 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div ref={sectionRef} className="min-h-[520px] relative">
      <AnimatePresence mode="wait">
        {isVisible ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 48, filter: 'blur(14px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              staggerChildren: 0.06,
            }}
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[520px]"
          >
            {placeholder}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const currentTheme = developerThemes[0];
  const isDarkMode = true;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [pointerPosition, setPointerPosition] = useState({ x: 50, y: 50 });
  const pointerRef = useRef({ x: 50, y: 50 });
  const rafRef = useRef<number | null>(null);

  const handlePointerMove = (event: MouseEvent<HTMLDivElement>) => {
    pointerRef.current = {
      x: (event.clientX / window.innerWidth) * 100,
      y: (event.clientY / window.innerHeight) * 100,
    };

    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        setPointerPosition(pointerRef.current);
        rafRef.current = null;
      });
    }
  };

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const sections = [
      'home',
      'projects',
      'skills',
      'experience',
      'education',
      'certifications',
      'contact'
    ];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      <div
        className={`min-h-screen relative transition-colors duration-500 font-sans antialiased text-white`}
        style={{ backgroundColor: '#141414', fontFamily: 'inherit' }}
        onMouseMove={handlePointerMove}
      >
        {/* Apple-style cursor-responsive orange ambient glow + subtle base gradient */}
        <div
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at ${pointerPosition.x}% ${pointerPosition.y}%, rgba(255,149,0,0.20), transparent 22%),
              radial-gradient(circle at 82% 10%, rgba(255,149,0,0.08), transparent 42%),
              radial-gradient(circle at 12% 88%, rgba(255,180,60,0.06), transparent 40%)
            `,
          }}
        />
        {/* Subtle grain + hairline */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage:
              'url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27160%27 viewBox=%270 0 160 160%27><filter id=%27n%27><feTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%272%27 stitchTiles=%27stitch%27/></filter><rect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%270.8%27/></svg>")',
          }}
        />

        {/* Navigation Bar */}
        <Navbar
          currentTheme={currentTheme}
          isDarkMode={isDarkMode}
          activeSection={activeSection}
        />

        {/* Floating LinkedIn Sidebar */}
        <FloatingSidebar />

        {/* Main Sections */}
        <main className="relative z-10">
          <HeroBanner
            currentTheme={currentTheme}
            isDarkMode={isDarkMode}
            onOpenChat={() => setIsChatOpen(true)}
          />

          <LazySection placeholder={<div className="min-h-[520px] flex items-center justify-center text-white/40 text-sm">Loading projects…</div>}>
            <Suspense fallback={<div className="min-h-[520px] flex items-center justify-center text-white/40 text-sm">Loading projects…</div>}>
              <ProjectsSection currentTheme={currentTheme} isDarkMode={isDarkMode} />
            </Suspense>
          </LazySection>

          <LazySection placeholder={<div className="min-h-[520px] flex items-center justify-center text-white/40 text-sm">Loading skills…</div>}>
            <Suspense fallback={<div className="min-h-[520px] flex items-center justify-center text-white/40 text-sm">Loading skills…</div>}>
              <SkillsSection currentTheme={currentTheme} isDarkMode={isDarkMode} />
            </Suspense>
          </LazySection>

          <LazySection placeholder={<div className="min-h-[520px] flex items-center justify-center text-white/40 text-sm">Loading experience…</div>}>
            <Suspense fallback={<div className="min-h-[520px] flex items-center justify-center text-white/40 text-sm">Loading experience…</div>}>
              <ExperienceSection currentTheme={currentTheme} isDarkMode={isDarkMode} />
            </Suspense>
          </LazySection>

          <LazySection placeholder={<div className="min-h-[520px] flex items-center justify-center text-white/40 text-sm">Loading certifications…</div>}>
            <Suspense fallback={<div className="min-h-[520px] flex items-center justify-center text-white/40 text-sm">Loading certifications…</div>}>
              <CertificationsSection currentTheme={currentTheme} isDarkMode={isDarkMode} />
            </Suspense>
          </LazySection>

          <LazySection placeholder={<div className="min-h-[520px] flex items-center justify-center text-white/40 text-sm">Loading contact…</div>}>
            <Suspense fallback={<div className="min-h-[520px] flex items-center justify-center text-white/40 text-sm">Loading contact…</div>}>
              <ContactSection currentTheme={currentTheme} isDarkMode={isDarkMode} />
            </Suspense>
          </LazySection>
        </main>

        {/* Floating AI Assistant Toggle Button (Bottom Right) */}
        {!isChatOpen && (
          <motion.button
            onClick={() => setIsChatOpen(true)}
            id="floating-ai-chat-btn"
            className="fixed bottom-6 right-6 z-40 pl-3 pr-4 py-3 rounded-full text-white font-semibold shadow-2xl flex items-center gap-2 group backdrop-blur-xl border border-white/10"
            style={{
              backgroundColor: 'rgba(28, 28, 30, 0.82)',
              boxShadow: '0 24px 70px -15px rgba(255, 149, 0, 0.35), 0 10px 30px -12px rgba(0,0,0,0.8)',
            }}
            whileHover={{ y: -3, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
            title="Ask Carlos's AI Assistant"
          >
            <span className="relative w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #ff9500 0%, #ffb340 100%)',
                boxShadow: '0 0 0 0 rgba(255,149,0,0.45)',
                animation: 'pulseGlow 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            >
              <Sparkles className="w-4 h-4 text-black" />
            </span>
            <span className="hidden sm:inline text-[13px] font-semibold tracking-tight">
              AI Assistant
            </span>
          </motion.button>
        )}

        {/* AI Chat Drawer / Widget */}
        {isChatOpen && (
          <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm text-white/80">Loading AI assistant…</div>}>
            <AIChatAssistant
              currentTheme={currentTheme}
              isDarkMode={isDarkMode}
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
            />
          </Suspense>
        )}

        {/* Footer */}
        <footer className="pt-14 pb-10 mt-8 border-t border-white/10 bg-[#0d0d0f]/60 backdrop-blur-xl relative z-10">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 flex flex-col gap-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {/* Brand & Signature */}
              <div className="space-y-4 sm:col-span-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #ff9500 0%, #ffb340 100%)',
                    }}
                  >
                    <Code2 className="w-4.5 h-4.5 text-black" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-white font-semibold tracking-tight text-[15px]">
                      Carlos Alfonso Perez
                    </span>
                    <span className="flex items-center gap-1.5 mt-0.5">
                      <Briefcase className="w-3 h-3 text-[#ff9500]" />
                      <span className="text-[11px] font-medium text-white/60 tracking-wide uppercase">
                        Software Developer
                      </span>
                    </span>
                  </div>
                </div>
                <p className="text-sm text-white/60 max-w-md leading-relaxed">
                  Building thoughtful, performant web experiences. Cum Laude IT graduate from UST Manila with enterprise IT operations experience.
                </p>
                <motion.div
                  whileHover={{ scale: 1.02, x: 2 }}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-xl w-fit group cursor-pointer"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff9500] opacity-60" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff9500]" />
                  </span>
                  <span className="text-[12px] font-semibold text-white">
                    Available for work
                  </span>
                </motion.div>
              </div>

              {/* Sitemap */}
              <div className="space-y-3.5">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Sitemap</h3>
                <ul className="space-y-2 text-sm">
                  {['Home', 'Projects', 'Skills', 'Experience', 'Education', 'Certifications', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="text-white/70 hover:text-[#ff9500] transition-colors duration-200">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connect */}
              <div className="space-y-3.5">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Connect</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href={resumeData.contact.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white/70 hover:text-[#ff9500] transition-colors duration-200"
                    >
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a
                      href={resumeData.contact.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white/70 hover:text-[#ff9500] transition-colors duration-200"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${resumeData.contact.email}`}
                      className="text-white/70 hover:text-[#ff9500] transition-colors duration-200 break-all"
                    >
                      {resumeData.contact.email}
                    </a>
                  </li>
                </ul>
                <motion.button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.04] text-white/80 hover:text-[#ff9500] hover:border-[#ff9500]/40 transition-colors text-sm font-medium"
                  title="Scroll to Top"
                >
                  <ArrowUp className="w-4 h-4" />
                  Back to top
                </motion.button>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            {/* Copyright + bottom row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[12px] text-white/55 tracking-tight">
                © 2026 Carlos Alfonso Perez. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-[11px] text-white/40">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ff9500]" />
                  <span>Privacy first</span>
                </div>
                <span>·</span>
                <span>Handcrafted with React + Tailwind</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
