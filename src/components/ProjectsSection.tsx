import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { resumeData } from '../data/resume';
import { ThemeOption } from '../types';
import {
  FolderGit2,
  ChevronLeft,
  ChevronRight,
  Globe,
  Smartphone,
  Sparkles,
  Server,
  Play,
  X
} from 'lucide-react';

const quizzleVideo = new URL('../assets/projects/quizzle_video.mp4', import.meta.url).href;
const summitVideo = new URL('../assets/projects/summit_video.mp4', import.meta.url).href;

const projectVideos: Record<string, { src: string; title: string }> = {
  quizzle: {
    src: quizzleVideo,
    title: 'Quizzle: An AI-driven Web App for Personalized Online Learning',
  },
  summit: {
    src: summitVideo,
    title: 'Summit: To-Do List & Calendar Mobile App',
  },
};

interface ProjectsSectionProps {
  currentTheme: ThemeOption;
  isDarkMode: boolean;
}

interface ProjectCardProps {
  project: typeof resumeData.projects[0];
  isCenter: boolean;
  position: number;
  maxVisible: number;
  onClick: () => void;
  onWatchDemo?: () => void;
  isNarrow: boolean;
}

function ProjectCard({ project, isCenter, position, maxVisible, onClick, onWatchDemo, isNarrow }: ProjectCardProps) {
  const distance = Math.abs(position);

  const getScale = () => {
    if (distance === 0) return 1;
    if (distance === 1) return 0.72;
    if (distance === 2) return 0.52;
    return 0.38;
  };

  const getOpacity = () => {
    if (distance === 0) return 1;
    if (distance === 1) return 0.55;
    if (distance === 2) return 0.25;
    return 0.08;
  };

  const getRotateY = () => {
    if (position === 0) return 0;
    return position > 0 ? -28 : 28;
  };

  const getTranslateX = () => {
    if (position === 0) return 0;
    const baseOffset = isNarrow ? 210 : 420;
    return position * baseOffset * 0.68;
  };

  return (
    <motion.div
      onClick={onClick}
      className={`absolute flex-shrink-0 cursor-pointer
        w-[min(78vw,300px)] sm:w-[440px] lg:w-[560px]
        ${!isCenter ? 'pointer-events-auto' : ''}
      `}
      style={{
        perspective: '1400px',
        left: '50%',
      }}
      animate={{
        scale: getScale(),
        opacity: getOpacity(),
        x: `calc(-50% + ${getTranslateX()}px)`,
        rotateY: getRotateY(),
        zIndex: Math.max(0, 10 - distance)
      }}
      transition={{
        type: 'spring',
        stiffness: 280,
        damping: 30,
        mass: 0.8
      }}
    >
      <div
        className={`bg-[#1c1c1e]/80 backdrop-blur-xl rounded-2xl border overflow-hidden shadow-2xl h-full flex flex-col ${
          isCenter ? 'border-[#ff9500]/50 shadow-[#ff9500]/20' : 'border-white/10'
        }`}
      >
        {/* Project Image */}
        {project.images && project.images.length > 0 && (
          <div className="relative w-full aspect-video overflow-hidden bg-slate-950/60">
            <img
              src={project.images[0]}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1c1c1e]/80" />
            {onWatchDemo && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onWatchDemo(); }}
                className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 inline-flex items-center justify-center rounded-full border border-[#ff9500]/60 bg-black/50 backdrop-blur-sm text-[#ff9500] hover:bg-[#ff9500]/30 hover:text-[#ffb340] hover:border-[#ff9500] transition-all w-8 h-8 sm:w-10 sm:h-10 shadow-xl shadow-black/40 hover:scale-110 active:scale-95 z-10"
                aria-label="Watch demo video"
              >
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              </button>
            )}
          </div>
        )}

        {/* Project Info */}
        <div className="p-3.5 sm:p-7 flex flex-col flex-grow">
          {/* Category Badge + Date Range */}
          <div className="mb-2 sm:mb-3 flex items-center justify-between gap-2">
            <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-[9px] sm:text-[11px] font-mono font-bold uppercase tracking-wider bg-[#ff9500]/12 text-[#ff9500] border border-[#ff9500]/30 flex items-center gap-1 sm:gap-1.5 w-fit">
              {project.category === 'capstone' && <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
              {project.category === 'web' && <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
              {project.category === 'mobile' && <Smartphone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
              {project.category === 'system' && <Server className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
              <span>{project.subtitle}</span>
            </span>
            {project.dateRange && (
              <span className="text-[9px] sm:text-[11px] font-mono text-white/40 whitespace-nowrap shrink-0">
                {project.dateRange}
              </span>
            )}
          </div>

          {/* Title + Logo */}
          <div className="flex items-start gap-2.5 sm:gap-4 mb-2 sm:mb-2.5">
            <h3 className="text-[15px] sm:text-xl lg:text-2xl font-bold text-white line-clamp-2 min-w-0 flex-1 leading-snug">
              {project.title}
            </h3>
            {project.logo && (
              <img
                src={project.logo}
                alt={`${project.title} logo`}
                className="shrink-0 w-9 h-9 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain"
                title={project.title}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
          </div>

          <p className="text-[11px] sm:text-sm text-white/60 mb-3 sm:mb-5 leading-relaxed line-clamp-3 sm:line-clamp-none">
            {project.description[0]}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-auto">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded text-[8px] sm:text-[10px] font-mono font-bold bg-white/[0.05] border border-white/10 text-white/70"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection({ currentTheme, isDarkMode }: ProjectsSectionProps) {
  const projects = resumeData.projects;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeVideoProject, setActiveVideoProject] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const maxVisible = 5;
  const activeVideo = activeVideoProject ? projectVideos[activeVideoProject] : null;
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px)');
    const update = () => setIsNarrow(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  // Close on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveVideoProject(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Play when modal opens, pause when it closes
  useEffect(() => {
    if (activeVideoProject) {
      // Small delay to let the modal animate in before playing
      const t = setTimeout(() => { videoRef.current?.play(); }, 150);
      return () => clearTimeout(t);
    } else {
      videoRef.current?.pause();
    }
  }, [activeVideoProject]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const getProjectPosition = (index: number) => {
    const diff = index - currentIndex;
    if (diff > projects.length / 2) return diff - projects.length;
    if (diff < -projects.length / 2) return diff + projects.length;
    return diff;
  };

  return (
    <section id="projects" className="py-16 sm:py-20 border-t border-white/8 relative scroll-mt-16">
      {/* Wider than the standard content column — bleed to near full viewport */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-7 sm:mb-12 text-left"
        >
          <div className="flex items-center gap-2 text-[#ff9500] text-[11px] sm:text-xs font-semibold uppercase tracking-wide mb-2 sm:mb-3">
            <FolderGit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>01 // Recent Projects</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Scroll Through My Work
          </h2>
        </motion.div>

        {/* Carousel wrapper — overflow hidden so side cards clip cleanly */}
        <div className="relative overflow-hidden">
          {/* Track: tall enough for the full-size card */}
          <div className="relative w-full min-h-[390px] sm:min-h-[580px] lg:min-h-[660px] flex items-center justify-center">
            <div
              style={{
                perspective: '1500px',
                width: '100%',
                height: '100%',
                position: 'relative'
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {projects.map((project, idx) => {
                  const position = getProjectPosition(idx);
                  const isVisible = Math.abs(position) <= 2;
                  if (!isVisible) return null;

                  return (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      isCenter={position === 0}
                      position={position}
                      maxVisible={maxVisible}
                      onWatchDemo={projectVideos[project.id] ? () => setActiveVideoProject(project.id) : undefined}
                      isNarrow={isNarrow}
                      onClick={() => {
                        if (position !== 0) handleDotClick(idx);
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Left Arrow — sits just inside the container edges */}
            <motion.button
              onClick={handlePrev}
              className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-[#ff9500]/30 text-white hover:text-[#ff9500] border border-white/20 hover:border-[#ff9500]/50 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>

            {/* Right Arrow */}
            <motion.button
              onClick={handleNext}
              className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-[#ff9500]/30 text-white hover:text-[#ff9500] border border-white/20 hover:border-[#ff9500]/50 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="mt-8 flex justify-center gap-2">
          {projects.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`rounded-full transition-all ${
                idx === currentIndex
                  ? 'bg-[#ff9500] shadow-lg shadow-[#ff9500]/50 w-3 h-3'
                  : 'bg-white/20 hover:bg-white/40 w-2 h-2'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>

      {/* Project demo video modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideoProject(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1c1c1e] border border-white/10 rounded-3xl p-4 sm:p-6 max-w-3xl w-full flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/8">
                <span className="text-sm font-bold text-white">
                  {activeVideo.title}
                </span>
                <button
                  onClick={() => setActiveVideoProject(null)}
                  className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white transition-colors"
                  aria-label="Close video modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video */}
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#141414] aspect-video">
                <video
                  ref={videoRef}
                  src={activeVideo.src}
                  controls
                  className="w-full h-full object-contain"
                  preload="metadata"
                />
              </div>

              <p className="pt-3 text-center text-xs font-mono text-white/60">
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
