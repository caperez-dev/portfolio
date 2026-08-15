import React, { useState, useEffect, useRef } from 'react';
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
    <section id="contact" className="py-16 sm:py-20 border-t border-white/8 relative scroll-mt-16 bg-[#141414] overflow-hidden">
      {/* Decorative Ambient Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ff9500]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#ffb340]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1c1c1e_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

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
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Contact Carlos
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
            className="p-6 rounded-2xl border flex flex-col justify-between bg-[#1c1c1e]/65 backdrop-blur-xl border-white/10"
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
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-white/90 font-bold break-all">
                        {resumeData.contact.email}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(resumeData.contact.email);
                          alert('Email address copied to clipboard!');
                        }}
                        className="px-2 py-0.5 rounded text-[10px] bg-white/[0.04] hover:bg-white/[0.08] text-white/80 border border-white/10 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
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
            className="lg:col-span-2 p-6 sm:p-8 rounded-2xl border shadow-xl bg-[#1c1c1e]/60 backdrop-blur-xl border-white/10"
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
                    placeholder="Enter your full name"
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
                    placeholder="Enter your email address"
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
                    Mobile / Phone <span className="text-[#ff9500]">*</span>
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
                      placeholder="Enter phone number"
                      required
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
                  Message Details <span className="text-[#ff9500]">*</span>
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter message details"
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
