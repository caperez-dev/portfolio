import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { resumeData } from '../data/resume';
import { ThemeOption } from '../types';
import { Award, Calendar, CheckCircle2, Shield, ExternalLink, X } from 'lucide-react';
const philnitsLogo = new URL('../assets/certifications/philnits.png', import.meta.url).href;
const henkelLogo = new URL('../assets/work-education/henkel.png', import.meta.url).href;
// test
interface CertificationsSectionProps {
  currentTheme: ThemeOption;
  isDarkMode: boolean;
}

export function CertificationsSection({ currentTheme, isDarkMode }: CertificationsSectionProps) {
  const [activeImage, setActiveImage] = useState<{ src: string; title: string } | null>(null);

  return (
    <section id="certifications" className="py-12 sm:py-16 border-t border-white/8 relative scroll-mt-16 bg-[#141414]">
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
            <Award className="w-4 h-4 text-[#ff9500]" />
            <span>05 // Certifications</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Certifications, Achievements & Trainings
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
              className="p-5 rounded-2xl border shadow-md flex flex-col justify-between transition-all hover:scale-[1.02] bg-[#1c1c1e]/65 backdrop-blur-xl border-white/10 hover:border-[#ff9500]/40 hover:shadow-[#ff9500]/10 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.04] text-[#ff9500]">
                    {cert.title.includes('PHILNITS') ? (
                      <img src={philnitsLogo} alt="PHILNITS logo" className="h-8 w-8 object-contain" />
                    ) : cert.issuer.includes('Henkel') ? (
                      <img src={henkelLogo} alt="Henkel logo" className="h-8 w-8 object-contain" />
                    ) : (
                      <Shield className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#ff9500] uppercase tracking-wider">
                    {cert.issuer}
                  </span>
                </div>
                {cert.imageUrl ? (
                  <button
                    type="button"
                    onClick={() => setActiveImage({ src: cert.imageUrl!, title: cert.title })}
                    className="inline-flex items-center rounded-full border border-[#ff9500]/30 bg-[#1c1c1e] p-2 text-[#ff9500] transition hover:bg-[#1c1c1e]/80 hover:text-[#ffb340]"
                    aria-label={`Open ${cert.title} screenshot`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                ) : cert.url ? (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-[#ff9500]/30 bg-[#1c1c1e] p-2 text-[#ff9500] transition hover:bg-[#1c1c1e]/80 hover:text-[#ffb340]"
                    aria-label={`Open ${cert.title} certificate in a new tab`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : null}
              </div>

              <h3 className="text-sm font-semibold text-white mb-2 leading-snug">
                {cert.title}
              </h3>
              {cert.identifier && (
                <p className="text-[11px] text-white/60 mb-3 font-mono">
                  ID: <span className="text-white/80 font-semibold break-all">{cert.identifier}</span>
                </p>
              )}

              <div className="mt-4 pt-3 border-t border-white/8 flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1 text-white/60">
                  <Calendar className="w-3 h-3 text-[#ff9500]" /> {cert.date}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1c1c1e] border border-white/10 rounded-3xl p-4 sm:p-6 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{activeImage.title}</span>
                </div>
                <button
                  onClick={() => setActiveImage(null)}
                  className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#141414] flex items-center justify-center">
                <img
                  src={activeImage.src}
                  alt={activeImage.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[74vh] w-auto object-contain rounded-2xl shadow-xl"
                />
              </div>

              <div className="pt-3 text-center text-xs font-mono text-white/60">
                Click outside or press the X to close
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

