import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { submitContact } from '../../lib/firestore'
import FadeIn from '../common/FadeIn'
import CopyButton from '../common/CopyButton'
import PcbBackdrop from '../pixel/PcbBackdrop'
import { emit, unlock } from '../../game/store'
import { play } from '../../game/sound'

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
      emit('px:quest')
      window.setTimeout(() => unlock('messenger'), 1800)
    } catch {
      setStatus('error')
      play('error')
    }
  }

  const inputClass = 'field'

  const contactLinks = [
    {
      icon: '✉',
      label: 'Email',
      value: 'ducthnh2411@gmail.com',
      href: 'mailto:ducthnh2411@gmail.com',
      copy: 'ducthnh2411@gmail.com',
    },
    {
      icon: '📞',
      label: 'Phone',
      value: '0935 098 021',
      href: 'tel:0935098021',
      copy: '0935098021',
    },
    {
      icon: '⌘',
      label: 'GitHub',
      value: 'Th1nh2411',
      href: 'https://github.com/Th1nh2411',
      copy: 'https://github.com/Th1nh2411',
    },
    {
      icon: '📍',
      label: 'Location',
      value: 'District 7, Ho Chi Minh City',
      href: null,
      copy: 'District 7, Ho Chi Minh City',
    },
  ]

  return (
    <section id="contact" data-circuit className="py-24 section-edge section-band pcb-host isolate">
      <PcbBackdrop seed="contact" label="J1·CONTACT" />
      <div className="container-narrow">
        <FadeIn>
          <p data-lamp className="font-pixel-mono text-xl text-accent tracking-widest uppercase mb-2">&gt; NEW QUEST: SAY HELLO</p>
          <h2 className="font-pixel text-5xl md:text-6xl leading-none text-ink-950 dark:text-ink-50 mb-4">{t('contact.title')}</h2>
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
                  <div className="w-10 h-10 border border-ink-300 dark:border-ink-700 bg-paper-light dark:bg-ink-900 flex items-center justify-center text-lg flex-shrink-0">
                    {link.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-pixel-mono text-lg leading-none text-ink-500 dark:text-ink-400 uppercase tracking-wide">{link.label}</p>
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
                  <CopyButton value={link.copy} label={link.label} />
                </motion.div>
              ))}
            </div>

            {/* Decorative element */}
            <div className="mt-16 p-6 dialog-pixel !bg-ink-950">
              <p className="text-sm text-ink-100 italic leading-relaxed">
                "I'm always open to discussing new projects, creative ideas, or opportunities to be part of something great."
              </p>
              <p className="font-pixel-mono text-lg leading-none text-accent mt-3">— Nguyen Duc Thinh</p>
            </div>
          </FadeIn>

          {/* Contact form */}
          <FadeIn className="lg:col-span-3" delay={0.15}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-pixel-mono text-lg leading-none text-ink-500 dark:text-ink-400 uppercase tracking-wide mb-2">
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
                  <label className="block font-pixel-mono text-lg leading-none text-ink-500 dark:text-ink-400 uppercase tracking-wide mb-2">
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
                <label className="block font-pixel-mono text-lg leading-none text-ink-500 dark:text-ink-400 uppercase tracking-wide mb-2">
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
                <label className="block font-pixel-mono text-lg leading-none text-ink-500 dark:text-ink-400 uppercase tracking-wide mb-2">
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
                  className="btn-pixel disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? (
                    <>
                      <span className="animate-blink">🕊</span>
                      {t('contact.sending')}
                    </>
                  ) : (
                    <>✉ {t('contact.send')}</>
                  )}
                </button>

                <AnimatePresence mode="wait">
                  {status === 'success' && (
                    <motion.p
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-sea-dark dark:text-sea"
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
