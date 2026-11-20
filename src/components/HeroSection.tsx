import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import {
  ArrowRight,
  BarChart3,
  Clock,
  Code2,
  Gauge,
  Layers,
  Play,
  ShieldCheck,
  Star,
  Tag,
  Wallet,
  Zap,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface HeroSectionProps {
  onNavigate: (path: string, sectionId?: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Parallaxe fluide + légère rotation du petit PC au défilement
  const laptopScrollY = useTransform(scrollYProgress, [0, 1], [0, -64]);
  const laptopScrollRotate = useTransform(scrollYProgress, [0, 1], [0, 4.5]);
  const laptopScrollScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const textScrollY = useTransform(scrollYProgress, [0, 1], [0, 24]);

  // Parallaxe (translation + inclinaison 3D) réactive au mouvement de la souris sur le Hero
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const mouseOffsetX = useSpring(useTransform(pointerX, [-0.5, 0.5], [-16, 16]), {
    stiffness: 120,
    damping: 22,
  });
  const mouseOffsetY = useSpring(useTransform(pointerY, [-0.5, 0.5], [-12, 12]), {
    stiffness: 120,
    damping: 22,
  });
  const haloOffsetX = useSpring(useTransform(pointerX, [-0.5, 0.5], [14, -14]), {
    stiffness: 90,
    damping: 24,
  });
  const haloOffsetY = useSpring(useTransform(pointerY, [-0.5, 0.5], [10, -10]), {
    stiffness: 90,
    damping: 24,
  });
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [8, -8]), {
    stiffness: 140,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 140,
    damping: 20,
  });

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(x);
    pointerY.set(y);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const trustIconMap = {
    gauge: Gauge,
    code: Code2,
    zap: Zap,
    wallet: Wallet,
  };

  const subtitleIconMap = {
    layers: Layers,
    clock: Clock,
    shield: ShieldCheck,
    tag: Tag,
  };

  return (
    <section
      ref={sectionRef}
      id="accueil"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative overflow-hidden border-b border-[#006BFF]/25"
    >
      {/* Léger scrim à gauche pour la lisibilité du titre sur le background permanent */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#020817]/55 via-[#020817]/20 to-transparent pointer-events-none"
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-14 sm:pb-14 lg:pt-16 lg:pb-16">
        {/* Grille principale Hero : Texte à gauche + Illustration PC/Fusée animée à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-6">
          {/* Colonne gauche */}
          <motion.div
            style={{ y: textScrollY }}
            className="lg:col-span-7 space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium text-[#B9C7DC] bg-[#06132D]/85 border border-[#006BFF]/40 backdrop-blur-sm">
                {siteConfig.hero.badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-[2rem] sm:text-[2.75rem] lg:text-[3.35rem] xl:text-[3.65rem] font-extrabold leading-[1.12] tracking-tight text-white"
            >
              Sites Web{' '}
              <span className="text-[#1A8BFF] italic">Ultra-Rapides</span> qui{' '}
              <span className="bg-gradient-to-r from-[#00CFFF] to-[#006BFF] bg-clip-text text-transparent italic">
                Convertissent
              </span>{' '}
              vos Visiteurs en Clients —{' '}
              <motion.span
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block mt-2.5 px-4 sm:px-6 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-r from-[#0055FF] via-[#0073FF] to-[#0099FF] text-white italic shadow-[0_0_32px_rgba(0,107,255,0.55)]"
              >
                Sans Dépendre de Personne.
              </motion.span>
            </motion.h1>

            {/* Sous-titre technique */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm sm:text-base text-[#B9C7DC] pt-1"
            >
              {siteConfig.hero.subtitleSegments.map((segment, index) => {
                const Icon = subtitleIconMap[segment.icon];
                return (
                  <div key={segment.label} className="inline-flex items-center gap-2">
                    {index > 0 && (
                      <span aria-hidden="true" className="text-[#00CFFF]/60 hidden sm:inline">
                        |
                      </span>
                    )}
                    <Icon className="w-4 h-4 text-[#00CFFF] shrink-0" aria-hidden="true" />
                    <span className="font-medium text-white/95">{segment.label}</span>
                  </div>
                );
              })}
            </motion.div>

            {/* Boutons CTA */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <motion.a
                href={siteConfig.calComUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.16 }}
                className="inline-flex items-center justify-center gap-3 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-bold text-white bg-gradient-to-r from-[#00CFFF] via-[#008CFF] to-[#006BFF] shadow-[0_0_30px_rgba(0,153,255,0.55)] hover:shadow-[0_0_44px_rgba(0,207,255,0.8)] transition-shadow duration-200 min-h-[48px]"
              >
                <BarChart3 className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>{siteConfig.hero.primaryCtaLabel}</span>
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </motion.a>

              <motion.a
                href="/portfolio"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/portfolio');
                }}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.16 }}
                className="inline-flex items-center justify-center gap-3 px-6 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-semibold text-white bg-[#020817]/65 backdrop-blur-sm border border-[#00CFFF]/75 hover:bg-[#06132D]/85 hover:border-[#00CFFF] hover:shadow-[0_0_24px_rgba(0,207,255,0.35)] transition-colors duration-200 min-h-[48px]"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#020817] shrink-0">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" aria-hidden="true" />
                </span>
                <span>{siteConfig.hero.secondaryCtaLabel}</span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Colonne droite : Illustration PC + Fusée avec parallaxe souris, flottement renforcé et légère rotation au scroll */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{
                y: laptopScrollY,
                rotate: laptopScrollRotate,
                scale: laptopScrollScale,
                perspective: 1100,
              }}
              className="relative w-full max-w-[460px] lg:max-w-[540px] will-change-transform"
            >
              {/* Halo lumineux pulsant en contre-parallaxe derrière le petit PC */}
              <motion.div
                aria-hidden="true"
                style={{ x: haloOffsetX, y: haloOffsetY }}
                animate={{
                  scale: [0.94, 1.1, 0.94],
                  opacity: [0.35, 0.65, 0.35],
                }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-8 rounded-full bg-gradient-to-tr from-[#006BFF]/38 via-[#00CFFF]/28 to-transparent blur-3xl pointer-events-none"
              />

              {/* Parallaxe souris (translation + inclinaison 3D) */}
              <motion.div
                style={{
                  x: mouseOffsetX,
                  y: mouseOffsetY,
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d',
                }}
                className="relative will-change-transform"
              >
                {/* Flottement continu renforcé */}
                <motion.div
                  animate={{
                    y: [0, -16, 0],
                    rotate: [-1.1, 1.2, -1.1],
                  }}
                  transition={{
                    y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
                    rotate: { duration: 5.8, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  whileHover={{ scale: 1.035 }}
                  className="will-change-transform"
                >
                  <img
                    src={siteConfig.assets.heroIllustration}
                    alt="Ordinateur portable Zenin Digital affichant une courbe de croissance et une fusée au décollage"
                    className="w-full h-auto object-contain drop-shadow-[0_24px_50px_rgba(0,107,255,0.45)]"
                    loading="eager"
                    decoding="async"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Barre de confiance horizontale (4 éléments) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 lg:mt-12 rounded-2xl bg-[#040D24]/80 backdrop-blur-md border border-[#006BFF]/35 shadow-[0_0_32px_rgba(0,107,255,0.16)] px-4 sm:px-6 py-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 lg:divide-x lg:divide-[#006BFF]/25">
            {siteConfig.trustBar.items.map((item) => {
              const Icon = trustIconMap[item.icon];
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3.5 lg:px-5 first:lg:pl-1 last:lg:pr-1"
                  title={item.editableNote}
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#06132D] border border-[#00CFFF]/30 text-[#00CFFF] shrink-0">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm sm:text-base text-white leading-tight tabular-nums">
                      {item.title}
                    </div>
                    {item.badgeText && (
                      <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                        {item.badgeText}
                      </div>
                    )}
                    {item.subtitle && (
                      <div className="text-xs sm:text-sm text-[#B9C7DC] mt-0.5 leading-snug">
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <p className="mt-2.5 text-center text-[11px] text-[#B9C7DC]/75">
          {siteConfig.trustBar.verificationFootnote}
        </p>

        {/* Preuve sociale (5 étoiles) */}
        {siteConfig.socialProof.enabled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-6 flex items-center justify-center gap-4"
          >
            <span
              aria-hidden="true"
              className="hidden md:block flex-1 max-w-[140px] h-px bg-gradient-to-r from-transparent to-[#006BFF]/60"
            />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center">
              <div className="inline-flex items-center gap-1" aria-label="5 étoiles sur 5">
                {Array.from({ length: siteConfig.socialProof.stars }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="text-sm sm:text-[15px] text-white italic">
                {siteConfig.socialProof.quote}{' '}
                <span className="not-italic text-[#B9C7DC] font-medium">
                  — {siteConfig.socialProof.author}
                </span>
                {siteConfig.socialProof.isDemoContent && (
                  <span className="not-italic ml-2 text-xs text-[#B9C7DC]/70">
                    (Exemple de démonstration)
                  </span>
                )}
              </p>
            </div>
            <span
              aria-hidden="true"
              className="hidden md:block flex-1 max-w-[140px] h-px bg-gradient-to-l from-transparent to-[#006BFF]/60"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
