import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ChartNoAxesCombined,
  Check,
  ChevronRight,
  Gem,
  Hexagon,
  Lock,
  Puzzle,
  Rocket,
  ShieldCheck,
  Star,
  Wrench,
  Zap,
} from 'lucide-react';
import {
  complementaryServices,
  guaranteeInfo,
  serviceOffers,
  type ComplementaryService,
  type ServiceOffer,
} from '../data/offers';
import { OfferQuoteModal } from './OfferQuoteModal';
import { ComplementaryServiceModal } from './ComplementaryServiceModal';
import { ScrollReveal } from './MotionPrimitives';

interface OffersSectionProps {
  onSelectOffer: (offer: ServiceOffer) => void;
}

export function OffersSection({ onSelectOffer }: OffersSectionProps) {
  const [modalOffer, setModalOffer] = useState<ServiceOffer | null>(null);
  const [activeComplementary, setActiveComplementary] = useState<ComplementaryService | null>(null);

  const renderTierIcon = (icon: ServiceOffer['icon'], highlighted?: boolean) => {
    const iconProps = {
      className: `w-7 h-7 ${highlighted ? 'text-[#00CFFF]' : 'text-[#38BDF8]'}`,
      'aria-hidden': true as const,
    };
    if (icon === 'rocket') return <Rocket {...iconProps} />;
    if (icon === 'chart') return <ChartNoAxesCombined {...iconProps} />;
    return <Gem {...iconProps} />;
  };

  const handleComplementaryClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    service: ComplementaryService
  ) => {
    const url = service.destinationUrl;
    if (!url || url.startsWith('#')) {
      e.preventDefault();
      setActiveComplementary(service);
    }
  };

  return (
    <section
      id="tarifs"
      className="relative overflow-hidden py-16 sm:py-24 bg-[#020617]/70 backdrop-blur-[2px] border-b border-[#0066FF]/25"
    >
      {/* Halos lumineux ambiants bleu électrique, cyan et violet */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[780px] h-[340px] rounded-full bg-[#0066FF]/20 blur-[130px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[520px] h-[420px] rounded-full bg-[#702BFF]/15 blur-[140px]" />
        <div className="absolute -bottom-24 right-[-80px] w-[420px] h-[420px] rounded-full bg-[#00CFFF]/14 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* 3. EN-TÊTE */}
        <ScrollReveal className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#040D24]/90 border border-[#00CFFF]/45 shadow-[0_0_24px_rgba(0,207,255,0.2)]">
            <Hexagon className="w-4 h-4 text-[#00CFFF]" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">
              Nos Offres
            </span>
          </div>

          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[2.85rem] font-extrabold tracking-tight text-white leading-[1.15] [text-wrap:balance]">
            Des solutions adaptées à vos{' '}
            <span className="bg-gradient-to-r from-[#00CFFF] via-[#2D7BFF] to-[#702BFF] bg-clip-text text-transparent">
              ambitions
            </span>
          </h2>

          <p className="mt-3.5 text-sm sm:text-base lg:text-lg text-[#B9C7DC] leading-relaxed">
            Des sites web performants, sécurisés et évolutifs, avec un accompagnement sur mesure.
          </p>

          <div
            aria-hidden="true"
            className="mt-5 mx-auto w-24 h-[2px] rounded-full bg-gradient-to-r from-[#00CFFF] via-[#0066FF] to-[#702BFF]/40"
          />
        </ScrollReveal>

        {/* 4. LES TROIS OFFRES */}
        <div className="mt-12 lg:mt-14 grid grid-cols-1 lg:grid-cols-3 gap-9 lg:gap-6 items-stretch">
          {serviceOffers.map((offer, index) => {
            const isFeatured = Boolean(offer.highlighted);

            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 'some' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: isFeatured ? -6 : -4 }}
                className={`relative flex flex-col will-change-transform ${
                  isFeatured ? 'lg:-translate-y-2.5 z-10' : ''
                }`}
              >
                {/* Halo bleu électrique derrière la carte Croissance */}
                {isFeatured && (
                  <div
                    aria-hidden="true"
                    className="absolute -inset-2 rounded-3xl bg-gradient-to-b from-[#00CFFF]/25 via-[#0066FF]/28 to-[#702BFF]/28 blur-2xl pointer-events-none"
                  />
                )}

                {/* Badge flottant ⭐ Recommandée */}
                {offer.recommendedBadge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#1D7BFF] via-[#4F46E5] to-[#702BFF] text-white text-xs sm:text-sm font-semibold shadow-[0_0_24px_rgba(112,43,255,0.65)] whitespace-nowrap">
                    <Star className="w-3.5 h-3.5 fill-white text-white shrink-0" aria-hidden="true" />
                    <span>{offer.recommendedBadge}</span>
                  </div>
                )}

                {/* Conteneur de carte avec bordure lumineuse cyan/bleu/violet */}
                <article
                  className={`relative flex-1 rounded-2xl p-[1.5px] transition-all duration-300 ${
                    isFeatured
                      ? 'bg-gradient-to-b from-[#00CFFF] via-[#0066FF] to-[#702BFF] shadow-[0_0_48px_rgba(0,102,255,0.38)]'
                      : offer.id === 'scale'
                        ? 'bg-gradient-to-b from-[#702BFF]/50 via-[#0066FF]/35 to-[#702BFF]/40 hover:from-[#00CFFF]/70 hover:to-[#702BFF]/75'
                        : 'bg-gradient-to-b from-[#00CFFF]/35 via-[#0066FF]/30 to-[#0066FF]/20 hover:from-[#00CFFF]/65 hover:to-[#0066FF]/55'
                  }`}
                >
                  <div
                    className={`h-full rounded-[15px] p-6 sm:p-7 flex flex-col justify-between backdrop-blur-xl ${
                      isFeatured
                        ? 'bg-gradient-to-b from-[#061535]/95 via-[#03091B]/95 to-[#060921]/95'
                        : 'bg-[#030712]/92'
                    }`}
                  >
                    <div>
                      {/* En-tête de carte : Boîte icône + Titre & Description courte */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl border shrink-0 ${
                            isFeatured
                              ? 'bg-gradient-to-br from-[#0B2457] to-[#1A1347] border-[#00CFFF]/45 shadow-[0_0_20px_rgba(0,207,255,0.2)]'
                              : offer.id === 'scale'
                                ? 'bg-gradient-to-br from-[#0A1940] to-[#16103B] border-[#702BFF]/40'
                                : 'bg-[#071633] border-[#0066FF]/40'
                          }`}
                        >
                          {renderTierIcon(offer.icon, isFeatured)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-2xl font-bold text-white tracking-tight">
                            {offer.title}
                          </h3>
                          <p className="text-sm text-[#B9C7DC] mt-0.5">{offer.tagline}</p>
                        </div>
                      </div>

                      {/* Texte descriptif */}
                      <p className="mt-5 text-sm sm:text-[15px] text-[#D1DDF0] leading-relaxed min-h-[44px]">
                        {offer.description}
                      </p>

                      {/* Bloc Prix + Abonnement mensuel */}
                      <div className="mt-5">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl sm:text-[2.65rem] font-extrabold text-white tracking-tight tabular-nums leading-none">
                            {offer.priceAmount}
                          </span>
                          <span className="text-lg font-bold text-white/90">
                            {offer.priceUnit}
                          </span>
                        </div>
                        <div className="mt-2 text-sm sm:text-[15px] font-semibold text-[#608CFF] tabular-nums">
                          {offer.monthlyLabel}
                        </div>
                      </div>

                      {/* Séparateur fin */}
                      <div aria-hidden="true" className="my-5 h-px bg-white/10" />

                      {/* Liste des 5 fonctionnalités avec coche ronde bleue */}
                      <ul className="space-y-3">
                        {offer.features.map((feature, fIndex) => {
                          const isCumulativeHeading =
                            fIndex === 0 &&
                            (feature.includes("Tout l'Essentiel") ||
                              feature.includes('Tout le Croissance'));

                          return (
                            <li
                              key={feature}
                              className="flex items-start gap-3 text-sm text-[#E2ECFA]"
                            >
                              <span
                                aria-hidden="true"
                                className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-br from-[#00CFFF] to-[#0066FF] text-white shrink-0 mt-0.5 shadow-[0_0_8px_rgba(0,102,255,0.45)]"
                              >
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                              <span
                                className={
                                  isCumulativeHeading ? 'font-bold text-white' : 'text-[#D1DDF0]'
                                }
                              >
                                {feature}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Bouton CTA pleine largeur */}
                    <div className="mt-7 pt-1">
                      <motion.button
                        type="button"
                        onClick={() => setModalOffer(offer)}
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.985 }}
                        transition={{ duration: 0.16 }}
                        className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm sm:text-[15px] font-bold text-white transition-all duration-200 min-h-[48px] ${
                          isFeatured
                            ? 'bg-gradient-to-r from-[#00CFFF] via-[#0066FF] to-[#702BFF] shadow-[0_0_28px_rgba(0,102,255,0.55)] hover:shadow-[0_0_38px_rgba(0,207,255,0.75)]'
                            : offer.id === 'scale'
                              ? 'bg-[#030A1C] border border-[#5B4BFF]/70 hover:border-[#00CFFF] hover:bg-[#081330] shadow-[0_0_18px_rgba(112,43,255,0.18)]'
                              : 'bg-[#030A1C] border border-[#0099FF]/75 hover:border-[#00CFFF] hover:bg-[#071633] shadow-[0_0_18px_rgba(0,102,255,0.18)]'
                        }`}
                      >
                        <span>{offer.ctaLabel}</span>
                        <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                      </motion.button>
                    </div>
                  </div>
                </article>
              </motion.div>
            );
          })}
        </div>

        {/* 5. GARANTIE ZENIN DIGITAL */}
        <ScrollReveal
          delay={0.12}
          className="mt-8 rounded-2xl bg-[#040D24]/85 backdrop-blur-xl border border-[#0066FF]/35 shadow-[0_8px_32px_rgba(2,6,23,0.65)] px-5 sm:px-7 py-4 sm:py-5"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-start sm:items-center gap-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#071633] border border-[#00CFFF]/35 text-[#00CFFF] shrink-0">
                <ShieldCheck className="w-6 h-6" aria-hidden="true" />
              </div>

              <div aria-hidden="true" className="hidden sm:block w-px h-10 bg-[#0066FF]/35 shrink-0" />

              <div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {guaranteeInfo.titlePrefix}{' '}
                  <span className="text-[#00CFFF]">{guaranteeInfo.titleHighlight}</span>
                </h3>
                <p className="mt-0.5 text-xs sm:text-sm text-[#B9C7DC] leading-relaxed">
                  {guaranteeInfo.description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5 lg:pl-6 lg:border-l lg:border-white/10 shrink-0">
              {guaranteeInfo.rightBadges.map((badge) => {
                const BadgeIcon = badge.icon === 'zap' ? Zap : Lock;
                return (
                  <div key={badge.id} className="inline-flex items-center gap-2 text-xs sm:text-sm">
                    <BadgeIcon
                      className={`w-4 h-4 shrink-0 ${
                        badge.icon === 'zap' ? 'text-[#00CFFF]' : 'text-[#608CFF]'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="text-[#D1DDF0]">
                      {badge.label}{' '}
                      {badge.emphasis && (
                        <strong className="font-bold text-white tabular-nums">
                          {badge.emphasis}
                        </strong>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* 6. SERVICES COMPLÉMENTAIRES */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {complementaryServices.map((service, idx) => {
            const ServiceIcon = service.icon === 'wrench' ? Wrench : Puzzle;
            return (
              <ScrollReveal key={service.id} delay={0.14 + idx * 0.06}>
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-2xl bg-[#030712]/88 backdrop-blur-xl border border-[#0066FF]/30 hover:border-[#00CFFF]/55 transition-colors p-5 sm:p-6 flex items-start gap-4 sm:gap-5 shadow-[0_8px_28px_rgba(2,6,23,0.55)]"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#071633] border border-[#0066FF]/35 text-[#00CFFF] shrink-0 mt-0.5">
                    <ServiceIcon className="w-6 h-6" aria-hidden="true" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {service.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-[#B9C7DC] leading-relaxed">
                      {service.description}
                    </p>
                    <a
                      href={service.destinationUrl || '#'}
                      onClick={(e) => handleComplementaryClick(e, service)}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#00CFFF] hover:text-white transition-colors"
                    >
                      <span>{service.linkLabel}</span>
                      <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                    </a>
                  </div>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* Modales interactives autonomes de la section tarifs */}
      <OfferQuoteModal
        offer={modalOffer}
        onClose={() => setModalOffer(null)}
        onUseMainContactForm={onSelectOffer}
      />

      <ComplementaryServiceModal
        service={activeComplementary}
        onClose={() => setActiveComplementary(null)}
        onSelectItemForQuote={(itemOffer) => setModalOffer(itemOffer)}
      />
    </section>
  );
}
