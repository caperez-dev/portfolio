import { motion } from 'motion/react';
import { resumeData } from '../data/resume';
import { ThemeOption } from '../types';
import { GraduationCap, Award, Calendar, MapPin, BookOpen } from 'lucide-react';

interface EducationSectionProps {
  currentTheme: ThemeOption;
  isDarkMode: boolean;
}

export function EducationSection({ currentTheme, isDarkMode }: EducationSectionProps) {
  return (
    <section id="education" className="py-12 sm:py-16 border-t border-slate-800/40 relative scroll-mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-10 text-left"
        >
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
            <GraduationCap className="w-4 h-4" />
            <span>04 // Education</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isDarkMode ? currentTheme.darkText : currentTheme.lightText
            }`}
          >
            Education & Honors
          </h2>
        </motion.div>

        {/* Education Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resumeData.education.map((edu, idx) => (
            <motion.div
              key={edu.institution}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: idx * 0.12, ease: 'easeOut' }}
              className={`p-6 sm:p-8 rounded-2xl border shadow-xl flex flex-col justify-between ${
                isDarkMode
                  ? `${currentTheme.darkCard} ${currentTheme.darkBorder}`
                  : `${currentTheme.lightCard} ${currentTheme.lightBorder}`
              }`}
            >
              <div>
                {/* Institution & Period */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                    {edu.period}
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" /> {edu.location}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-100 mb-1">{edu.institution}</h3>
                <p className="text-sm font-semibold text-cyan-400 mb-4">{edu.degree}</p>

                {/* Honors & GWA */}
                <div className="space-y-2 mb-6">
                  {edu.honors && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{edu.honors}</span>
                      {edu.gwa && <span className="text-slate-300 font-normal">(GWA: {edu.gwa})</span>}
                    </div>
                  )}

                  {edu.coursework && (
                    <div className="mt-4 pt-4 border-t border-slate-700/40">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300 mb-2">
                        <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Relevant Coursework:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {edu.coursework.map((cw) => (
                          <span
                            key={cw}
                            className="px-2 py-1 rounded text-[11px] bg-slate-900 border border-slate-800 text-slate-300"
                          >
                            {cw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
