import { useState } from 'react';
import { motion } from 'motion/react';
import { resumeData } from '../data/resume';
import { ThemeOption } from '../types';
import {
  FolderGit2,
  ChevronLeft,
  ChevronRight,
  Globe,
  Smartphone,
  Sparkles,
  Server
} from 'lucide-react';

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
}

function ProjectCard({ project, isCenter, position, maxVisible, onClick }: ProjectCardProps) {
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

  // Wider offsets to fill the larger container
  const getTranslateX = () => {
    if (position === 0) return 0;
    const baseOffset = 420;
    return position * baseOffset * 0.68;
  };

  return (
    <motion.div
      onClick={onClick}
      className={`absolute flex-shrink-0 cursor-pointer
        w-[340px] sm:w-[440px] lg:w-[560px]
        ${!isCenter ? 'pointer-events-auto' : ''}
      `}
      style={{
        perspective: '1400px',
        left: '50%',
        // Half of lg card width
        marginLeft: 'calc(-280px)',
      }}
      animate={{
        scale: getScale(),
        opacity: getOpacity(),
        x: getTranslateX(),
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
          </div>
        )}

        {/* Project Info */}
        <div className="p-5 sm:p-7 flex flex-col flex-grow">
          {/* Category Badge */}
          <div className="mb-3 flex items-center gap-1">
            <span className="px-3 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-[#ff9500]/12 text-[#ff9500] border border-[#ff9500]/30 flex items-center gap-1.5 w-fit">
              {project.category === 'capstone' && <Sparkles className="w-3.5 h-3.5" />}
              {project.category === 'web' && <Globe className="w-3.5 h-3.5" />}
              {project.category === 'mobile' && <Smartphone className="w-3.5 h-3.5" />}
              {project.category === 'system' && <Server className="w-3.5 h-3.5" />}
              <span>{project.subtitle}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2.5 line-clamp-2">
            {project.title}
          </h3>

          {/* Description Preview */}
          <p className="text-sm text-white/60 mb-5 line-clamp-2 leading-relaxed">
            {project.description[0]}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-white/[0.05] border border-white/10 text-white/70"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold text-white/50">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection({ currentTheme, isDarkMode }: ProjectsSectionProps) {
  const projects = resumeData.projects;
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxVisible = 5;

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
          className="mb-12 text-left"
        >
          <div className="flex items-center gap-2 text-[#ff9500] text-xs font-semibold uppercase tracking-wide mb-3">
            <FolderGit2 className="w-4 h-4" />
            <span>01 // Recent Projects</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Scroll Through My Work
          </h2>
        </motion.div>

        {/* Carousel wrapper — overflow hidden so side cards clip cleanly */}
        <div className="relative overflow-hidden">
          {/* Track: tall enough for the full-size card */}
          <div className="relative w-full h-[480px] sm:h-[580px] lg:h-[660px] flex items-center justify-center">
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
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-[#ff9500]/30 text-white hover:text-[#ff9500] border border-white/20 hover:border-[#ff9500]/50 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            {/* Right Arrow */}
            <motion.button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-[#ff9500]/30 text-white hover:text-[#ff9500] border border-white/20 hover:border-[#ff9500]/50 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-6 h-6" />
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
    </section>
  );
}
