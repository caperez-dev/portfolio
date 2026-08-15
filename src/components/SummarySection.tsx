import { motion } from 'motion/react';
import { resumeData } from '../data/resume';
import { ThemeOption } from '../types';
import { Award, Server, Code, ShieldCheck, GraduationCap } from 'lucide-react';

interface SummarySectionProps {
  currentTheme: ThemeOption;
  isDarkMode: boolean;
}

export function SummarySection({ currentTheme, isDarkMode }: SummarySectionProps) {
  return (
    <section id="summary" className="py-20 border-t border-slate-800/40 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-left"
        >
          <div className="flex items-center gap-2 text-[#ff9500] font-mono text-xs font-semibold uppercase tracking-wider mb-2">
            <GraduationCap className="w-4 h-4" />
            <span>01 // Professional Profile</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isDarkMode ? currentTheme.darkText : currentTheme.lightText
            }`}
          >
            Professional Summary
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Summary Text Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`lg:col-span-2 p-6 sm:p-8 rounded-2xl border shadow-xl relative overflow-hidden ${
              isDarkMode
                ? `${currentTheme.darkCard} ${currentTheme.darkBorder}`
                : `${currentTheme.lightCard} ${currentTheme.lightBorder}`
            }`}
          >
            <p
              className={`text-base sm:text-lg leading-relaxed ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              {resumeData.summary}
            </p>

            <div className="mt-8 pt-6 border-t border-slate-700/40 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#ff9500]/15 text-[#ff9500]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Academic Standing</div>
                  <div className="text-sm font-bold text-slate-200">Cum Laude (UST Manila)</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#ff9500]/15 text-[#ff9500]">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Enterprise Internship</div>
                  <div className="text-sm font-bold text-slate-200">Henkel Asia Pacific Services</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Core Strengths Badge Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div
              className={`p-5 rounded-xl border ${
                isDarkMode
                  ? 'bg-slate-900/80 border-slate-800'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 text-[#ff9500] font-semibold text-sm mb-2">
                <Server className="w-4 h-4" />
                <span>IT Operations & Deployment</span>
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Enterprise Windows application packaging using Patch My PC, IntuneWin, PowerShell scripting, and Advanced Installer.
              </p>
            </div>

            <div
              className={`p-5 rounded-xl border ${
                isDarkMode
                  ? 'bg-slate-900/80 border-slate-800'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 text-[#ff9500] font-semibold text-sm mb-2">
                <Code className="w-4 h-4" />
                <span>Full-Stack Web Engineering</span>
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                React.js, Node.js/Express, PHP Laravel, Firebase Firestore, MySQL, REST APIs, and responsive UI design.
              </p>
            </div>

            <div
              className={`p-5 rounded-xl border ${
                isDarkMode
                  ? 'bg-slate-900/80 border-slate-800'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 text-[#ff9500] font-semibold text-sm mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>QA & Security Mindset</span>
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                PHILNITS IT Passport Passer, DevSecOps & Cybersecurity certified, 200+ test cases created across capstone projects.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


