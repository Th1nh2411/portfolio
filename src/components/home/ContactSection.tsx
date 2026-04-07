import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { submitContact } from '../../lib/firestore'
import FadeIn from '../common/FadeIn'

interface FormState {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactSection() {
  const { t } = useTranslation()

  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await submitContact(form)
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const inputClass = `w-full px-4 py-3 rounded-xl bg-ink-50 dark:bg-ink-900 border border-ink-200 dark:border-ink-700 text-ink-900 dark:text-ink-100 placeholder-ink-400 dark:placeholder-ink-600 text-sm focus:outline-none focus:border-accent dark:focus:border-accent transition-colors`

  const contactLinks = [
    {
      icon: '✉',
      label: 'Email',
      value: 'ducthnh2411@gmail.com',
      href: 'mailto:ducthnh2411@gmail.com',
    },
    {
      icon: '📞',
      label: 'Phone',
      value: '0935 098 021',
      href: 'tel:0935098021',
    },
    {
      icon: '⌘',
      label: 'GitHub',
      value: 'Th1nh2411',
      href: 'https://github.com/Th1nh2411',
    },
    {
      icon: '📍',
      label: 'Location',
      value: 'District 7, Ho Chi Minh City',
      href: null,
    },
  ]

  return (
    <section id="contact" className="py-24 border-t border-ink-100 dark:border-ink-800 snap-start">
      <div className="container-narrow">
        <FadeIn>
          <p className="font-mono text-xs text-accent tracking-widest uppercase mb-3">Say Hello</p>
          <h2 className="section-title mb-3">{t('contact.title')}</h2>
          <p className="section-subtitle mb-16 max-w-lg">{t('contact.subtitle')}</p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Contact info */}
          <FadeIn className="lg:col-span-2" delay={0.1}>
            <div className="space-y-5">
              {contactLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-lg flex-shrink-0">
                    {link.icon}
                  </div>
                  <div>
                    <p className="text-xs font-mono text-ink-400 dark:text-ink-500 uppercase tracking-wide">{link.label}</p>
                    {link.href ? (
                      <a href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="text-sm text-ink-700 dark:text-ink-300 hover:text-accent transition-colors">
                        {link.value}
                      </a>
                    ) : (
                      <p className="text-sm text-ink-700 dark:text-ink-300">{link.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Decorative element */}
            <div className="mt-16 p-6 rounded-2xl bg-ink-50 dark:bg-ink-900 border border-ink-100 dark:border-ink-800">
              <p className="text-sm text-ink-500 dark:text-ink-400 italic leading-relaxed">
                "I'm always open to discussing new projects, creative ideas, or opportunities to be part of something great."
              </p>
              <p className="text-xs text-accent font-mono mt-3">— Nguyen Duc Thinh</p>
            </div>
          </FadeIn>

          {/* Contact form */}
          <FadeIn className="lg:col-span-3" delay={0.15}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono text-ink-400 dark:text-ink-500 uppercase tracking-wide mb-2">
                    {t('contact.name')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-ink-400 dark:text-ink-500 uppercase tracking-wide mb-2">
                    {t('contact.email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-ink-400 dark:text-ink-500 uppercase tracking-wide mb-2">
                  {t('contact.subject')}
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="Project collaboration..."
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-ink-400 dark:text-ink-500 uppercase tracking-wide mb-2">
                  {t('contact.message')}
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className={`${inputClass} resize-none`}
                  placeholder="Tell me about your project..."
                />
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {status === 'sending' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('contact.sending')}
                    </>
                  ) : t('contact.send')}
                </button>

                <AnimatePresence mode="wait">
                  {status === 'success' && (
                    <motion.p
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-emerald-600 dark:text-emerald-400"
                    >
                      ✓ {t('contact.success')}
                    </motion.p>
                  )}
                  {status === 'error' && (
                    <motion.p
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-red-500"
                    >
                      ✕ {t('contact.error')}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
