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
import { Code2, ArrowUp, Sparkles, ShieldCheck } from 'lucide-react';

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
  rootMargin = '0px 0px 400px 0px',
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
      { rootMargin }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div ref={sectionRef} className="min-h-[520px]">
      {isVisible ? children : placeholder}
    </div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const currentTheme = developerThemes[0];
  const isDarkMode = true; // Strict Dark Mode per user requirement
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

  // Scroll spy to track active section for navbar
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      <div
        className={`min-h-screen relative transition-colors duration-300 font-sans ${currentTheme.fontFamily} ${currentTheme.darkBg} ${currentTheme.darkText}`}
        onMouseMove={handlePointerMove}
      >
        {/* Cursor-responsive ambient glow */}
        <div
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            backgroundImage: `radial-gradient(circle at ${pointerPosition.x}% ${pointerPosition.y}%, rgba(56,189,248,0.18), transparent 16%), radial-gradient(circle at 80% 80%, rgba(16,185,129,0.08), transparent 35%)`,
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

          <LazySection placeholder={<div className="min-h-[520px] flex items-center justify-center text-slate-400">Loading projects...</div>}>
            <Suspense fallback={<div className="min-h-[520px] flex items-center justify-center text-slate-400">Loading projects...</div>}>
              <ProjectsSection currentTheme={currentTheme} isDarkMode={isDarkMode} />
            </Suspense>
          </LazySection>

          <LazySection placeholder={<div className="min-h-[520px] flex items-center justify-center text-slate-400">Loading skills...</div>}>
            <Suspense fallback={<div className="min-h-[520px] flex items-center justify-center text-slate-400">Loading skills...</div>}>
              <SkillsSection currentTheme={currentTheme} isDarkMode={isDarkMode} />
            </Suspense>
          </LazySection>

          <LazySection placeholder={<div className="min-h-[520px] flex items-center justify-center text-slate-400">Loading experience...</div>}>
            <Suspense fallback={<div className="min-h-[520px] flex items-center justify-center text-slate-400">Loading experience...</div>}>
              <ExperienceSection currentTheme={currentTheme} isDarkMode={isDarkMode} />
            </Suspense>
          </LazySection>

          <LazySection placeholder={<div className="min-h-[520px] flex items-center justify-center text-slate-400">Loading certifications...</div>}>
            <Suspense fallback={<div className="min-h-[520px] flex items-center justify-center text-slate-400">Loading certifications...</div>}>
              <CertificationsSection currentTheme={currentTheme} isDarkMode={isDarkMode} />
            </Suspense>
          </LazySection>

          <LazySection placeholder={<div className="min-h-[520px] flex items-center justify-center text-slate-400">Loading contact...</div>}>
            <Suspense fallback={<div className="min-h-[520px] flex items-center justify-center text-slate-400">Loading contact...</div>}>
              <ContactSection currentTheme={currentTheme} isDarkMode={isDarkMode} />
            </Suspense>
          </LazySection>
        </main>

        {/* Floating AI Assistant Toggle Button (Bottom Right) */}
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            id="floating-ai-chat-btn"
            className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full text-white font-bold shadow-2xl flex items-center gap-2 hover:scale-110 active:scale-95 transition-all duration-300 group"
            style={{
              backgroundColor: currentTheme.darkAccent
            }}
            title="Ask Carlos's AI Assistant"
          >
            <Sparkles className="w-5 h-5 animate-spin" />
            <span className="hidden sm:inline text-xs font-mono font-bold">Ask AI Assistant</span>
          </button>
        )}

        {/* AI Chat Drawer / Widget */}
        {isChatOpen && (
          <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 text-slate-200">Loading AI assistant...</div>}>
            <AIChatAssistant
              currentTheme={currentTheme}
              isDarkMode={isDarkMode}
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
            />
          </Suspense>
        )}

        {/* Footer */}
        <footer className="py-12 border-t text-xs font-mono transition-colors bg-slate-950 border-slate-800 text-slate-400">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-slate-200">{resumeData.name}</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <a
                href={resumeData.contact.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-slate-300 hover:text-cyan-400 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href={resumeData.contact.github}
                target="_blank"
                rel="noreferrer"
                className="text-slate-300 hover:text-cyan-400 transition-colors"
              >
                GitHub
              </a>
              <a
                href={`mailto:${resumeData.contact.email}`}
                className="text-slate-300 hover:text-cyan-400 transition-colors"
              >
                Email
              </a>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 transition-all"
                title="Scroll to Top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
