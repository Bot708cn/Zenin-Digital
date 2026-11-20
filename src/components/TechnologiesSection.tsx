import { motion } from 'motion/react';
import { Blocks, Cloud, Cpu, Search, Gauge } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from './MotionPrimitives';

const techStack = [
  {
    name: 'Astro',
    role: 'Architecture & Rendu',
    description:
      'Génération de pages ultra-légères avec zéro JavaScript inutile envoyé au navigateur.',
    icon: Blocks,
  },
  {
    name: 'Cloudflare',
    role: 'Réseau Edge & Déploiement',
    description:
      'Diffusion mondiale rapide via Cloudflare Pages, HTTPS natif et protection réseau.',
    icon: Cloud,
  },
  {
    name: 'Intelligence artificielle',
    role: 'Assistance & Structuration',
    description:
      'Accélération maîtrisée de la structuration des contenus et des contrôles qualité sous supervision humaine.',
    icon: Cpu,
  },
  {
    name: 'SEO technique',
    role: 'Indexation & Sémantique',
    description:
      'HTML sémantique, balisage hiérarchique, données structurées Schema.org, sitemap XML et robots.txt.',
    icon: Search,
  },
  {
    name: 'Performance web',
    role: 'Core Web Vitals',
    description:
      'Optimisation des polices, médias, chargement critique et réactivité sur mobile et desktop.',
    icon: Gauge,
  },
];

export function TechnologiesSection() {
  return (
    <section
      id="technologies"
      className="py-16 sm:py-24 bg-[#020817]/25 border-b border-[#006BFF]/20"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-[#00CFFF]">
            Technologies &amp; Standards
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
            La technologie au service de votre croissance.
          </h2>
          <p className="mt-4 text-base text-[#B9C7DC] leading-relaxed">
            Des choix techniques sobres, ouverts et éprouvés pour assurer rapidité, sécurité et pérennité à votre site web.
          </p>
        </ScrollReveal>

        <StaggerContainer className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {techStack.map((tech) => {
            const Icon = tech.icon;
            return (
              <StaggerItem key={tech.name}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.01 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-2xl bg-[#06132D]/75 backdrop-blur-md border border-[#006BFF]/30 hover:border-[#00CFFF]/60 hover:shadow-[0_12px_32px_rgba(0,107,255,0.2)] transition-all p-5 flex flex-col"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#020817]/90 border border-[#006BFF]/35 text-[#00CFFF]">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="mt-4 text-xs font-medium text-[#00CFFF]">
                    {tech.role}
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-white">{tech.name}</h3>
                  <p className="mt-2 text-sm text-[#B9C7DC] leading-relaxed">
                    {tech.description}
                  </p>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
