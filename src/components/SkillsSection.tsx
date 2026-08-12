import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { resumeData } from '../data/resume';
import { ThemeOption } from '../types';
import {
  Code2,
  Filter
} from 'lucide-react';

interface SkillsSectionProps {
  currentTheme: ThemeOption;
  isDarkMode: boolean;
}

// Helper Cube icon for technologies without provided photos
const CubeIcon = () => (
  <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

// Brand photo mapping for software technology items
function getSkillIcon(name: string) {
  const nameLower = name.toLowerCase();

  let src = '';

  if (nameLower.includes('php') && !nameLower.includes('laravel')) src = '/assets/skills/php.svg';
  else if (nameLower.includes('laravel')) src = '/assets/skills/laravel.svg';
  else if (nameLower.includes('java') && !nameLower.includes('script')) src = '/assets/skills/java.svg';
  else if (nameLower.includes('javascript') || nameLower === 'js') src = '/assets/skills/javascript.svg';
  else if (nameLower.includes('html')) src = '/assets/skills/html5.svg';
  else if (nameLower.includes('css') && !nameLower.includes('materialize')) src = '/assets/skills/css3.svg';
  else if (nameLower.includes('react')) src = '/assets/skills/reactjs.svg';
  else if (nameLower.includes('angular')) src = '/assets/skills/angularjs.svg';
  else if (nameLower.includes('express')) src = '/assets/skills/expressjs.svg';
  else if (nameLower.includes('bootstrap')) src = '/assets/skills/bootstrap.svg';
  else if (nameLower.includes('materialize')) src = '/assets/skills/materializecss.svg';
  else if (nameLower.includes('mysql')) src = '/assets/skills/mysql-workbench.svg';
  else if (nameLower.includes('heidisql')) src = '/assets/skills/heidisql.svg';
  else if (nameLower.includes('firebase') || nameLower.includes('firestore')) src = '/assets/skills/firebase.svg';
  else if (nameLower.includes('git') && !nameLower.includes('github')) src = '/assets/skills/git.svg';
  else if (nameLower.includes('github')) src = '/assets/skills/github.svg';
  else if (nameLower.includes('sdlc')) src = '/assets/skills/sdlc.svg';
  else if (nameLower.includes('agile') || nameLower.includes('kanban') || nameLower.includes('scrum')) src = '/assets/skills/agile.svg';
  else if (nameLower.includes('figma')) src = '/assets/skills/figma.svg';
  else if (nameLower.includes('canva')) src = '/assets/skills/canva.svg';
  else if (nameLower.includes('draw.io') || nameLower.includes('draw')) src = '/assets/skills/drawio.svg';
  else if (nameLower.includes('lucid')) src = '/assets/skills/lucidchart.svg';
  else if (nameLower.includes('powershell')) src = '/assets/skills/powershell.svg';
  else if (nameLower.includes('patch my pc') || nameLower.includes('patchmypc') || nameLower.includes('packaging')) src = '/assets/skills/patchmypc.svg';
  else if (nameLower.includes('servicenow')) src = '/assets/skills/servicenow.svg';
  else if (nameLower.includes('intune')) src = '/assets/skills/intunewin.svg';
  else if (nameLower.includes('installer')) src = '/assets/skills/installer.svg';

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="w-full h-full object-contain p-0.5 rounded"
        loading="lazy"
      />
    );
  }

  // Fallback to CubeIcon for unmapped items
  return <CubeIcon />;
}

export function SkillsSection({ currentTheme, isDarkMode }: SkillsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...resumeData.skills.webDev.map((cat) => cat.category)];

  const allWebDevSkills = resumeData.skills.webDev.flatMap((cat) =>
    cat.skills.map((skill) => ({ ...skill, category: cat.category }))
  );

  const displayedSkills =
    selectedCategory === 'All'
      ? allWebDevSkills
      : allWebDevSkills.filter((skill) => skill.category === selectedCategory);

  return (
    <section id="skills" className="py-12 sm:py-16 border-t border-slate-800/40 relative scroll-mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Main Heading with scroll entrance animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8 text-left"
        >
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
            <Code2 className="w-4 h-4" />
            <span>02 // Skills</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isDarkMode ? currentTheme.darkText : currentTheme.lightText
            }`}
          >
            Skills
          </h2>
        </motion.div>

        {/* =========================================================================
            SECTION 1: SKILLS (CONSOLIDATED IN 1 BOX WITH FILTERING)
           ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-lg font-bold mb-4 pb-2 border-b border-cyan-500/20">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <span>Skills</span>
          </div>

          {/* Single Box Container */}
          <motion.div
            layout
            transition={{
              layout: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
            }}
            className={`p-5 sm:p-6 rounded-2xl border shadow-xl overflow-hidden ${
              isDarkMode
                ? `${currentTheme.darkCard} ${currentTheme.darkBorder}`
                : `${currentTheme.lightCard} ${currentTheme.lightBorder}`
            }`}
          >
            {/* Filter Buttons Header */}
            <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-slate-800/80">
              <span className="text-xs font-mono font-medium text-slate-400 mr-1 flex items-center gap-1.5 shrink-0">
                <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filter:
              </span>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count =
                  cat === 'All'
                    ? allWebDevSkills.length
                    : resumeData.skills.webDev.find((c) => c.category === cat)?.skills.length;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold scale-105'
                        : isDarkMode
                        ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300'
                        : 'bg-slate-100 border border-slate-200 text-slate-700 hover:border-cyan-500/40 hover:text-cyan-600'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected
                          ? 'bg-slate-950/20 text-slate-950'
                          : isDarkMode
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Grid of Filtered Technologies */}
            <motion.div
              layout
              transition={{ layout: { duration: 0.3, ease: 'easeInOut' } }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {displayedSkills.map((skill) => (
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
                        ? 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/90 hover:shadow-lg hover:shadow-cyan-950/30'
                        : 'bg-slate-100 border-slate-200 hover:border-cyan-500/50 hover:bg-slate-200'
                    }`}
                  >
                    <div className="w-9 h-9 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                      {getSkillIcon(skill.name)}
                    </div>
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors leading-tight text-center">
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
