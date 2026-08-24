import { motion } from 'motion/react';
import { resumeData } from '../data/resume';
import { ThemeOption } from '../types';
import { Briefcase, Calendar, MapPin, CheckCircle2, Terminal, Building2, GraduationCap, Award, BookOpen } from 'lucide-react';

const appleFontStack =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Helvetica Neue', sans-serif";

const henkelLogo = new URL('../assets/work-education/henkel.png', import.meta.url).href;
const ustLogo = new URL('../assets/work-education/ust.png', import.meta.url).href;
const dlslLogo = new URL('../assets/work-education/dlsl.png', import.meta.url).href;

interface ExperienceSectionProps {
  currentTheme: ThemeOption;
  isDarkMode: boolean;
}

export function ExperienceSection({ currentTheme, isDarkMode }: ExperienceSectionProps) {
  return (
    <section id="experience" className="py-12 sm:py-16 border-t border-slate-800/40 relative scroll-mt-16" style={{ fontFamily: appleFontStack }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8 text-left"
        >
          <div className="flex items-center gap-2 text-[#ff9500] font-mono text-xs font-semibold uppercase tracking-wider mb-1.5">
            <Briefcase className="w-4 h-4" />
            <span>03 // Experience & Education</span>
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDarkMode ? currentTheme.darkText : currentTheme.lightText
            }`}
          >
            Work Experience & Education
          </h2>
        </motion.div>

        {/* Vertical Timeline Wrapper */}
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="hidden md:block absolute left-[140px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#ff9500] via-[#ff9500]/50 to-slate-800" />
          <div className="md:hidden absolute left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#ff9500] via-[#ff9500]/50 to-slate-800" />

          <div className="space-y-10">

            {/* ── WORK EXPERIENCE ITEMS ── */}
            {resumeData.experience.map((exp, idx) => (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: 'easeOut' }}
                className="relative flex flex-col md:flex-row items-start group"
              >
                {/* Desktop left column: logo + date */}
                <div className="hidden md:flex md:w-[130px] pr-5 pt-1 flex-col items-end shrink-0 text-right space-y-2">
                  <div className="w-14 h-14 rounded-xl bg-slate-900 shadow-md flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105 aspect-square overflow-hidden">
                    {exp.companyLogo === 'henkel' || exp.company.toLowerCase().includes('henkel') ? (
                      <img src={henkelLogo} alt="Henkel" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-7 h-7 text-slate-700" />
                    )}
                  </div>
                  {/* Date badge — orange-themed */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#ff9500]/10 border border-[#ff9500]/30 text-[#ff9500] font-mono text-[11px] font-semibold shadow-md whitespace-nowrap">
                    <Calendar className="w-3 h-3" />
                    <span>{exp.period}</span>
                  </div>
                </div>

                {/* Timeline dot — desktop */}
                <div className="hidden md:flex absolute left-[140px] top-5 -translate-x-1/2 z-20 items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-[#ff9500] shadow-lg shadow-[#ff9500]/30 flex items-center justify-center text-[#ff9500] group-hover:scale-110 transition-transform duration-300">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Timeline dot — mobile */}
                <div className="md:hidden absolute left-4 top-5 -translate-x-1/2 z-20 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-[#ff9500] shadow-lg shadow-[#ff9500]/30 flex items-center justify-center text-[#ff9500]">
                    <Briefcase className="w-3 h-3" />
                  </div>
                </div>

                {/* Experience content card */}
                <div className="pl-8 md:pl-8 w-full">
                  <div
                    className={`p-5 sm:p-6 rounded-xl border shadow-lg transition-all duration-300 hover:shadow-[#ff9500]/5 ${
                      isDarkMode
                        ? `${currentTheme.darkCard} ${currentTheme.darkBorder}`
                        : `${currentTheme.lightCard} ${currentTheme.lightBorder}`
                    }`}
                  >
                    {/* Header row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-700/40">
                      <div className="min-w-0">
                        {/* Mobile: logo + date */}
                        <div className="md:hidden flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-900 shadow-md flex items-center justify-center shrink-0 aspect-square overflow-hidden">
                            {exp.companyLogo === 'henkel' || exp.company.toLowerCase().includes('henkel') ? (
                              <img src={henkelLogo} alt="Henkel" className="w-full h-full object-cover" />
                            ) : (
                              <Building2 className="w-6 h-6 text-slate-700" />
                            )}
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#ff9500]/10 border border-[#ff9500]/30 text-[#ff9500] font-mono text-[11px] font-semibold">
                            <Calendar className="w-3 h-3" />
                            <span>{exp.period}</span>
                          </div>
                        </div>

                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-100 leading-snug sm:whitespace-nowrap">
                          {exp.title}
                        </h3>
                        <p className="text-xs sm:text-sm font-semibold text-[#ff9500] mt-0.5">{exp.company}</p>
                      </div>

                      {/* Location badge — orange-themed */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#ff9500]/10 border border-[#ff9500]/20 text-[11px] text-slate-300 font-mono w-fit shrink-0">
                        <MapPin className="w-3 h-3 text-[#ff9500]" />
                        <span>{exp.location}</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-2 mb-5">
                      {exp.highlights.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#ff9500] shrink-0 mt-0.5" />
                          <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            {bullet}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Tools & Environments — orange-themed tags */}
                    <div className="pt-3 border-t border-slate-800/60 flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                      <span className="text-slate-400 font-medium text-[10px] sm:text-[11px] mr-1">Tools & Environments:</span>
                      {['Patch My PC', 'IntuneWin', 'PowerShell Scripts', 'Advanced Installer', 'ServiceNow', 'Company Portal', 'LOB Deployment'].map((tool) => (
                        <span
                          key={tool}
                          className="px-2 py-0.5 rounded bg-[#ff9500]/10 border border-[#ff9500]/25 text-[#ffb340] flex items-center gap-1"
                        >
                          <Terminal className="w-2.5 h-2.5 text-[#ff9500]" />
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* ── EDUCATION SUBSECTION ANCHOR ── */}
            <div id="education" className="scroll-mt-24 pt-4">
              <div className="relative flex items-center gap-3 pl-0 md:pl-[115px] mb-2">
                <div className="hidden md:flex absolute left-[140px] -translate-x-1/2 z-20 items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-[#ff9500]/20 border border-[#ff9500] text-[#ff9500] flex items-center justify-center">
                    <GraduationCap className="w-3 h-3" />
                  </div>
                </div>
                <div className="md:hidden absolute left-4 -translate-x-1/2 z-20 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-[#ff9500]/20 border border-[#ff9500] text-[#ff9500] flex items-center justify-center">
                    <GraduationCap className="w-3 h-3" />
                  </div>
                </div>
                <div className="pl-16 md:pl-14 flex items-center gap-2 text-[#ff9500] font-mono text-xs font-bold uppercase tracking-wider">
                  <span>Education & Academic Background</span>
                </div>
              </div>
            </div>

            {/* ── EDUCATION ITEMS ── */}
            {resumeData.education.map((edu, idx) => {
              const isUst = edu.institution.toLowerCase().includes('santo tomas') || edu.institution.toLowerCase().includes('ust');
              const isDlsl = edu.institution.toLowerCase().includes('salle') || edu.institution.toLowerCase().includes('dlsl');

              return (
                <motion.div
                  key={edu.institution}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: idx * 0.15, ease: 'easeOut' }}
                  className="relative flex flex-col md:flex-row items-start group"
                >
                  {/* Desktop left column: logo + date */}
                  <div className="hidden md:flex md:w-[130px] pr-5 pt-1 flex-col items-end shrink-0 text-right space-y-2">
                    {/* Logo — only show for non-UST (UST card uses text layout per request) */}
                    {!isUst && (
                      <div className="w-14 h-14 rounded-xl bg-slate-900 shadow-md flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105 aspect-square overflow-hidden">
                        {isDlsl ? (
                          <img src={dlslLogo} alt="DLSL" className="w-full h-full object-cover" />
                        ) : (
                          <GraduationCap className="w-7 h-7 text-[#ff9500]" />
                        )}
                      </div>
                    )}
                    {/* Date badge — orange-themed */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#ff9500]/10 border border-[#ff9500]/30 text-[#ff9500] font-mono text-[11px] font-semibold shadow-md whitespace-nowrap">
                      <Calendar className="w-3 h-3" />
                      <span>{edu.period}</span>
                    </div>
                  </div>

                  {/* Timeline dot — desktop */}
                  <div className="hidden md:flex absolute left-[140px] top-5 -translate-x-1/2 z-20 items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-[#ff9500] shadow-lg shadow-[#ff9500]/30 flex items-center justify-center text-[#ff9500] group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Timeline dot — mobile */}
                  <div className="md:hidden absolute left-4 top-5 -translate-x-1/2 z-20 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-[#ff9500] shadow-lg shadow-[#ff9500]/30 flex items-center justify-center text-[#ff9500]">
                      <BookOpen className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Education content card */}
                  <div className="pl-8 md:pl-8 w-full">
                    <div
                      className={`p-5 sm:p-6 rounded-xl border shadow-lg transition-all duration-300 hover:shadow-[#ff9500]/5 ${
                        isDarkMode
                          ? `${currentTheme.darkCard} ${currentTheme.darkBorder}`
                          : `${currentTheme.lightCard} ${currentTheme.lightBorder}`
                      }`}
                    >
                      {isUst ? (
                        /* ── UST: clean text-only layout, no logo ── */
                        <div className="space-y-3">
                          {/* Mobile date badge */}
                          <div className="md:hidden flex items-center gap-2 mb-1">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#ff9500]/10 border border-[#ff9500]/30 text-[#ff9500] font-mono text-[11px] font-semibold">
                              <Calendar className="w-3 h-3" />
                              <span>{edu.period}</span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-100 leading-snug">
                                {edu.degree}
                              </h3>
                              <p className="text-xs sm:text-sm font-semibold text-[#ff9500] mt-0.5">
                                {edu.institution}
                              </p>
                            </div>
                            {/* Location badge — orange-themed */}
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#ff9500]/10 border border-[#ff9500]/20 text-[11px] text-slate-300 font-mono w-fit shrink-0">
                              <MapPin className="w-3 h-3 text-[#ff9500]" />
                              <span>{edu.location}</span>
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-400">
                            Specialization in Web and Mobile Application Development
                          </p>

                          {/* Subtle honors line — no badge, no icon, just a quiet text note */}
                          {edu.honors && (
                            <p className="text-xs text-slate-500 italic">
                              {edu.honors}{edu.gwa ? ` — GWA ${edu.gwa}` : ''}
                            </p>
                          )}
                        </div>
                      ) : (
                        /* ── Other schools: standard layout ── */
                        <>
                          {/* Header row */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-700/40">
                            <div className="min-w-0">
                              {/* Mobile: logo + date */}
                              <div className="md:hidden flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-lg bg-slate-900 shadow-md flex items-center justify-center shrink-0 aspect-square overflow-hidden">
                                  {isDlsl ? (
                                    <img src={dlslLogo} alt="DLSL" className="w-full h-full object-cover" />
                                  ) : (
                                    <GraduationCap className="w-6 h-6 text-[#ff9500]" />
                                  )}
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#ff9500]/10 border border-[#ff9500]/30 text-[#ff9500] font-mono text-[11px] font-semibold">
                                  <Calendar className="w-3 h-3" />
                                  <span>{edu.period}</span>
                                </div>
                              </div>

                              <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-100 leading-snug">
                                {edu.degree}
                              </h3>
                              <p className="text-xs sm:text-sm font-semibold text-[#ff9500] mt-0.5">{edu.institution}</p>
                            </div>

                            {/* Location badge — orange-themed */}
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#ff9500]/10 border border-[#ff9500]/20 text-[11px] text-slate-300 font-mono w-fit shrink-0">
                              <MapPin className="w-3 h-3 text-[#ff9500]" />
                              <span>{edu.location}</span>
                            </div>
                          </div>

                          {/* Honors — subtle text only, no icon/badge */}
                          {edu.honors && (
                            <p className="text-xs text-slate-500 italic">
                              {edu.honors}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

          </div>
        </div>
      </div>
    </section>
  );
}
