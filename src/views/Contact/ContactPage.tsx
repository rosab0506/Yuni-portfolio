'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { detectSocialPlatform, formatPlatformLabel } from '../../utils/detectSocialPlatform';
import { iconMap } from '../../utils/iconMap';
import { useCms } from '../../hooks/useCms';
import { Mail, MapPin, Send, Sparkles, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useDocumentHead } from '../../hooks/useDocumentHead';

export function ContactPage() {
  const { data } = useCms();
  const location = usePathname();
  const contact = data.singletons.contact ?? {};
  const contactInfo = contact.contactInfo ?? {};
  const socialLinks = Array.isArray(contact.socialLinks) ? contact.socialLinks : [];

  useDocumentHead({
    title: 'Contact Yuna Shimizu',
    description: 'Get in touch with Yuna Shimizu for web development projects, freelance work, or collaboration opportunities. Reach out via email or social media.',
    path: '/contact',
  });

  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!location || !location.includes('#contact-form')) return;
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [location]);

  const handleChange = (key: keyof typeof formValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: '' }));
    }
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formValues.name.trim()) nextErrors.name = 'Name is required.';
    if (!formValues.email.trim()) nextErrors.email = 'Email is required.';
    if (!formValues.subject.trim()) nextErrors.subject = 'Subject is required.';
    if (!formValues.message.trim()) nextErrors.message = 'Message is required.';
    if (formValues.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      nextErrors.email = 'Enter a valid email.';
    }
    return nextErrors;
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-8 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-morph floating" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-morph floating-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-5 blur-3xl animate-pulse-glow" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B1320]/60 border border-white/10 mb-6 animate-slide-in-left hover:scale-105 transition-transform">
          <MessageCircle className="w-4 h-4 text-[#C77DFF] animate-bounce-subtle" />
          <span className="text-sm font-medium text-[#C77DFF]">Get in Touch</span>
        </div>

        <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in text-white">
          Let's <span className="gradient-text text-shimmer hover:animate-wiggle inline-block">Connect</span>
        </h1>
        <p className="text-lg text-[#C9D1D9] max-w-2xl mx-auto animate-slide-up">
          {contact.pageIntroText || "Have a question or want to work together? I'd love to hear from you."}
        </p>
      </section>

      {/* Main Content */}
      <section className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          {/* Contact Details Card */}
          <div className="group relative animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-2xl blur-sm opacity-[0.06] group-hover:blur-md group-hover:opacity-[0.14] transition-all duration-600 ease-out" />
            <div className="relative bg-[#0B1320]/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-[#C77DFF]/[0.05] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-600 ease-out card-animated">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C77DFF]/10 border border-[#C77DFF]/15 group-hover:bg-[#C77DFF]/15 group-hover:border-[#C77DFF]/25 transition-all duration-500 ease-out">
                  <Sparkles className="w-5 h-5 text-[#C77DFF]" />
                </div>
                <h2 className="text-lg font-bold text-white group-hover:text-[#C77DFF] transition-colors">Contact Info</h2>
              </div>

              <div className="space-y-4">
                {contactInfo.email && (
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#0B1320]/50 hover:-translate-x-1 transition-all duration-300 group/item"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#C77DFF]/20 text-[#C77DFF] group-hover/item:bg-[#C77DFF]/30 group-hover/item:scale-110 transition-all">
                      <Mail className="w-5 h-5 group-hover/item:animate-wiggle" />
                    </div>
                    <div>
                      <p className="text-xs text-white/60 uppercase tracking-wider">Email</p>
                      <p className="text-sm font-medium text-[#C9D1D9]">{contactInfo.email}</p>
                    </div>
                  </a>
                )}

                {contactInfo.location && (
                  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#0B1320]/50 transition-colors group/item">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#C77DFF]/20 text-[#C77DFF] group-hover/item:scale-110 transition-transform">
                      <MapPin className="w-5 h-5 group-hover/item:animate-bounce-subtle" />
                    </div>
                    <div>
                      <p className="text-xs text-white/60 uppercase tracking-wider">Location</p>
                      <p className="text-sm font-medium text-[#C9D1D9]">{contactInfo.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Social Links Card */}
          {/* {socialLinks.length > 0 && (
            <div className="group relative animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-2xl blur-sm opacity-[0.06] group-hover:blur-md group-hover:opacity-[0.14] transition-all duration-600 ease-out" />
              <div className="relative bg-[#0B1320]/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-[#C77DFF]/[0.05] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-600 ease-out card-animated">
                <h2 className="text-lg font-bold text-white mb-4 group-hover:text-[#C77DFF] transition-colors">Follow Me</h2>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((link, index) => {
                    const derived = detectSocialPlatform(String(link.url ?? ''));
                    const platformKey = (link.platform ?? derived.platform) as keyof typeof iconMap;
                    const iconKey = (link.iconKey ?? derived.iconKey) as keyof typeof iconMap;
                    const Icon = iconMap[iconKey] ?? iconMap.custom;
                    const label = formatPlatformLabel(String(platformKey), derived.label);
                    return (
                      <a
                        key={`${label}-${link.url}`}
                        className="group/social inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1320]/50 text-[#C9D1D9] hover:bg-gradient-to-r hover:from-[#C77DFF] hover:to-[#9D4EDD] hover:text-white hover:scale-105 hover:-translate-y-0.5 transition-all duration-300"
                        href={String(link.url)}
                        target="_blank"
                        rel="noreferrer"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <Icon className="h-5 w-5 group-hover/social:animate-bounce-subtle" />
                        <span className="text-sm font-medium">{label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          )} */}
        </div>

        {/* Contact Form */}
        <div className="group relative animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C77DFF] via-[#9D4EDD] to-[#C77DFF] rounded-3xl blur-sm opacity-[0.06] group-hover:blur-md group-hover:opacity-[0.14] transition-all duration-600 ease-out" />
          <div className="relative bg-[#0B1320]/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/[0.06] hover:border-white/[0.12] transition-all duration-600 ease-out card-animated">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C77DFF]/10 border border-[#C77DFF]/15 group-hover:bg-[#C77DFF]/15 group-hover:border-[#C77DFF]/25 transition-all duration-500 ease-out">
                <Send className="w-5 h-5 text-[#C77DFF]" />
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-[#C77DFF] transition-colors">Send a Message</h2>
            </div>

            <form
              id="contact-form"
              className="space-y-5"
              onSubmit={async (event) => {
                event.preventDefault();
                const nextErrors = validate();
                setErrors(nextErrors);
                if (Object.keys(nextErrors).length > 0) return;
                setIsSubmitting(true);
                setSuccess(null);
                try {
                  const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name: formValues.name,
                      email: formValues.email,
                      subject: formValues.subject,
                      message: formValues.message,
                    }),
                  });

                  const result = await response.json();

                  if (!response.ok) {
                    throw new Error(result.error || 'Failed to send message');
                  }

                  setFormValues({ name: '', email: '', subject: '', message: '' });
                  setErrors({});
                  
                  // Show appropriate success message
                  let successMessage = 'Message sent successfully!';
                  
                  if (result.storage === 'temporary_memory') {
                    successMessage = 'Message sent successfully! (Temporarily stored - database setup needed)';
                    console.log('📝 Note: Message stored temporarily. To set up permanent storage:');
                    console.log('1. Go to Supabase Dashboard > SQL Editor');
                    console.log('2. Run the SQL script: scripts/create-contact-messages-simple.sql');
                    console.log('3. Messages will then save to database automatically');
                  }
                  
                  if (result.email_note) {
                    successMessage += ' Email notification needs setup.';
                    console.log('📧 Email setup needed to receive messages in inbox.');
                    console.log('Check server logs for message details.');
                  }
                  
                  setSuccess(successMessage);
                  
                  // Log message details for now (since email isn't set up yet)
                  console.log('📨 Message Details:');
                  console.log('From:', formValues.name, `<${formValues.email}>`);
                  console.log('Subject:', formValues.subject);
                  console.log('Message:', formValues.message);
                  console.log('---');
                  
                } catch (error) {
                  console.error('Failed to send message:', error);
                  setErrors({ submit: error instanceof Error ? error.message : 'Failed to send message. Please try again.' });
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="animate-fade-in" style={{ animationDelay: '350ms' }}>
                  <label className="block text-sm font-medium text-[#C9D1D9] mb-1.5">Name</label>
                  <input
                    className={`w-full rounded-xl border ${errors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-400/30' : 'border-white/10 focus:border-[#C77DFF] focus:ring-[#C77DFF]/30'} bg-[#0B1320]/50 text-white placeholder-white/60 px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 hover:border-[#C77DFF]/50 hover:shadow-sm`}
                    placeholder="John Doe"
                    value={formValues.name}
                    onChange={(event) => handleChange('name', event.target.value)}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-400 animate-slide-up">{errors.name}</p>}
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
                  <label className="block text-sm font-medium text-[#C9D1D9] mb-1.5">Email</label>
                  <input
                    className={`w-full rounded-xl border ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-400/30' : 'border-white/10 focus:border-[#C77DFF] focus:ring-[#C77DFF]/30'} bg-[#0B1320]/50 text-white placeholder-white/60 px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 hover:border-[#C77DFF]/50 hover:shadow-sm`}
                    placeholder="john@example.com"
                    type="email"
                    value={formValues.email}
                    onChange={(event) => handleChange('email', event.target.value)}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-400 animate-slide-up">{errors.email}</p>}
                </div>
              </div>

              <div className="animate-fade-in" style={{ animationDelay: '450ms' }}>
                <label className="block text-sm font-medium text-[#C9D1D9] mb-1.5">Subject</label>
                <input
                  className={`w-full rounded-xl border ${errors.subject ? 'border-red-400 focus:border-red-500 focus:ring-red-400/30' : 'border-white/10 focus:border-[#C77DFF] focus:ring-[#C77DFF]/30'} bg-[#0B1320]/50 text-white placeholder-white/60 px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 hover:border-[#C77DFF]/50 hover:shadow-sm`}
                  placeholder="Project Inquiry"
                  value={formValues.subject}
                  onChange={(event) => handleChange('subject', event.target.value)}
                />
                {errors.subject && <p className="mt-1 text-sm text-red-400 animate-slide-up">{errors.subject}</p>}
              </div>

              <div className="animate-fade-in" style={{ animationDelay: '500ms' }}>
                <label className="block text-sm font-medium text-[#C9D1D9] mb-1.5">Message</label>
                <textarea
                  className={`w-full rounded-xl border ${errors.message ? 'border-red-400 focus:border-red-500 focus:ring-red-400/30' : 'border-white/10 focus:border-[#C77DFF] focus:ring-[#C77DFF]/30'} bg-[#0B1320]/50 text-white placeholder-white/60 px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 resize-none hover:border-[#C77DFF]/50 hover:shadow-sm`}
                  placeholder="Tell me about your project..."
                  rows={5}
                  value={formValues.message}
                  onChange={(event) => handleChange('message', event.target.value)}
                />
                {errors.message && <p className="mt-1 text-sm text-red-400 animate-slide-up">{errors.message}</p>}
              </div>

              <div className="flex flex-col gap-3 pt-2 animate-fade-in" style={{ animationDelay: '550ms' }}>
                {errors.submit && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 animate-slide-up">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{errors.submit}</span>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <button
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#C77DFF] text-[#0B1320] font-semibold rounded-xl shadow-lg shadow-[#C77DFF]/30 hover:shadow-2xl hover:shadow-[#C77DFF]/40 hover:-translate-y-1 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100 btn-animated group/btn"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
                  {success && (
                    <div className="flex items-center gap-2 text-[#C77DFF] animate-slide-in-left">
                      <CheckCircle2 className="w-5 h-5 animate-bounce-subtle" />
                      <span className="font-medium">{success}</span>
                    </div>
                  )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
