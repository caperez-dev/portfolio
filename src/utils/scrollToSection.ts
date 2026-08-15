const NAVBAR_OFFSET = 88;
const DEFAULT_DURATION = 650;

let animationFrameId: number | null = null;
let isScrolling = false;

export function getIsScrollingToSection(): boolean {
  return isScrolling;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function scrollToSection(
  sectionId: string,
  options: { offset?: number; duration?: number } = {}
): Promise<void> {
  const id = sectionId.replace(/^#/, '');
  const element = document.getElementById(id);
  if (!element) return Promise.resolve();

  const { offset = NAVBAR_OFFSET, duration = DEFAULT_DURATION } = options;
  const targetTop = Math.max(
    0,
    element.getBoundingClientRect().top + window.scrollY - offset
  );
  const startTop = window.scrollY;
  const distance = targetTop - startTop;

  if (Math.abs(distance) < 1) return Promise.resolve();

  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo({ top: targetTop, behavior: 'auto' });
    return Promise.resolve();
  }

  isScrolling = true;

  return new Promise((resolve) => {
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startTop + distance * easeInOutCubic(progress));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        animationFrameId = null;
        isScrolling = false;
        resolve();
      }
    };

    animationFrameId = requestAnimationFrame(step);
  });
}
