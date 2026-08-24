import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Paperclip,
  Menu,
  X
} from 'lucide-react';
import { ThemeOption } from '../types';
import { generateResumePDF } from '../utils/pdfGenerator';
import portraitSrc from '../assets/carlos branding.png';

interface NavbarProps {
  currentTheme: ThemeOption;
  isDarkMode: boolean;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const appleFontStack =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Helvetica Neue', sans-serif";

export function Navbar({
  currentTheme,
  isDarkMode,
  activeSection,
  onNavigate
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Contact', href: '#contact' }
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    onNavigate(href.replace('#', ''));
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-[900px] sm:w-[min(900px,78vw)] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.25)] ${
        isMobileMenuOpen ? 'rounded-2xl' : 'rounded-full'
      }`}
      style={{
        background: 'rgba(28, 28, 30, 0.72)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <div className="px-3 sm:px-5 h-11 sm:h-12 flex items-center justify-between gap-3">
        {/* Brand */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#home');
          }}
          className="flex-shrink-0 flex items-center group py-0.5 pl-1"
          id="navbar-brand-link"
        >
          <img
            src={portraitSrc}
            alt="Profile"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover"
          />
        </a>

        {/* Desktop Nav Links */}
        <nav
          className="hidden lg:flex items-center justify-center gap-9 flex-1 min-w-0"
          id="desktop-nav-links"
          style={{ fontFamily: appleFontStack }}
        >
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
                className={`relative px-0.5 py-1 transition-colors duration-200 ease-out outline-none focus:outline-none focus:ring-0 text-[13px] tracking-tight ${
                  isActive
                    ? 'text-white'
                    : 'text-white/55 hover:text-white/90'
                }`}
                style={{ fontWeight: isActive ? 500 : 400 }}
              >
                {isActive && (
                  <>
                    <motion.span
                      key={`indicator-${link.name}`}
                      className="absolute left-0 right-0 -bottom-[5px] h-px rounded-full"
                      style={{ background: '#ff9500' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                    />
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 -mx-1 -my-0.5 rounded-md pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ background: 'rgba(255, 149, 0, 0.06)' }}
                    />
                  </>
                )}
                <span className="relative inline-block">{link.name}</span>
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex-shrink-0 p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/5 transition-colors duration-200"
            id="mobile-menu-btn"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
          </button>

          {/* Download CV Button */}
          <button
            onClick={generateResumePDF}
            id="download-cv-btn"
            className="flex-shrink-0 flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-[12px] transition-all duration-200 hover:brightness-110 active:brightness-95"
            style={{
              fontFamily: appleFontStack,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              color: '#1c1c1e',
              background: 'linear-gradient(180deg,#ffb340,#ff9500)',
              boxShadow: '0 6px 20px rgba(255, 149, 0, 0.18)'
            }}
            title="Download Resume PDF"
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download CV</span>
            <span className="sm:hidden">CV</span>
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
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="lg:hidden border-t border-white/8 px-3 pt-2 pb-3 space-y-0.5 overflow-hidden"
          >
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
                  className={`block px-3 py-2 rounded-lg text-[14px] outline-none focus:outline-none transition-colors duration-200 ${
                    isActive ? 'text-white bg-white/[0.04]' : 'text-white/70 hover:bg-white/[0.03] hover:text-white/90'
                  }`}
                  style={{ fontFamily: appleFontStack, fontWeight: isActive ? 500 : 400, letterSpacing: '-0.01em' }}
                >
                  {link.name}
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
