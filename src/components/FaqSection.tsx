import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { faqItems } from '../data/faq';
import { ScrollReveal } from './MotionPrimitives';

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(faqItems[0].id);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="py-16 sm:py-24 bg-[#020817]/25 border-b border-[#006BFF]/20"
    >
      <div className="mx-auto max-w-[960px] px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold tracking-wide text-[#00CFFF]">
            Questions fréquentes
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Tout ce qu&apos;il faut savoir avant de démarrer.
          </h2>
          <p className="mt-4 text-base text-[#B9C7DC]">
            Des réponses claires sur les tarifs, les délais, la propriété de votre site et la maintenance.
          </p>
        </ScrollReveal>

        <div className="mt-10 space-y-3">
          {faqItems.map((item, idx) => {
            const isOpen = openId === item.id;
            const panelId = `faq-panel-${item.id}`;
            const buttonId = `faq-button-${item.id}`;

            return (
              <ScrollReveal key={item.id} delay={idx * 0.04}>
                <div
                  className={`rounded-2xl border backdrop-blur-md transition-colors duration-200 ${
                    isOpen
                      ? 'bg-[#06132D]/85 border-[#00CFFF]/50 shadow-[0_8px_30px_rgba(0,107,255,0.16)]'
                      : 'bg-[#06132D]/65 border-[#006BFF]/30 hover:border-[#006BFF]/50'
                  }`}
                >
                  <h3 className="m-0">
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleItem(item.id)}
                      className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 text-left text-base sm:text-lg font-semibold text-white min-h-[56px]"
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#00CFFF] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-5 pt-0 text-sm sm:text-base text-[#B9C7DC] leading-relaxed border-t border-[#006BFF]/15 mt-1">
                          <p className="pt-4">{item.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
