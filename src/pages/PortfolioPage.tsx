import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ExternalLink, Eye, MessageSquareQuote } from 'lucide-react';
import {
  portfolioProjects,
  type PortfolioProject,
  type ProjectCategory,
} from '../data/portfolio';
import { ProjectMockupPreview } from '../components/ProjectMockupPreview';
import { siteConfig } from '../config/siteConfig';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/MotionPrimitives';

interface PortfolioPageProps {
  onNavigate: (path: string, sectionId?: string) => void;
  onOpenProject: (project: PortfolioProject) => void;
}

type CategoryFilter = 'all' | ProjectCategory;

export function PortfolioPage({ onNavigate, onOpenProject }: PortfolioPageProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const counts = useMemo(() => {
    const client = portfolioProjects.filter((p) => p.category === 'client').length;
    const demo = portfolioProjects.filter((p) => p.category === 'demo').length;
    return {
      all: portfolioProjects.length,
      client,
      demo,
    };
  }, []);

  const visibleProjects = useMemo(() => {
    if (activeCategory === 'all') return portfolioProjects;
    return portfolioProjects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const filterOptions: Array<{ id: CategoryFilter; label: string; count: number }> = [
    { id: 'all', label: 'Tous les projets', count: counts.all },
    { id: 'client', label: 'Réalisations clients', count: counts.client },
    { id: 'demo', label: 'Projets & démonstrations', count: counts.demo },
  ];

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
          <h1 className="mt-2 text-3xl sm:text-5xl font-bold tracking-tight text-white [text-wrap:balance]">
            Réalisations, maquettes &amp; projets web en ligne.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#B9C7DC] leading-relaxed">
            Explorez chaque site directement via son aperçu intégré ou ouvrez le lien réel dans un nouvel onglet. Les projets internes, maquettes et démonstrations sont clairement distingués des commandes clients confirmées.
          </p>
        </ScrollReveal>

        {/* Filtres par catégorie */}
        <div
          role="tablist"
          aria-label="Filtrer les réalisations"
          className="mt-8 inline-flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-[#06132D]/85 backdrop-blur-md border border-[#006BFF]/30"
        >
          {filterOptions.map((option) => {
            const isActive = activeCategory === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(option.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors min-h-[40px] ${
                  isActive
                    ? 'bg-gradient-to-r from-[#006BFF] to-[#0099FF] text-white'
                    : 'text-[#B9C7DC] hover:text-white hover:bg-[#081B3E]/70'
                }`}
              >
                <span>{option.label}</span>
                <span className="tabular-nums text-xs text-[#00CFFF]/90">
                  {isActive ? `(${option.count})` : `(${option.count})`}
                </span>
              </button>
            );
          })}
        </div>

        {visibleProjects.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-[#06132D]/75 backdrop-blur-md border border-[#006BFF]/30 p-8 sm:p-10 text-center">
            <h2 className="text-xl font-bold text-white">
              Aucune réalisation client publiée pour le moment
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-[#B9C7DC] max-w-xl mx-auto leading-relaxed">
              Par souci d’exactitude, seuls les projets dont la relation client et l’autorisation de publication sont confirmées figurent dans cette catégorie.
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory('demo')}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#006BFF] to-[#00CFFF] min-h-[44px]"
            >
              <span>Voir les projets &amp; démonstrations</span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <StaggerContainer
            key={activeCategory}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-7"
          >
            {visibleProjects.map((project) => (
              <StaggerItem key={project.id}>
                <motion.article
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-2xl bg-[#06132D]/80 backdrop-blur-md border border-[#006BFF]/30 hover:border-[#00CFFF]/60 transition-colors p-5 sm:p-6 flex flex-col justify-between"
                >
                  <div>
                    <ProjectMockupPreview project={project} compact />

                    <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#B9C7DC]">
                      <span className="font-semibold text-[#00CFFF]">{project.siteType}</span>
                      <span aria-hidden="true">·</span>
                      <span>{project.natureLabel}</span>
                    </div>

                    <h2 className="mt-2 text-xl sm:text-2xl font-bold text-white">
                      {project.name}
                    </h2>
                    <p className="mt-2 text-sm text-[#B9C7DC] leading-relaxed">
                      {project.fullDescription}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#006BFF]/15">
                      {project.testimonial?.verifiedAuthorized ? (
                        <blockquote className="text-xs sm:text-sm text-[#E2ECFA] leading-relaxed">
                          <p className="italic">« {project.testimonial.quote} »</p>
                          <footer className="mt-1.5 text-xs font-medium text-[#00CFFF] not-italic">
                            — {project.testimonial.authorName}
                            {project.testimonial.authorRole
                              ? `, ${project.testimonial.authorRole}`
                              : ''}
                          </footer>
                        </blockquote>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-[#B9C7DC]/65">
                          <MessageSquareQuote
                            className="w-3.5 h-3.5 text-[#006BFF]/80 shrink-0"
                            aria-hidden="true"
                          />
                          <span>Témoignage à venir</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#006BFF]/20 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onOpenProject(project)}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#B9C7DC] hover:text-white bg-[#020817]/75 border border-[#006BFF]/30 hover:border-[#00CFFF]/60 transition-colors whitespace-nowrap shrink-0 min-h-[42px]"
                    >
                      <Eye className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>Détails</span>
                    </button>

                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#006BFF] to-[#0099FF] hover:from-[#0077FF] hover:to-[#00CFFF] transition-all whitespace-nowrap shrink-0 min-h-[42px]"
                    >
                      <span>Visiter le site</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    </a>
                  </div>
                </motion.article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

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
