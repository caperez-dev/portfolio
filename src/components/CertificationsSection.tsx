import { motion } from 'motion/react';
import { resumeData } from '../data/resume';
import { ThemeOption } from '../types';
import { Award, Calendar, CheckCircle2, Shield } from 'lucide-react';
// test
interface CertificationsSectionProps {
  currentTheme: ThemeOption;
  isDarkMode: boolean;
}

export function CertificationsSection({ currentTheme, isDarkMode }: CertificationsSectionProps) {
  return (
    <section id="certifications" className="py-12 sm:py-16 border-t border-slate-800/40 relative scroll-mt-16">
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
            <Award className="w-4 h-4" />
            <span>05 // Certifications</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isDarkMode ? currentTheme.darkText : currentTheme.lightText
            }`}
          >
            Certifications, Achievements & Seminars
          </h2>
        </motion.div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resumeData.certifications.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
              className={`p-5 rounded-2xl border shadow-md flex flex-col justify-between transition-all hover:scale-[1.02] ${
                isDarkMode
                  ? `${currentTheme.darkCard} ${currentTheme.darkBorder}`
                  : `${currentTheme.lightCard} ${currentTheme.lightBorder}`
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    {cert.issuer}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-100 mb-2 leading-snug">
                  {cert.title}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3 h-3 text-cyan-400" /> {cert.date}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
