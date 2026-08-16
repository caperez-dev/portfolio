import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { ThemeOption, ContactFormData, ContactSubmitResponse } from '../types';
import { resumeData } from '../data/resume';
import { countryCodes } from '../data/countryCodes';
import {
  Send,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ContactSectionProps {
  currentTheme: ThemeOption;
  isDarkMode: boolean;
}

// ── Particle canvas ────────────────────────────────────────────────────────────
const DOT_COUNT   = 80;
const MAX_DIST    = 130;   // px — max distance to draw a connecting line
const DOT_RADIUS  = 1.8;
const DOT_SPEED   = 0.35;  // px/frame
const ACCENT      = '245, 166, 35'; // rgb of #f5a623

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
  const particles  = useRef<Particle[]>([]);
  const rafRef     = useRef<number>(0);

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

      // Move & wrap
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0)  p.x += w;
        if (p.x > w)  p.x -= w;
        if (p.y < 0)  p.y += h;
        if (p.y > h)  p.y -= h;
      }

      // Connecting lines
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

      // Dots
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT}, 0.7)`;
        ctx.fill();
        // subtle glow
        ctx.shadowBlur  = 6;
        ctx.shadowColor = `rgba(${ACCENT}, 0.5)`;
        ctx.fill();
        ctx.shadowBlur  = 0;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
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
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [countryCode, setCountryCode] = useState('+1');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement | null>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<ContactSubmitResponse | null>(null);

  const selectedCountry = countryCodes.find((country) => country.dialCode === countryCode) ?? countryCodes[0];

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);
    setFieldErrors({});

    const normalizedPhone = formData.phone.trim();
    const phonePayload = normalizedPhone.startsWith('+') ? normalizedPhone : `${countryCode} ${normalizedPhone}`;

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
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        setSubmitResult({
          success: false,
          message: data.message || 'Failed to submit contact message. Please try again.'
        });
      } else {
        setSubmitResult(data);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }
    } catch (err: any) {
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
      {/* Particle background */}
      <ParticleCanvas />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-10 text-left"
        >
          <div className="flex items-center gap-2 text-[#ff9500] text-xs font-semibold uppercase tracking-wide mb-2">
            <Mail className="w-4 h-4 text-[#ff9500]" />
            <span>06 // Contact</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isDarkMode ? currentTheme.darkText : currentTheme.lightText
            }`}
          >
            Let's start a project together
          </h2>
          <p className="text-sm text-white/80 mt-2 max-w-2xl">
            Got a project? Let's build it.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Direct Details & Security Card */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className={`p-6 rounded-2xl border flex flex-col justify-between shadow-xl ${
              isDarkMode
                ? `${currentTheme.darkCard} ${currentTheme.darkBorder}`
                : `${currentTheme.lightCard} ${currentTheme.lightBorder}`
            }`}
          >
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/8 pb-3">
                Contact Information
              </h3>

              <div className="space-y-4 text-xs font-mono">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/[0.04] text-[#ff9500] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-white/55 font-medium">Location</div>
                    <div className="text-white/90 font-bold">{resumeData.contact.location}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/[0.04] text-[#ff9500] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-white/55 font-medium">Email Address</div>
                    <span className="text-white/90 font-bold break-all mt-0.5 block">
                      {resumeData.contact.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/[0.04] text-[#ff9500] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-white/55 font-medium">Mobile / Phone</div>
                    <a
                      href={`tel:${resumeData.contact.phone.replace(/\s+/g, '')}`}
                      className="text-white/90 font-bold hover:underline"
                    >
                      {resumeData.contact.phone}
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className={`lg:col-span-2 p-6 sm:p-8 rounded-2xl border shadow-xl ${
              isDarkMode
                ? `${currentTheme.darkCard} ${currentTheme.darkBorder}`
                : `${currentTheme.lightCard} ${currentTheme.lightBorder}`
            }`}
          >
            {submitResult && (
              <div
                className={`p-4 rounded-xl mb-6 text-xs font-mono flex items-start gap-3 border ${
                  submitResult.success
                    ? 'border-[#ff9500]/30 bg-[#ff9500]/10'
                    : 'border-orange-500/30 bg-orange-500/10'
                }`}
              >
                {submitResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-[#ff9500] shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p className="font-bold text-white">{submitResult.message}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                    Full Name <span className="text-[#ff9500]">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-all focus:outline-none ${
                      fieldErrors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-[#ff9500]/50 focus:ring-1 focus:ring-[#ff9500]/40'
                    } bg-white/[0.04] text-white placeholder-white/35`}
                  />
                  {fieldErrors.fullName && (
                    <span className="text-[10px] text-red-400 mt-1 block">{fieldErrors.fullName}</span>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                    Email Address <span className="text-[#ff9500]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@domain.com"
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-all focus:outline-none ${
                      fieldErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-[#ff9500]/50 focus:ring-1 focus:ring-[#ff9500]/40'
                    } bg-white/[0.04] text-white placeholder-white/35`}
                  />
                  {fieldErrors.email && (
                    <span className="text-[10px] text-red-400 mt-1 block">{fieldErrors.email}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mobile / Phone */}
                <div>
                  <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                    Mobile / Phone{' '}
                    <span className="text-white/35 font-normal">(Optional)</span>
                  </label>
                  <div className="flex items-stretch gap-2">
                    <div className="relative" ref={countryDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsCountryDropdownOpen((prev) => !prev)}
                        className={`flex items-center gap-1 px-3.5 py-2.5 rounded-xl text-xs border transition-all focus:outline-none ${
                          fieldErrors.phone ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-[#ff9500]/50 focus:ring-1 focus:ring-[#ff9500]/40'
                        } bg-white/[0.04] text-white`}
                      >
                        <span>{selectedCountry.flag}</span>
                        <span>{selectedCountry.dialCode}</span>
                      </button>
                      {isCountryDropdownOpen && (
                        <div className="absolute z-20 mt-2 max-h-72 w-52 overflow-auto rounded-2xl border border-white/10 bg-[#141414] shadow-2xl">
                          {countryCodes.map((country) => (
                            <button
                              key={country.dialCode + country.name}
                              type="button"
                              onClick={() => {
                                setCountryCode(country.dialCode);
                                setIsCountryDropdownOpen(false);
                              }}
                              className="w-full px-3 py-2 text-left text-xs text-white hover:bg-white/[0.04]"
                            >
                              {country.flag} {country.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Mobile Number"
                      className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs border transition-all focus:outline-none ${
                        fieldErrors.phone ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-[#ff9500]/50 focus:ring-1 focus:ring-[#ff9500]/40'
                      } bg-white/[0.04] text-white placeholder-white/35`}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <span className="text-[10px] text-red-400 mt-1 block">{fieldErrors.phone}</span>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                    Subject <span className="text-[#ff9500]">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter subject"
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-all focus:outline-none ${
                      fieldErrors.subject ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-[#ff9500]/50 focus:ring-1 focus:ring-[#ff9500]/40'
                    } bg-white/[0.04] text-white placeholder-white/35`}
                  />
                  {fieldErrors.subject && (
                    <span className="text-[10px] text-red-400 mt-1 block">{fieldErrors.subject}</span>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                  Message <span className="text-[#ff9500]">*</span>
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about the project"
                  required
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-all focus:outline-none resize-none ${
                    fieldErrors.message ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-[#ff9500]/50 focus:ring-1 focus:ring-[#ff9500]/40'
                  } bg-white/[0.04] text-white placeholder-white/35`}
                />
                {fieldErrors.message && (
                  <span className="text-[10px] text-red-400 mt-1 block">{fieldErrors.message}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 px-6 rounded-xl text-xs font-bold text-black transition-all shadow-xl shadow-[#ff9500]/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] ${isSubmitting ? 'opacity-80' : ''}`}
                style={{
                  backgroundImage: 'linear-gradient(135deg, #ff9500, #ffb340)'
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Validating & Transmitting to Firestore...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-black" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

