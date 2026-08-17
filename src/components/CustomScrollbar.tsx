import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useSpring, useTransform, MotionValue } from 'motion/react';
import { Rocket } from 'lucide-react';

type ScrollDirection = 'idle' | 'up' | 'down';

const BASE_OFFSET = -45;
const ROTATION_IDLE = BASE_OFFSET;
const ROTATION_DOWN = BASE_OFFSET + 180;
const ROTATION_UP = BASE_OFFSET;

const TRACK_TOP_VH = 10;
const TRACK_HEIGHT_VH = 80;
const THUMB_SIZE_PX = 28;

export function CustomScrollbar() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.2,
  });

  const [viewportH, setViewportH] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerHeight : 800
  );
  const [direction, setDirection] = useState<ScrollDirection>('idle');
  const lastYRef = useRef(0);
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartClientYRef = useRef(0);
  const dragStartScrollYRef = useRef(0);
  const trackTopRef = useRef<number>(0);
  const trackHeightRef = useRef<number>(0);
  const trackElRef = useRef<HTMLDivElement | null>(null);
  const manualThumbYRef = useRef<MotionValue<number> | null>(null);
  const [thumbYMode, setThumbYMode] = useState<'scroll' | 'drag'>('scroll');

  const travelPx = Math.max(
    0,
    viewportH * (TRACK_HEIGHT_VH / 100) - THUMB_SIZE_PX
  );

  const autoThumbY = useTransform(smoothProgress, [0, 1], [0, travelPx]);
  const rotation = useTransform(() => {
    switch (direction) {
      case 'down':
        return ROTATION_DOWN;
      case 'up':
        return ROTATION_UP;
      default:
        return ROTATION_IDLE;
    }
  });

  const activeThumbY: MotionValue<number> =
    thumbYMode === 'drag' && manualThumbYRef.current
      ? manualThumbYRef.current
      : autoThumbY;

  useEffect(() => {
    const handleResize = () => setViewportH(window.innerHeight);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isDraggingRef.current) return;

      const currentY = window.scrollY;
      const diff = currentY - lastYRef.current;

      if (Math.abs(diff) > 0.5) {
        setDirection(diff > 0 ? 'down' : 'up');
      }
      lastYRef.current = currentY;

      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = setTimeout(() => setDirection('idle'), 160);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, []);

  const updateTrackMetrics = useCallback(() => {
    if (trackElRef.current) {
      const rect = trackElRef.current.getBoundingClientRect();
      trackTopRef.current = rect.top;
      trackHeightRef.current = rect.height;
    } else {
      trackTopRef.current = window.innerHeight * (TRACK_TOP_VH / 100);
      trackHeightRef.current = window.innerHeight * (TRACK_HEIGHT_VH / 100);
    }
  }, []);

  const setScrollFromOffset = useCallback(
    (offsetPx: number) => {
      const travel = Math.max(
        1,
        trackHeightRef.current - THUMB_SIZE_PX
      );
      const ratio = Math.min(1, Math.max(0, offsetPx / travel));
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const target = ratio * maxScroll;
      window.scrollTo({ top: target, behavior: 'auto' });
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      updateTrackMetrics();
      isDraggingRef.current = true;
      setIsDragging(true);
      dragStartClientYRef.current = e.clientY;
      dragStartScrollYRef.current = window.scrollY;

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const startRatio = maxScroll > 0 ? dragStartScrollYRef.current / maxScroll : 0;
      const travel = Math.max(1, trackHeightRef.current - THUMB_SIZE_PX);
      const startY = startRatio * travel;

      if (!manualThumbYRef.current) {
        manualThumbYRef.current = new MotionValue(startY);
      } else {
        manualThumbYRef.current.set(startY);
      }
      setThumbYMode('drag');

      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      e.preventDefault();
    },
    [updateTrackMetrics]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;

      const offsetInTrack =
        e.clientY - trackTopRef.current - THUMB_SIZE_PX / 2;
      const travel = Math.max(1, trackHeightRef.current - THUMB_SIZE_PX);
      const clamped = Math.min(travel, Math.max(0, offsetInTrack));

      if (manualThumbYRef.current) {
        manualThumbYRef.current.set(clamped);
      }

      setScrollFromOffset(clamped);
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
      setThumbYMode('scroll');
      lastYRef.current = window.scrollY;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDragging, setScrollFromOffset]);

  return (
    <div
      ref={trackElRef}
      className="hidden md:block fixed z-[90] pointer-events-none"
      style={{
        top: `${TRACK_TOP_VH}vh`,
        right: 0,
        height: `${TRACK_HEIGHT_VH}vh`,
        width: '20px',
        userSelect: 'none',
      }}
      aria-hidden="true"
    >
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,149,0,0.55) 0%, rgba(255,149,0,0.25) 45%, rgba(51,65,85,0.35) 100%)',
        }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-auto cursor-grab active:cursor-grabbing"
        style={{
          y: activeThumbY,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onPointerDown={handlePointerDown}
      >
        <motion.div
          className="w-full h-[28px] flex items-center justify-center"
          style={{
            rotate: rotation,
            transition: 'rotate 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full opacity-70 blur-[5px]"
              style={{
                background:
                  'radial-gradient(circle, rgba(255,149,0,0.6) 0%, transparent 70%)',
              }}
            />
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150"
              style={{
                width: isDragging ? '44px' : '36px',
                height: isDragging ? '44px' : '36px',
                background: isDragging
                  ? 'radial-gradient(circle, rgba(255,149,0,0.25) 0%, transparent 70%)'
                  : 'transparent',
              }}
            />
            <Rocket
              className="w-5 h-5 relative"
              style={{
                color: '#ff9500',
                filter:
                  'drop-shadow(0 0 5px rgba(255,149,0,0.7)) drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
                transform: isDragging ? 'scale(1.15)' : 'scale(1)',
                transition: 'transform 0.15s ease',
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
