import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { serviceOffers, type ServiceOffer } from '../data/offers';
import { ScrollReveal, StaggerContainer, StaggerItem } from './MotionPrimitives';

interface OffersSectionProps {
  onSelectOffer: (offer: ServiceOffer) => void;
}

export function OffersSection({ onSelectOffer }: OffersSectionProps) {
  const [selectedGoal, setSelectedGoal] = useState<'create' | 'upgrade' | 'maintain'>('create');

  const recommendedOffer =
    selectedGoal === 'create'
      ? serviceOffers[0]
      : selectedGoal === 'upgrade'
        ? serviceOffers[2]
        : serviceOffers[3];

  return (
    <section
      id="tarifs"
      className="py-16 sm:py-24 bg-[#020817]/35 backdrop-blur-[2px] border-b border-[#006BFF]/20"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <ScrollReveal className="max-w-3xl">
          <p className="text-sm font-semibold tracking-wide text-[#00CFFF]">
            Offres &amp; Tarifs
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-white leading-tight">
            Des solutions digitales pensées pour votre croissance.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#B9C7DC] leading-relaxed">
            Un site performant, une technologie moderne et une totale indépendance.
          </p>
        </ScrollReveal>

        {/* Sélecteur interactif d'orientation "Trouver mon offre" */}
        <ScrollReveal
          delay={0.1}
          className="mt-10 p-5 sm:p-6 rounded-2xl bg-[#06132D]/75 backdrop-blur-md border border-[#006BFF]/35 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
        >
          <div className="space-y-2.5">
            <div className="text-sm font-medium text-[#B9C7DC]">
              Quel est votre besoin prioritaire ?
            </div>
            <div
              role="group"
              aria-label="Filtrer par besoin"
              className="inline-flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#020817]/80 border border-[#006BFF]/25"
            >
              <button
                type="button"
                onClick={() => setSelectedGoal('create')}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors min-h-[40px] ${
                  selectedGoal === 'create'
                    ? 'bg-[#006BFF] text-white'
                    : 'text-[#B9C7DC] hover:text-white'
                }`}
              >
                Créer un site
              </button>
              <button
                type="button"
                onClick={() => setSelectedGoal('upgrade')}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors min-h-[40px] ${
                  selectedGoal === 'upgrade'
                    ? 'bg-[#006BFF] text-white'
                    : 'text-[#B9C7DC] hover:text-white'
                }`}
              >
                Accélérer un site existant
              </button>
              <button
                type="button"
                onClick={() => setSelectedGoal('maintain')}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors min-h-[40px] ${
                  selectedGoal === 'maintain'
                    ? 'bg-[#006BFF] text-white'
                    : 'text-[#B9C7DC] hover:text-white'
                }`}
              >
                Déléguer la maintenance
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:text-right">
            <div className="text-sm text-[#B9C7DC]">
              Orientation recommandée :{' '}
              <span className="font-semibold text-white">{recommendedOffer.title}</span>{' '}
              <span className="text-[#00CFFF] font-semibold tabular-nums">
                ({recommendedOffer.priceLabel})
              </span>
            </div>
            <motion.button
              type="button"
              onClick={() => onSelectOffer(recommendedOffer)}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#006BFF] to-[#00CFFF] shadow-[0_0_24px_rgba(0,107,255,0.4)] hover:shadow-[0_0_32px_rgba(0,207,255,0.65)] transition-shadow duration-200 whitespace-nowrap shrink-0 min-h-[44px]"
            >
              <span>Trouver mon offre</span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </motion.button>
          </div>
        </ScrollReveal>

        {/* Grille des 4 offres */}
        <StaggerContainer className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {serviceOffers.map((offer) => (
            <StaggerItem key={offer.id}>
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={`h-full rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-colors duration-200 border backdrop-blur-md ${
                  offer.highlighted
                    ? 'bg-[#06132D]/85 border-[#00CFFF]/55 shadow-[0_0_36px_rgba(0,107,255,0.18)]'
                    : 'bg-[#06132D]/70 border-[#006BFF]/30 hover:border-[#00CFFF]/55'
                }`}
              >
                <div>
                  <div className="text-xs font-medium text-[#00CFFF]">
                    {offer.category}
                  </div>
                  <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {offer.title}
                    </h3>
                    <div className="text-lg sm:text-xl font-bold text-white tabular-nums">
                      {offer.priceLabel}
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-[#B9C7DC]/85 tabular-nums">
                    {offer.billingNote}
                  </p>

                  <p className="mt-4 text-sm sm:text-base text-[#B9C7DC] leading-relaxed">
                    {offer.summary}
                  </p>

                  <ul className="mt-6 space-y-3 border-t border-[#006BFF]/20 pt-5">
                    {offer.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-white/90">
                        <Check
                          className="w-4 h-4 text-[#00CFFF] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <motion.button
                    type="button"
                    onClick={() => onSelectOffer(offer)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 min-h-[44px] ${
                      offer.highlighted
                        ? 'bg-gradient-to-r from-[#006BFF] to-[#00CFFF] text-white shadow-[0_0_20px_rgba(0,107,255,0.35)] hover:shadow-[0_0_28px_rgba(0,207,255,0.55)]'
                        : 'bg-[#020817]/75 text-white border border-[#006BFF]/40 hover:border-[#00CFFF] hover:bg-[#08193B]'
                    }`}
                  >
                    <span>Sélectionner cette offre</span>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </motion.button>
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <p className="mt-6 text-xs text-[#B9C7DC]/75">
          Tous les tarifs affichés sont indicatifs hors options spécifiques et confirmés par devis écrit avant tout engagement.
        </p>
      </div>
    </section>
  );
}
