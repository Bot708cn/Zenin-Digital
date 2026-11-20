import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Puzzle, Wrench, X } from 'lucide-react';
import type { ComplementaryService, ServiceOffer } from '../data/offers';

interface ComplementaryServiceModalProps {
  service: ComplementaryService | null;
  onClose: () => void;
  onSelectItemForQuote: (offer: ServiceOffer) => void;
}

export function ComplementaryServiceModal({
  service,
  onClose,
  onSelectItemForQuote,
}: ComplementaryServiceModalProps) {
  useEffect(() => {
    if (!service) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [service, onClose]);

  const Icon = service?.icon === 'wrench' ? Wrench : Puzzle;

  return (
    <AnimatePresence>
      {service && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/85 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="complementary-service-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-[1px] bg-gradient-to-b from-[#00CFFF]/55 via-[#0066FF]/45 to-[#702BFF]/55 shadow-[0_24px_80px_rgba(0,102,255,0.35)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-[15px] bg-[#030712]/95 p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#071633] border border-[#00CFFF]/35 text-[#00CFFF] shrink-0">
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h2
                      id="complementary-service-title"
                      className="text-xl sm:text-2xl font-bold text-white"
                    >
                      {service.title}
                    </h2>
                    <p className="mt-0.5 text-xs sm:text-sm text-[#B9C7DC]">
                      {service.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fermer les détails du service"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#06132D] border border-[#0066FF]/35 text-[#B9C7DC] hover:text-white hover:border-[#00CFFF] transition-colors shrink-0"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {service.items.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-xl bg-[#06132D]/75 border border-[#0066FF]/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white">{item.name}</h3>
                      <p className="text-xs sm:text-sm text-[#B9C7DC] leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectItemForQuote({
                          id: item.name.toLowerCase().replace(/\s+/g, '-'),
                          title: item.name,
                          tagline: service.title,
                          description: item.detail,
                          priceAmount: 'Sur devis',
                          priceUnit: '',
                          priceLabel: 'Sur devis',
                          monthlyLabel: item.presetBudget,
                          icon: 'rocket',
                          features: [],
                          ctaLabel: 'Demander un devis',
                          presetProjectType: item.presetProjectType,
                          presetBudget: item.presetBudget,
                        });
                      }}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#0066FF] to-[#00CFFF] hover:shadow-[0_0_20px_rgba(0,207,255,0.45)] transition-all whitespace-nowrap shrink-0 min-h-[42px]"
                    >
                      <span>Demander un devis</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
