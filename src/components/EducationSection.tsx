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
    <section id="education" className="py-12 sm:py-16 border-t border-white/8 relative scroll-mt-16 bg-[#141414]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-10 text-left"
        >
          <div className="flex items-center gap-2 text-[#ff9500] text-xs font-semibold uppercase tracking-wide mb-2">
            <GraduationCap className="w-4 h-4" />
            <span>04 // Education</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
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
              className="p-6 sm:p-8 rounded-2xl border shadow-xl flex flex-col justify-between bg-[#1c1c1e]/65 backdrop-blur-xl border-white/10"
            >
              <div>
                {/* Institution & Period */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-white/[0.04] text-white/80 border border-white/10">
                    {edu.period}
                  </span>
                  <span className="text-xs text-white/60 font-mono flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#ff9500]" /> {edu.location}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{edu.institution}</h3>
                <p className="text-sm font-semibold text-[#ff9500] mb-4">{edu.degree}</p>

                {/* Honors & GWA */}
                <div className="space-y-2 mb-6">
                  {edu.honors && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-white/10 bg-white/[0.04] text-white/80 text-xs font-bold">
                      <Award className="w-4 h-4 text-[#ff9500]" />
                      <span>{edu.honors}</span>
                      {edu.gwa && <span className="text-white/60 font-normal">(GWA: {edu.gwa})</span>}
                    </div>
                  )}

                  {edu.coursework && (
                    <div className="mt-4 pt-4 border-t border-white/8">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white/80 mb-2">
                        <BookOpen className="w-3.5 h-3.5 text-[#ff9500]" />
                        <span>Relevant Coursework:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {edu.coursework.map((cw) => (
                          <span
                            key={cw}
                            className="px-2 py-1 rounded text-[11px] bg-white/[0.04] border border-white/10 text-white/80"
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

