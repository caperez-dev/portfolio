/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { developerThemes } from './data/themes';
import { ThemeOption } from './types';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { FloatingSidebar } from './components/FloatingSidebar';
import { HeroBanner } from './components/HeroBanner';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ProjectsSection } from './components/ProjectsSection';
import { CertificationsSection } from './components/CertificationsSection';
import { ContactSection } from './components/ContactSection';
import { AIChatAssistant } from './components/AIChatAssistant';
import { Code2, ArrowUp, Sparkles, ShieldCheck } from 'lucide-react';
import { resumeData } from './data/resume';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const currentTheme = developerThemes[0];
  const isDarkMode = true; // Strict Dark Mode per user requirement
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Global mouse position tracking for page-wide cursor glow
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isMouseActive, setIsMouseActive] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isMouseActive) setIsMouseActive(true);
    };

    const handleMouseLeave = () => {
      setIsMouseActive(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMouseActive]);

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
      >
        {/* Page-Wide Interactive Cursor Glowing Aura */}
        <div
          className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300 ease-out"
          style={{
            opacity: isMouseActive ? 1 : 0,
            background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(56, 189, 248, 0.18), transparent 80%)`,
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

          <ProjectsSection currentTheme={currentTheme} isDarkMode={isDarkMode} />

          <SkillsSection currentTheme={currentTheme} isDarkMode={isDarkMode} />

          <ExperienceSection currentTheme={currentTheme} isDarkMode={isDarkMode} />

          <CertificationsSection currentTheme={currentTheme} isDarkMode={isDarkMode} />

          <ContactSection currentTheme={currentTheme} isDarkMode={isDarkMode} />
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
        <AIChatAssistant
          currentTheme={currentTheme}
          isDarkMode={isDarkMode}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />

        {/* Footer */}
        <footer className="py-12 border-t text-xs font-mono transition-colors bg-slate-950 border-slate-800 text-slate-400">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-slate-200">{resumeData.name}</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> Rate Limited & Validated API
              </span>
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
