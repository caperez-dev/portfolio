import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { resumeData } from '../data/resume';
import { ThemeOption } from '../types';
import {
  Code2
} from 'lucide-react';

interface SkillsSectionProps {
  currentTheme: ThemeOption;
  isDarkMode: boolean;
}

// Helper Cube icon for technologies without provided photos
const CubeIcon = () => (
  <svg className="w-8 h-8 text-[#ff9500]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 2 0 0 0-1-1.73l-7-4a2 2 2 0 0 0-2 0l-7 4A2 2 2 0 0 0 3 8v8a2 2 2 0 0 0 1 1.73l7 4a2 2 2 0 0 0 2 0l7-4A2 2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

// Brand photo mapping for software technology items
const skillLogoMap: Record<string, string> = {
  angular: new URL('../assets/skills/angularjs.png', import.meta.url).href,
  bootstrap: new URL('../assets/skills/bootstrap.png', import.meta.url).href,
  canva: new URL('../assets/skills/canva.png', import.meta.url).href,
  css3: new URL('../assets/skills/CSS3.png', import.meta.url).href,
  drawio: new URL('../assets/skills/drawio.png', import.meta.url).href,
  express: new URL('../assets/skills/expressjs.png', import.meta.url).href,
  figma: new URL('../assets/skills/figma.png', import.meta.url).href,
  firebase: new URL('../assets/skills/firebase.png', import.meta.url).href,
  git: new URL('../assets/skills/git.png', import.meta.url).href,
  github: new URL('../assets/skills/github.png', import.meta.url).href,
  heidisql: new URL('../assets/skills/heidisql.png', import.meta.url).href,
  html5: new URL('../assets/skills/html5.png', import.meta.url).href,
  lucidchart: new URL('../assets/skills/lucidchart.png', import.meta.url).href,
  java: new URL('../assets/skills/java.png', import.meta.url).href,
  javascript: new URL('../assets/skills/javascript.png', import.meta.url).href,
  laravel: new URL('../assets/skills/phplaravel.png', import.meta.url).href,
  materializecss: new URL('../assets/skills/materializecss.png', import.meta.url).href,
  mysql: new URL('../assets/skills/mysqlworkbench.png', import.meta.url).href,
  patchmypc: new URL('../assets/skills/patchmypc.png', import.meta.url).href,
  php: new URL('../assets/skills/php.png', import.meta.url).href,
  powershell: new URL('../assets/skills/powershell.png', import.meta.url).href,
  react: new URL('../assets/skills/reactjs.png', import.meta.url).href,
  sdlc: new URL('../assets/skills/sdlc.png', import.meta.url).href,
  trello: new URL('../assets/skills/trello.png', import.meta.url).href,
  servicenow: new URL('../assets/skills/servicenow.png', import.meta.url).href,
};

function getSkillIcon(name: string, logoKey?: string) {
  const candidateKey = (logoKey || name)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  const src = skillLogoMap[candidateKey];

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="w-full h-full object-contain rounded-lg"
        loading="lazy"
      />
    );
  }

  // Fallback to CubeIcon for unmapped items
  return <CubeIcon />;
}

export function SkillsSection({ currentTheme, isDarkMode }: SkillsSectionProps) {
  const allWebDevSkills = resumeData.skills.webDev.flatMap((cat) =>
    cat.skills.map((skill) => ({ ...skill, category: cat.category }))
  );

  return (
    <section id="skills" className="py-12 sm:py-16 border-t border-white/8 relative scroll-mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Main Heading with scroll entrance animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8 text-left"
        >
          <div className="flex items-center gap-2 text-[#ff9500] text-xs font-semibold uppercase tracking-wide mb-2">
            <Code2 className="w-4 h-4 text-[#ff9500]" />
            <span>02 // Skills</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isDarkMode ? currentTheme.darkText : currentTheme.lightText
            }`}
          >
            Technologies
          </h2>
        </motion.div>

        {/* Skills Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-10"
        >
          {/* Single Box Container */}
          <motion.div
            layout
            transition={{
              layout: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
            }}
            className={`relative p-5 sm:p-6 rounded-2xl border shadow-xl overflow-hidden ${
              isDarkMode
                ? `${currentTheme.darkCard} ${currentTheme.darkBorder}`
                : `${currentTheme.lightCard} ${currentTheme.lightBorder}`
            }`}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-2xl pointer-events-none -z-10"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 8px)',
                opacity: isDarkMode ? 0.06 : 0.04
              }}
            />

            {/* Grid of Technologies */}
            <motion.div
              layout
              transition={{ layout: { duration: 0.3, ease: 'easeInOut' } }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {allWebDevSkills.map((skill) => (
                  <motion.div
                    key={skill.name}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      layout: { type: 'spring', stiffness: 300, damping: 28 },
                      opacity: { duration: 0.2 },
                      scale: { duration: 0.2 }
                    }}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-colors text-center gap-2 group ${
                      isDarkMode
                        ? 'bg-[#1c1c1e]/80 border-white/10 hover:border-[#ff9500]/50 hover:bg-[#1c1c1e] hover:shadow-lg hover:shadow-[#ff9500]/20'
                        : 'bg-white/5 border border-white/10 hover:border-[#ff9500]/50 hover:bg-white/10'
                    }`}
                  >
                    <div className="w-10 aspect-square flex items-center justify-center rounded-2xl overflow-hidden transition-transform duration-200 group-hover:scale-110 bg-white/[0.04]">
                      {getSkillIcon(skill.name, skill.logoKey)}
                    </div>
                    <span className="text-xs font-semibold text-white/70 group-hover:text-[#ffb340] transition-colors leading-tight text-center">
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


