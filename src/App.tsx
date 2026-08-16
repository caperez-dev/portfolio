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
import { scrollToSection, getIsScrollingToSection } from './utils/scrollToSection';
import { Sparkles } from 'lucide-react';
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
    const sectionIds = [
      'home',
      'projects',
      'skills',
      'experience',
      'certifications',
      'contact',
    ];

    const updateActiveSection = () => {
      if (getIsScrollingToSection()) return;

      const scrollPos = window.scrollY + 120;
      let current = sectionIds[0];

      for (const sectionId of sectionIds) {
        const el = document.getElementById(sectionId);
        if (!el) continue;

        const top = el.getBoundingClientRect().top + window.scrollY;
        if (scrollPos >= top) {
          current = sectionId;
        }
      }

      setActiveSection(current);
    };

    let scrollTicking = false;
    const handleScroll = () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        updateActiveSection();
        scrollTicking = false;
      });
    };

    updateActiveSection();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateActiveSection, { passive: true });

    const main = document.querySelector('main');
    const mutationObserver =
      main &&
      new MutationObserver(() => {
        updateActiveSection();
      });
    mutationObserver?.observe(main, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateActiveSection);
      mutationObserver?.disconnect();
    };
  }, []);

  const handleSectionNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    void scrollToSection(sectionId);
  };

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
          onNavigate={handleSectionNavigate}
        />

        {/* Floating LinkedIn Sidebar */}
        <FloatingSidebar />

        {/* Main Sections */}
        <main className="relative z-10">
          <HeroBanner
            currentTheme={currentTheme}
            isDarkMode={isDarkMode}
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
              Ask AI
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
        <footer className="py-8 mt-12 border-t border-white/10 bg-[#0d0d0f]/60 backdrop-blur-xl relative z-10">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 flex flex-col items-center gap-3">
            {/* Copyright */}
            <p className="text-xs font-medium text-white/50 tracking-wide">
              © 2026 Carlos Alfonso Perez. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4 text-xs font-medium">
              <a
                href={resumeData.contact.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-white/50 hover:text-[#ff9500] transition-colors duration-200"
              >
                LinkedIn
              </a>
              <span className="text-white/20">·</span>
              <a
                href={resumeData.contact.github}
                target="_blank"
                rel="noreferrer"
                className="text-white/50 hover:text-[#ff9500] transition-colors duration-200"
              >
                GitHub
              </a>
              <span className="text-white/20">·</span>
              <a
                href={`mailto:${resumeData.contact.email}`}
                className="text-white/50 hover:text-[#ff9500] transition-colors duration-200"
              >
                Email
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
