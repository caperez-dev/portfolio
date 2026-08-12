import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { resumeData } from '../data/resume';
import { ThemeOption } from '../types';
import {
  FolderGit2,
  Server,
  Globe,
  Smartphone,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Maximize2,
  X,
  Image as ImageIcon
} from 'lucide-react';

interface ProjectsSectionProps {
  currentTheme: ThemeOption;
  isDarkMode: boolean;
}

export function ProjectsSection({ currentTheme, isDarkMode }: ProjectsSectionProps) {
  const [filter, setFilter] = useState<'all' | 'capstone' | 'web' | 'mobile' | 'system'>('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeModalImg, setActiveModalImg] = useState<{ src: string; title: string; index: number } | null>(null);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'capstone', label: 'Capstone Project' },
    { id: 'web', label: 'Web Applications' },
    { id: 'mobile', label: 'Mobile Apps' }
  ];

  // Filtering logic:
  // If filter is 'all' and not expanded, showcase Quizzle and Paramdam Cafe first.
  const allFiltered =
    filter === 'all'
      ? resumeData.projects
      : resumeData.projects.filter((p) => p.category === filter);

  const displayedProjects =
    filter === 'all' && !isExpanded
      ? resumeData.projects.filter((p) => p.id === 'quizzle' || p.id === 'paramdam')
      : allFiltered;

  const hiddenCount = resumeData.projects.length - 2;

  return (
    <section id="projects" className="py-12 sm:py-16 border-t border-slate-800/40 relative scroll-mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-8 text-left"
        >
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
            <FolderGit2 className="w-4 h-4" />
            <span>01 // Projects</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isDarkMode ? currentTheme.darkText : currentTheme.lightText
            }`}
          >
            Featured Software Projects
          </h2>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setFilter(cat.id as any);
                if (cat.id !== 'all') {
                  setIsExpanded(true);
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filter === cat.id
                  ? 'bg-cyan-500 text-white font-bold shadow-md shadow-cyan-500/20'
                  : isDarkMode
                  ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {displayedProjects.map((proj, idx) => (
              <motion.div
                key={proj.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: 'easeOut' }}
                className={`p-6 rounded-2xl border shadow-xl flex flex-col justify-between transition-all hover:border-cyan-500/50 ${
                  isDarkMode
                    ? `${currentTheme.darkCard} ${currentTheme.darkBorder}`
                    : `${currentTheme.lightCard} ${currentTheme.lightBorder}`
                }`}
              >
                <div>
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                      {proj.category === 'capstone' && <Sparkles className="w-3 h-3 text-cyan-400" />}
                      {proj.category === 'web' && <Globe className="w-3 h-3 text-indigo-400" />}
                      {proj.category === 'mobile' && <Smartphone className="w-3 h-3 text-emerald-400" />}
                      {proj.category === 'system' && <Server className="w-3 h-3 text-yellow-400" />}
                      <span>{proj.subtitle}</span>
                    </span>

                    {proj.hosting && (
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Server className="w-3 h-3 text-cyan-400" /> Host: {proj.hosting}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-100 mb-4 leading-snug">
                    {proj.title}
                  </h3>

                  {/* Screenshots Showcase (Overlapping 2 Screenshots per project) */}
                  {proj.images && proj.images.length > 0 && (
                    <div className="mb-5">
                      {/* Overlapping Photos Stack */}
                      <div className="relative h-44 sm:h-48 w-full rounded-2xl bg-slate-950/60 border border-slate-800/80 p-2 overflow-hidden flex items-center justify-center">
                        {proj.images.slice(0, 2).map((imgUrl, imgIdx) => {
                          const isFirst = imgIdx === 0;
                          return (
                            <div
                              key={imgIdx}
                              onClick={() =>
                                setActiveModalImg({
                                  src: imgUrl,
                                  title: `${proj.title} (Screenshot ${imgIdx + 1})`,
                                  index: imgIdx + 1
                                })
                              }
                              className={`absolute w-[68%] aspect-video rounded-xl overflow-hidden border border-slate-700/90 bg-slate-900 cursor-pointer transition-all duration-300 group ${
                                isFirst
                                  ? 'top-2.5 left-2.5 z-10 -rotate-1 hover:rotate-0 hover:z-30 shadow-xl shadow-black/70 hover:scale-105 hover:border-cyan-400'
                                  : 'bottom-2.5 right-2.5 z-20 rotate-1 hover:rotate-0 hover:z-30 shadow-2xl shadow-black/90 hover:scale-105 hover:border-cyan-400 ring-1 ring-slate-800'
                              }`}
                            >
                              <img
                                src={imgUrl}
                                alt={`${proj.title} Screenshot ${imgIdx + 1}`}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {/* Overlay Hover Button */}
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2">
                                <div className="p-1 rounded-md bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
                                  <Maximize2 className="w-3 h-3" />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Bullets */}
                  <ul className="space-y-2 mb-6 text-xs text-slate-300 leading-relaxed">
                    {proj.description.map((desc, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Tags */}
                <div className="pt-4 border-t border-slate-700/40 flex flex-wrap gap-1.5">
                  {proj.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 border border-slate-800 text-slate-100"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Show More / Show Less Toggle Button (Visible when on 'All Projects' filter) */}
        {filter === 'all' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 text-center"
          >
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-6 py-3 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-400 font-bold text-xs uppercase tracking-wider hover:bg-slate-800 hover:border-cyan-400 transition-all shadow-lg hover:shadow-cyan-500/10 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>
                {isExpanded
                  ? 'Show Less Projects'
                  : `Show More Projects (${hiddenCount} More)`}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-cyan-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-cyan-400" />
              )}
            </button>
          </motion.div>
        )}
      </div>

      {/* Lightbox / Screenshot Modal */}
      <AnimatePresence>
        {activeModalImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModalImg(null)}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-700/80 rounded-2xl p-4 sm:p-6 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-bold text-slate-200">
                    {activeModalImg.title}
                  </h4>
                </div>
                <button
                  onClick={() => setActiveModalImg(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative flex-1 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center">
                <img
                  src={activeModalImg.src}
                  alt={activeModalImg.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[70vh] w-auto object-contain rounded-lg shadow-xl"
                />
              </div>

              <div className="pt-3 text-center text-xs font-mono text-slate-400">
                Click anywhere outside or press top-right X to close
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
