import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { portfolioProjects, type PortfolioProject } from '../data/portfolio';
import { ProjectMockupPreview } from '../components/ProjectMockupPreview';
import { siteConfig } from '../config/siteConfig';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/MotionPrimitives';

interface PortfolioPageProps {
  onNavigate: (path: string, sectionId?: string) => void;
  onOpenProject: (project: PortfolioProject) => void;
}

export function PortfolioPage({ onNavigate, onOpenProject }: PortfolioPageProps) {
  const [filterType, setFilterType] = useState<string>('Tous');
  const siteTypes = ['Tous', ...Array.from(new Set(portfolioProjects.map((p) => p.siteType)))];

  const visibleProjects =
    filterType === 'Tous'
      ? portfolioProjects
      : portfolioProjects.filter((p) => p.siteType === filterType);

  return (
    <main className="py-12 sm:py-16 bg-[#020817]/30 min-h-[70vh]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/', 'accueil');
          }}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#B9C7DC] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Retour à l&apos;accueil</span>
        </a>

        <ScrollReveal className="mt-6 max-w-3xl">
          <p className="text-sm font-semibold tracking-wide text-[#00CFFF]">Portfolio</p>
          <h1 className="mt-2 text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Architectures &amp; réalisations de démonstration.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#B9C7DC] leading-relaxed">
            Explorez nos modèles d’architectures web conçus pour la rapidité, la lisibilité et la prise de contact. Chaque structure est entièrement personnalisable selon votre activité.
          </p>
        </ScrollReveal>

        {/* Filtres par type de site */}
        <div
          role="group"
          aria-label="Filtrer les réalisations"
          className="mt-8 inline-flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#06132D]/80 backdrop-blur-md border border-[#006BFF]/30"
        >
          {siteTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors min-h-[40px] ${
                filterType === type
                  ? 'bg-[#006BFF] text-white'
                  : 'text-[#B9C7DC] hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <StaggerContainer className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {visibleProjects.map((project) => (
            <StaggerItem key={project.id}>
              <motion.article
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-2xl bg-[#06132D]/75 backdrop-blur-md border border-[#006BFF]/30 hover:border-[#00CFFF]/60 transition-colors p-6 flex flex-col justify-between"
              >
                <div>
                  <ProjectMockupPreview project={project} />
                  <div className="mt-5 flex items-center gap-2 text-xs text-[#B9C7DC]">
                    <span className="font-semibold text-[#00CFFF]">{project.siteType}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.statusLabel}</span>
                  </div>
                  <h2 className="mt-2 text-2xl font-bold text-white">{project.name}</h2>
                  <p className="mt-2.5 text-sm sm:text-base text-[#B9C7DC] leading-relaxed">
                    {project.fullDescription}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#006BFF]/15 flex items-center justify-between gap-4">
                  <span className="text-xs font-mono text-[#B9C7DC]/80 truncate">
                    {project.stack.join(' · ')}
                  </span>
                  <motion.button
                    type="button"
                    onClick={() => onOpenProject(project)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#020817]/80 border border-[#006BFF]/40 hover:border-[#00CFFF] transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
                  >
                    <span>Voir le projet</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </motion.button>
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Appel à l'action bas de page */}
        <ScrollReveal className="mt-14 rounded-2xl bg-[#06132D]/80 backdrop-blur-md border border-[#006BFF]/35 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Un projet similaire en tête ?
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#B9C7DC]">
              Réservez votre diagnostic technique gratuit ou envoyez-nous votre brief.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={siteConfig.calComUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#00CFFF] to-[#006BFF] shadow-[0_0_24px_rgba(0,107,255,0.4)] min-h-[44px]"
            >
              <span>Diagnostic gratuit</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href="/#contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/', 'contact');
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white border border-[#00CFFF]/50 hover:bg-[#081B3E] transition-colors min-h-[44px]"
            >
              <span>Demander un devis</span>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
