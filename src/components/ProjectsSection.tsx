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
  // Calculate distance from center
  const distance = Math.abs(position);
  
  // Calculate transforms based on position
  const getScale = () => {
    if (distance === 0) return 1;
    if (distance === 1) return 0.7;
    if (distance === 2) return 0.5;
    return 0.35;
  };

  const getOpacity = () => {
    if (distance === 0) return 1;
    if (distance === 1) return 0.6;
    if (distance === 2) return 0.3;
    return 0.1;
  };

  const getRotateY = () => {
    if (position === 0) return 0;
    return position > 0 ? -25 : 25;
  };

  const getTranslateX = () => {
    if (position === 0) return 0;
    const baseOffset = 280;
    return position > 0 ? baseOffset * position * 0.6 : baseOffset * position * 0.6;
  };

  const scale = getScale();
  const opacity = getOpacity();
  const rotateY = getRotateY();
  const translateX = getTranslateX();

  return (
    <motion.div
      onClick={onClick}
      className={`absolute w-96 flex-shrink-0 cursor-pointer transition-all ${
        !isCenter ? 'pointer-events-auto' : ''
      }`}
      style={{
        perspective: '1200px',
        left: '50%',
        marginLeft: '-192px'
      }}
      animate={{
        scale,
        opacity,
        x: translateX,
        rotateY,
        zIndex: Math.max(0, 10 - distance)
      }}
      transition={{
        duration: 0.5,
        ease: 'easeInOut'
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
        <div className="p-6 flex flex-col flex-grow">
          {/* Category Badge */}
          <div className="mb-3 flex items-center gap-1">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-[#ff9500]/12 text-[#ff9500] border border-[#ff9500]/30 flex items-center gap-1 w-fit">
              {project.category === 'capstone' && <Sparkles className="w-3 h-3" />}
              {project.category === 'web' && <Globe className="w-3 h-3" />}
              {project.category === 'mobile' && <Smartphone className="w-3 h-3" />}
              {project.category === 'system' && <Server className="w-3 h-3" />}
              <span>{project.subtitle}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
            {project.title}
          </h3>

          {/* Description Preview */}
          <p className="text-xs text-white/60 mb-4 line-clamp-2">
            {project.description[0]}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-white/[0.05] border border-white/10 text-white/70"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold text-white/50">
                +{project.technologies.length - 3}
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
  const maxVisible = 5; // Number of cards to show (left + center + right + buffer)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Calculate which projects to display and their positions
  const getProjectPosition = (index: number) => {
    const diff = index - currentIndex;
    // Wrap around for circular carousel
    if (diff > projects.length / 2) {
      return diff - projects.length;
    } else if (diff < -projects.length / 2) {
      return diff + projects.length;
    }
    return diff;
  };

  return (
    <section id="projects" className="py-16 sm:py-24 border-t border-white/8 relative scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-[#ff9500] text-xs font-semibold uppercase tracking-wide mb-3">
            <FolderGit2 className="w-4 h-4" />
            <span>01 // Featured Projects</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Scroll Through My Work
          </h2>
        </motion.div>

        {/* Coverflow Carousel Container */}
        <div className="relative flex justify-center">
          {/* Carousel */}
          <div className="relative w-full h-[600px] flex items-center justify-center">
            {/* 3D Perspective Container */}
            <div
              style={{
                perspective: '1500px',
                width: '100%',
                height: '100%',
                position: 'relative'
              }}
            >
              {/* Projects Track */}
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
                        if (position !== 0) {
                          handleDotClick(idx);
                        }
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Left Arrow */}
            <motion.button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-[#ff9500]/30 text-white hover:text-[#ff9500] border border-white/20 hover:border-[#ff9500]/50 transition-all group -translate-x-20 lg:-translate-x-12"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            {/* Right Arrow */}
            <motion.button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-[#ff9500]/30 text-white hover:text-[#ff9500] border border-white/20 hover:border-[#ff9500]/50 transition-all group translate-x-20 lg:translate-x-12"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="mt-12 flex justify-center gap-2">
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

