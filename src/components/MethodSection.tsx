import { motion } from 'motion/react';
import { SearchCheck, Palette, Code, Rocket } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from './MotionPrimitives';

const methodSteps = [
  {
    number: '01',
    title: 'Diagnostic',
    description: 'Analyse de vos besoins et de votre activité.',
    detail:
      'Cadrage des objectifs, de votre cible client, de votre arborescence et des prérequis techniques.',
    icon: SearchCheck,
  },
  {
    number: '02',
    title: 'Design',
    description: "Conception d'une interface adaptée à votre marque.",
    detail:
      'Maquettage sur mesure orienté lisibilité, hiérarchie de l’information et conversion sur mobile comme sur desktop.',
    icon: Palette,
  },
  {
    number: '03',
    title: 'Développement',
    description: 'Création avec une stack moderne et optimisée.',
    detail:
      'Intégration propre en TypeScript et architecture légère, balisage SEO sémantique et validation des formulaires.',
    icon: Code,
  },
  {
    number: '04',
    title: 'Livraison',
    description: 'Mise en ligne et remise de votre code et domaine.',
    detail:
      'Déploiement sur votre infrastructure, vérifications techniques finales et transfert complet de vos accès.',
    icon: Rocket,
  },
];

export function MethodSection() {
  return (
    <section
      id="methode"
      className="py-16 sm:py-24 bg-[#040B1F]/40 backdrop-blur-[2px] border-b border-[#006BFF]/20"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-[#00CFFF]">
            Méthode de travail
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Votre site professionnel en 5 jours.
          </h2>
          <p className="mt-4 text-base text-[#B9C7DC] leading-relaxed">
            Un processus structuré en quatre étapes claires, sous réserve de validation rapide et de fourniture de vos contenus initiaux.
          </p>
        </ScrollReveal>

        {/* Timeline visuelle animée */}
        <div className="mt-12 relative">
          {/* Ligne de connexion animée au scroll sur desktop */}
          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block origin-left absolute top-11 left-8 right-8 h-px bg-gradient-to-r from-[#006BFF]/30 via-[#00CFFF]/80 to-[#006BFF]/30"
          />

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {methodSteps.map((step) => {
              const Icon = step.icon;
              return (
                <StaggerItem key={step.number}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative h-full rounded-2xl bg-[#06132D]/75 backdrop-blur-md border border-[#006BFF]/30 hover:border-[#00CFFF]/60 transition-colors p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="relative z-10 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#020817] border border-[#00CFFF]/45 text-[#00CFFF] shadow-[0_0_20px_rgba(0,107,255,0.28)]">
                          <Icon className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <span className="font-mono text-sm font-semibold text-[#00CFFF] tabular-nums">
                          {step.number}
                        </span>
                      </div>

                      <h3 className="mt-5 text-lg font-bold text-white">
                        {step.number} — {step.title}
                      </h3>
                      <p className="mt-2 text-sm font-medium text-white/95">
                        {step.description}
                      </p>
                      <p className="mt-2.5 text-sm text-[#B9C7DC] leading-relaxed">
                        {step.detail}
                      </p>
                    </div>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
