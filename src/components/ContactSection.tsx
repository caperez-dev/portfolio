import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeOption, ContactFormData, ContactSubmitResponse } from '../types';
import { countryCodes } from '../data/countryCodes';
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

// Convert flag emoji → ISO 3166-1 alpha-2 code → flagcdn.com image URL
// Each flag emoji is two regional indicator letters (U+1F1E6–U+1F1FF)
function flagEmojiToIso(flag: string): string {
  return [...flag]
    .map((c) => String.fromCharCode(c.codePointAt(0)! - 0x1F1E6 + 65))
    .join('')
    .toLowerCase();
}

function FlagImg({ flag, className = '' }: { flag: string; className?: string }) {
  const iso = flagEmojiToIso(flag);
  return (
    <img
      src={`https://flagcdn.com/w20/${iso}.png`}
      srcSet={`https://flagcdn.com/w40/${iso}.png 2x`}
      alt=""
      aria-hidden="true"
      className={`inline-block object-cover ${className}`}
      style={{ width: '20px', height: '14px' }}
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
    />
  );
}

// Same font stack used in the Navbar for visual consistency
const appleFontStack =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Helvetica Neue', sans-serif";

interface ContactSectionProps {
  currentTheme: ThemeOption;
  isDarkMode: boolean;
}

// ── Particle canvas ────────────────────────────────────────────────────────────
const DOT_COUNT  = 80;
const MAX_DIST   = 130;
const DOT_RADIUS = 1.8;
const DOT_SPEED  = 0.35;
const ACCENT     = '245, 166, 35';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function makeParticle(w: number, h: number): Particle {
  const angle = Math.random() * Math.PI * 2;
  return {
    x:  Math.random() * w,
    y:  Math.random() * h,
    vx: Math.cos(angle) * DOT_SPEED,
    vy: Math.sin(angle) * DOT_SPEED,
  };
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const rafRef    = useRef<number>(0);

  const init = useCallback((w: number, h: number) => {
    particles.current = Array.from({ length: DOT_COUNT }, () => makeParticle(w, h));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width  = rect.width;
      canvas.height = rect.height;
      init(canvas.width, canvas.height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    const draw = () => {
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      const pts = particles.current;

      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x += w; if (p.x > w) p.x -= w;
        if (p.y < 0) p.y += h; if (p.y > h) p.y -= h;
      }

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx   = pts[i].x - pts[j].x;
          const dy   = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.35;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${ACCENT}, ${alpha})`;
            ctx.lineWidth   = 0.8;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle   = `rgba(${ACCENT}, 0.7)`;
        ctx.shadowBlur  = 6;
        ctx.shadowColor = `rgba(${ACCENT}, 0.5)`;
        ctx.fill();
        ctx.shadowBlur  = 0;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none', zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
// ──────────────────────────────────────────────────────────────────────────────

export function ContactSection({ currentTheme, isDarkMode }: ContactSectionProps) {
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [countryCode, setCountryCode]               = useState('+1');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement | null>(null);

  const [fieldErrors, setFieldErrors]   = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<ContactSubmitResponse | null>(null);

  const selectedCountry = countryCodes.find((c) => c.dialCode === countryCode) ?? countryCodes[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);
    setFieldErrors({});

    const normalizedPhone = formData.phone.trim();
    const phonePayload    = normalizedPhone.startsWith('+') ? normalizedPhone : `${countryCode} ${normalizedPhone}`;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'x-vercel-protection-bypass': '1'
        },
        body: JSON.stringify({ ...formData, phone: phonePayload })
      });

      const data: ContactSubmitResponse = await response.json();

      if (!response.ok || !data.success) {
        if (data.errors) setFieldErrors(data.errors);
        setSubmitResult({
          success: false,
          message: data.message || 'Failed to submit contact message. Please try again.'
        });
      } else {
        setSubmitResult(data);
        setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch {
      setSubmitResult({
        success: false,
        message: 'Network error occurred. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-12 sm:py-16 border-t border-white/8 relative overflow-hidden scroll-mt-16">
      <ParticleCanvas />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-10 text-left"
        >
          <div className="flex items-center gap-2 text-[#ff9500] text-xs font-semibold uppercase tracking-wide">
            <Mail className="w-4 h-4" />
            <span>06 // Contact</span>
          </div>
        </motion.div>

        {/* Two-stage panel */}
        <AnimatePresence mode="wait">
          {!showForm ? (
            /* ── Stage 1: CTA ── */
            <motion.div
              key="cta"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={`p-8 sm:p-14 rounded-2xl border shadow-xl flex flex-col items-center justify-center text-center min-h-[320px] ${
                isDarkMode
                  ? `${currentTheme.darkCard} ${currentTheme.darkBorder}`
                  : `${currentTheme.lightCard} ${currentTheme.lightBorder}`
              }`}
              style={{ fontFamily: appleFontStack }}
            >
              {/* Availability badge */}
              <div className="flex items-center gap-2 mb-6">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold border ${
                  isDarkMode
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                    : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-500'
                }`}>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  Available for work
                </span>
              </div>

              {/* Heading */}
              <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-8 ${
                isDarkMode ? currentTheme.darkText : currentTheme.lightText
              }`}>
                Let's build your<br />next project.
              </h2>

              {/* CTA button */}
              <div>
                <motion.button
                  onClick={() => setShowForm(true)}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center px-6 py-2.5 rounded-xl text-sm font-semibold text-[#ff9500] border border-[#ff9500]/40 bg-[#ff9500]/8 hover:bg-[#ff9500]/15 transition-colors"
                >
                  Contact Me
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* ── Stage 2: Form ── */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={`p-6 sm:p-8 rounded-2xl border shadow-xl ${
                isDarkMode
                  ? `${currentTheme.darkCard} ${currentTheme.darkBorder}`
                  : `${currentTheme.lightCard} ${currentTheme.lightBorder}`
              }`}
              style={{ fontFamily: appleFontStack }}
            >
              {/* Back button */}
              <button
                onClick={() => setShowForm(false)}
                className="flex items-center gap-1.5 text-[11px] text-white/50 hover:text-white/80 transition-colors mb-5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>

              {submitResult && (
                <div className={`p-4 rounded-xl mb-6 text-xs flex items-start gap-3 border ${
                  submitResult.success
                    ? 'border-[#ff9500]/30 bg-[#ff9500]/10'
                    : 'border-orange-500/30 bg-orange-500/10'
                }`}>
                  {submitResult.success
                    ? <CheckCircle2 className="w-5 h-5 text-[#ff9500] shrink-0 mt-0.5" />
                    : <AlertCircle  className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  }
                  <p className="font-bold text-white">{submitResult.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1">
                      Full Name <span className="text-[#ff9500]">*</span>
                    </label>
                    <input
                      type="text" name="fullName" value={formData.fullName}
                      onChange={handleChange} placeholder="Your full name" required
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-all focus:outline-none ${
                        fieldErrors.fullName ? 'border-red-500' : 'border-white/10 focus:border-[#ff9500]/50 focus:ring-1 focus:ring-[#ff9500]/40'
                      } bg-white/[0.04] text-white placeholder-white/35`}
                    />
                    {fieldErrors.fullName && <span className="text-[10px] text-red-400 mt-1 block">{fieldErrors.fullName}</span>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1">
                      Email Address <span className="text-[#ff9500]">*</span>
                    </label>
                    <input
                      type="email" name="email" value={formData.email}
                      onChange={handleChange} placeholder="you@domain.com" required
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-all focus:outline-none ${
                        fieldErrors.email ? 'border-red-500' : 'border-white/10 focus:border-[#ff9500]/50 focus:ring-1 focus:ring-[#ff9500]/40'
                      } bg-white/[0.04] text-white placeholder-white/35`}
                    />
                    {fieldErrors.email && <span className="text-[10px] text-red-400 mt-1 block">{fieldErrors.email}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1">
                      Mobile / Phone <span className="text-white/35 font-normal">(Optional)</span>
                    </label>
                    <div className="flex items-stretch gap-2">
                      <div className="relative" ref={countryDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsCountryDropdownOpen((prev) => !prev)}
                          className={`flex items-center gap-1 px-3.5 py-2.5 rounded-xl text-xs border transition-all focus:outline-none ${
                            fieldErrors.phone ? 'border-red-500' : 'border-white/10 focus:border-[#ff9500]/50 focus:ring-1 focus:ring-[#ff9500]/40'
                          } bg-white/[0.04] text-white`}
                        >
                          <FlagImg flag={selectedCountry.flag} className="shrink-0 rounded-sm" />
                          <span>{selectedCountry.dialCode}</span>
                        </button>
                        {isCountryDropdownOpen && (
                          <div className="absolute z-20 mt-2 max-h-72 w-52 overflow-auto rounded-2xl border border-white/10 bg-[#141414] shadow-2xl">
                            {countryCodes.map((country) => (
                              <button
                                key={country.dialCode + country.name}
                                type="button"
                                onClick={() => { setCountryCode(country.dialCode); setIsCountryDropdownOpen(false); }}
                                className="w-full px-3 py-2 text-left text-xs text-white hover:bg-white/[0.04] flex items-center gap-2"
                              >
                                <FlagImg flag={country.flag} className="shrink-0 rounded-sm" />
                                <span>{country.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <input
                        type="tel" name="phone" value={formData.phone}
                        onChange={handleChange} placeholder="Mobile Number"
                        className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs border transition-all focus:outline-none ${
                          fieldErrors.phone ? 'border-red-500' : 'border-white/10 focus:border-[#ff9500]/50 focus:ring-1 focus:ring-[#ff9500]/40'
                        } bg-white/[0.04] text-white placeholder-white/35`}
                      />
                    </div>
                    {fieldErrors.phone && <span className="text-[10px] text-red-400 mt-1 block">{fieldErrors.phone}</span>}
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1">
                      Subject <span className="text-[#ff9500]">*</span>
                    </label>
                    <input
                      type="text" name="subject" value={formData.subject}
                      onChange={handleChange} placeholder="Enter subject" required
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-all focus:outline-none ${
                        fieldErrors.subject ? 'border-red-500' : 'border-white/10 focus:border-[#ff9500]/50 focus:ring-1 focus:ring-[#ff9500]/40'
                      } bg-white/[0.04] text-white placeholder-white/35`}
                    />
                    {fieldErrors.subject && <span className="text-[10px] text-red-400 mt-1 block">{fieldErrors.subject}</span>}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                    Message <span className="text-[#ff9500]">*</span>
                  </label>
                  <textarea
                    name="message" rows={4} value={formData.message}
                    onChange={handleChange} placeholder="Tell me about the project" required
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-all focus:outline-none resize-none ${
                      fieldErrors.message ? 'border-red-500' : 'border-white/10 focus:border-[#ff9500]/50 focus:ring-1 focus:ring-[#ff9500]/40'
                    } bg-white/[0.04] text-white placeholder-white/35`}
                  />
                  {fieldErrors.message && <span className="text-[10px] text-red-400 mt-1 block">{fieldErrors.message}</span>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`py-2.5 px-6 rounded-xl text-xs font-semibold text-[#ff9500] border border-[#ff9500]/40 bg-[#ff9500]/8 hover:bg-[#ff9500]/15 transition-colors flex items-center gap-2 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-[#ff9500]/30 border-t-[#ff9500] rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Message</span>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
