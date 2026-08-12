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
        headers: {
          'Content-Type': 'application/json'
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
    <section id="contact" className="py-16 sm:py-20 border-t border-cyan-500/20 relative scroll-mt-16 bg-slate-950/80 overflow-hidden">
      {/* Decorative Ambient Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-10 text-left"
        >
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
            <Mail className="w-4 h-4" />
            <span>06 // Contact</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isDarkMode ? currentTheme.darkText : currentTheme.lightText
            }`}
          >
            Contact Carlos
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            Have an open software development opportunity, IT packaging task, or technical inquiry? Send a direct message below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Direct Details & Security Card */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className={`p-6 rounded-2xl border flex flex-col justify-between ${
              isDarkMode
                ? `${currentTheme.darkCard} ${currentTheme.darkBorder}`
                : `${currentTheme.lightCard} ${currentTheme.lightBorder}`
            }`}
          >
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-100 border-b border-slate-700/40 pb-3">
                Contact Information
              </h3>

              <div className="space-y-4 text-xs font-mono">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium">Location</div>
                    <div className="text-slate-200 font-bold">{resumeData.contact.location}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium">Email Address</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-cyan-400 font-bold break-all">
                        {resumeData.contact.email}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(resumeData.contact.email);
                          alert('Email address copied to clipboard!');
                        }}
                        className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium">Mobile / Phone</div>
                    <a
                      href={`tel:${resumeData.contact.phone.replace(/\s+/g, '')}`}
                      className="text-slate-200 font-bold hover:underline"
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
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-red-500/15 border-red-500/40 text-red-300'
                }`}
              >
                {submitResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p className="font-bold">{submitResult.message}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-300 mb-1">
                    Full Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-all ${
                      fieldErrors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-slate-700/80 focus:border-cyan-500'
                    } ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}
                  />
                  {fieldErrors.fullName && (
                    <span className="text-[10px] text-red-400 mt-1 block">{fieldErrors.fullName}</span>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-300 mb-1">
                    Email Address <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-all ${
                      fieldErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-700/80 focus:border-cyan-500'
                    } ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}
                  />
                  {fieldErrors.email && (
                    <span className="text-[10px] text-red-400 mt-1 block">{fieldErrors.email}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mobile / Phone */}
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-300 mb-1">
                    Mobile / Phone <span className="text-cyan-400">*</span>
                  </label>
                  <div className="flex items-stretch gap-2">
                    <div className="relative" ref={countryDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsCountryDropdownOpen((prev) => !prev)}
                        className={`flex items-center gap-1 px-3.5 py-2.5 rounded-xl text-xs border transition-all ${
                          fieldErrors.phone ? 'border-red-500 focus:ring-red-500' : 'border-slate-700/80 focus:border-cyan-500'
                        } ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}
                      >
                        <span>{selectedCountry.flag}</span>
                        <span>{selectedCountry.dialCode}</span>
                      </button>
                      {isCountryDropdownOpen && (
                        <div className="absolute z-20 mt-2 max-h-72 w-52 overflow-auto rounded-2xl border border-slate-700/80 bg-slate-950 shadow-2xl">
                          {countryCodes.map((country) => (
                            <button
                              key={country.dialCode + country.name}
                              type="button"
                              onClick={() => {
                                setCountryCode(country.dialCode);
                                setIsCountryDropdownOpen(false);
                              }}
                              className="w-full px-3 py-2 text-left text-xs text-slate-100 hover:bg-slate-800"
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
                      className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs border transition-all ${
                        fieldErrors.phone ? 'border-red-500 focus:ring-red-500' : 'border-slate-700/80 focus:border-cyan-500'
                      } ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <span className="text-[10px] text-red-400 mt-1 block">{fieldErrors.phone}</span>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-300 mb-1">
                    Subject <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter subject"
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-all ${
                      fieldErrors.subject ? 'border-red-500 focus:ring-red-500' : 'border-slate-700/80 focus:border-cyan-500'
                    } ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}
                  />
                  {fieldErrors.subject && (
                    <span className="text-[10px] text-red-400 mt-1 block">{fieldErrors.subject}</span>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-mono font-medium text-slate-300 mb-1">
                  Message Details <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter message details"
                  required
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-all ${
                    fieldErrors.message ? 'border-red-500 focus:ring-red-500' : 'border-slate-700/80 focus:border-cyan-500'
                  } ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}
                />
                {fieldErrors.message && (
                  <span className="text-[10px] text-red-400 mt-1 block">{fieldErrors.message}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl text-xs font-bold font-mono text-white transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                style={{
                  backgroundColor: isDarkMode ? currentTheme.darkAccent : currentTheme.lightAccent
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Validating & Transmitting to Firestore...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
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
