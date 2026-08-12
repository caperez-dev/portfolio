import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download,
  Menu,
  X
} from 'lucide-react';
import { ThemeOption } from '../types';
import { generateResumePDF } from '../utils/pdfGenerator';

interface NavbarProps {
  currentTheme: ThemeOption;
  isDarkMode: boolean;
  activeSection: string;
}

export function Navbar({
  currentTheme,
  isDarkMode,
  activeSection
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Education', href: '#education' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Contact', href: '#contact' }
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 backdrop-blur-md border-b ${
        isDarkMode
          ? `${currentTheme.darkCard} ${currentTheme.darkBorder}`
          : `${currentTheme.lightCard} ${currentTheme.lightBorder}`
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#home');
          }}
          className="flex flex-col group py-1"
          id="navbar-brand-link"
        >
          <span
            className={`font-bold text-base sm:text-lg tracking-tight leading-snug ${
              isDarkMode ? currentTheme.darkText : currentTheme.lightText
            }`}
          >
            Carlos Alfonso Perez
          </span>
          <span className="text-[11px] text-cyan-400 font-mono font-medium tracking-wide">
            Full-stack Developer | Freelancer
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-medium" id="desktop-nav-links">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  (e.currentTarget as HTMLElement).blur();
                  handleNavClick(link.href);
                }}
                className={`relative px-3 py-1.5 rounded-md transition-colors duration-200 outline-none focus:outline-none focus:ring-0 ${
                  isActive
                    ? isDarkMode
                      ? 'text-cyan-400 font-semibold'
                      : 'text-cyan-800 font-semibold'
                    : isDarkMode
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className={`absolute inset-0 rounded-md pointer-events-none ${
                      isDarkMode
                        ? 'bg-cyan-500/15 border border-cyan-500/30'
                        : 'bg-cyan-100 border border-cyan-300'
                    }`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Controls: Download CV, Theme Selector */}
        <div className="flex items-center gap-2">
          {/* Download CV Button */}
          <button
            onClick={generateResumePDF}
            id="download-cv-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            style={{
              backgroundColor: isDarkMode ? currentTheme.darkAccent : currentTheme.lightAccent
            }}
            title="Download Resume PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download CV</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg border border-slate-700 text-slate-300"
            id="mobile-menu-btn"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`xl:hidden border-b px-4 py-3 space-y-1 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  (e.currentTarget as HTMLElement).blur();
                  handleNavClick(link.href);
                }}
                className={`block px-3 py-2 rounded-lg text-sm font-medium outline-none focus:outline-none ${
                  isDarkMode
                    ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
