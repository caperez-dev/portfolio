import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Paperclip,
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
      className="fixed top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 z-40 rounded-2xl backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/40"
      style={{
        background: 'rgba(20, 20, 20, 0.85)',
        backdropFilter: 'blur(20px)'
      }}
    >
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#home');
          }}
          className="flex items-center gap-1 group py-1"
          id="navbar-brand-link"
        >
          <img
            src="https://via.placeholder.com/40/ff9500/ffffff?text=CA"
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
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
                    ? 'text-[#ff9500] font-semibold'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 rounded-md pointer-events-none bg-[#ff9500]/12 border border-[#ff9500]/30"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <motion.span
                  className="relative z-10 inline-block"
                  whileHover={{ y: -1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {link.name}
                </motion.span>
              </a>
            );
          })}
        </nav>

        {/* Controls: Download CV, Theme Selector */}
        <div className="flex items-center gap-1.5">
          {/* Download CV Button */}
          <button
            onClick={generateResumePDF}
            id="download-cv-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-black transition-all shadow-lg shadow-[#ff9500]/20 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
            style={{
              background: 'linear-gradient(135deg,#ff9500,#ffb340)'
            }}
            title="Download Resume PDF"
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download CV</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg border border-white/10 text-white/75"
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
            className="xl:hidden border-t border-white/8 px-4 py-3 space-y-1"
            style={{
              background: 'rgba(20, 20, 20, 0.4)'
            }}
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
                className="block px-3 py-2 rounded-lg text-sm font-medium outline-none focus:outline-none text-white/80 hover:bg-white/[0.05] hover:text-white"
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

