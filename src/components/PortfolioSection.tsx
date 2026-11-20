import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ExternalLink, Eye, MessageSquareQuote } from 'lucide-react';
import {
  portfolioProjects,
  type PortfolioProject,
  type ProjectCategory,
} from '../data/portfolio';
import { ProjectMockupPreview } from './ProjectMockupPreview';
import { ScrollReveal, StaggerContainer, StaggerItem } from './MotionPrimitives';

interface PortfolioSectionProps {
  onOpenProject: (project: PortfolioProject) => void;
  onViewAllPortfolio: () => void;
  showAll?: boolean;
}

type CategoryFilter = 'all' | ProjectCategory;

export function PortfolioSection({
  onOpenProject,
  onViewAllPortfolio,
  showAll = false,
}: PortfolioSectionProps) {
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

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return portfolioProjects;
    return portfolioProjects.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  const filterOptions: Array<{ id: CategoryFilter; label: string; count: number }> = [
    { id: 'all', label: 'Tous les projets', count: counts.all },
    { id: 'client', label: 'Réalisations clients', count: counts.client },
    { id: 'demo', label: 'Projets & démonstrations', count: counts.demo },
  ];

  return (
    <section
      id="realisations"
      className="py-16 sm:py-24 bg-[#020817]/25 border-b border-[#006BFF]/20"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-wide text-[#00CFFF]">
              Réalisations &amp; Projets
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white [text-wrap:balance]">
              Aperçus réels de nos réalisations, maquettes et projets web.
            </h2>
            <p className="mt-4 text-base text-[#B9C7DC] leading-relaxed">
              Chaque projet présenté ci-dessous renvoie vers son site réel. Nous distinguons clairement les réalisations clients confirmées des projets internes, maquettes et démonstrations.
            </p>
          </div>

          {!showAll && (
            <motion.a
              href="/portfolio"
              onClick={(e) => {
                e.preventDefault();
                onViewAllPortfolio();
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white border border-[#006BFF]/45 bg-[#06132D]/75 backdrop-blur-md hover:border-[#00CFFF] transition-colors whitespace-nowrap shrink-0 self-start md:self-auto min-h-[44px]"
            >
              <span>Vue dédiée portfolio</span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </motion.a>
          )}
        </ScrollReveal>

        {/* Onglets de séparation transparente : Clients confirmés vs Projets & démonstrations */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div
            role="tablist"
            aria-label="Filtrer les réalisations par catégorie"
            className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-[#06132D]/85 backdrop-blur-md border border-[#006BFF]/30 self-start"
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
                      ? 'bg-gradient-to-r from-[#006BFF] to-[#0099FF] text-white shadow-[0_0_16px_rgba(0,107,255,0.4)]'
                      : 'text-[#B9C7DC] hover:text-white hover:bg-[#081B3E]/70'
                  }`}
                >
                  <span>{option.label}</span>
                  <span
                    className={`tabular-nums text-xs ${
                      isActive ? 'text-white/90' : 'text-[#00CFFF]'
                    }`}
                  >
                    ({option.count})
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-[#B9C7DC]/80 leading-relaxed max-w-md">
            Seuls les projets disposant d’une relation client et d’une autorisation confirmées sont classés dans « Réalisations clients ».
          </p>
        </div>

        {/* État transparent si l'onglet Réalisations clients ne contient pas encore de projet validé */}
        {filteredProjects.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-[#06132D]/75 backdrop-blur-md border border-[#006BFF]/30 p-8 sm:p-10 text-center">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Aucune réalisation client publiée pour le moment
            </h3>
            <p className="mt-2.5 text-sm sm:text-base text-[#B9C7DC] max-w-xl mx-auto leading-relaxed">
              Par transparence, seuls les projets dont l’accord client et l’autorisation de diffusion sont confirmés figurent dans cette catégorie. En attendant, consultez nos projets internes, maquettes et démonstrations en ligne.
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory('demo')}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#006BFF] to-[#00CFFF] shadow-[0_0_20px_rgba(0,107,255,0.4)] hover:shadow-[0_0_28px_rgba(0,207,255,0.6)] transition-shadow min-h-[44px]"
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
            {filteredProjects.map((project) => (
              <StaggerItem key={project.id}>
                <motion.article
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="group h-full rounded-2xl bg-[#06132D]/80 backdrop-blur-md border border-[#006BFF]/30 hover:border-[#00CFFF]/60 hover:shadow-[0_14px_38px_rgba(0,107,255,0.22)] transition-all duration-200 p-5 flex flex-col justify-between"
                >
                  <div>
                    <ProjectMockupPreview project={project} compact />

                    <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#B9C7DC]">
                      <span className="font-semibold text-[#00CFFF]">{project.siteType}</span>
                      <span aria-hidden="true">·</span>
                      <span>{project.natureLabel}</span>
                    </div>

                    <h3 className="mt-2 text-xl font-bold text-white">{project.name}</h3>
                    <p className="mt-2 text-sm text-[#B9C7DC] leading-relaxed">
                      {project.shortDescription}
                    </p>

                    {/* Espace réservé aux témoignages authentiques et autorisés */}
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
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#006BFF] to-[#0099FF] hover:from-[#0077FF] hover:to-[#00CFFF] shadow-[0_0_16px_rgba(0,107,255,0.3)] hover:shadow-[0_0_22px_rgba(0,207,255,0.45)] transition-all whitespace-nowrap shrink-0 min-h-[42px]"
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
      </div>
    </section>
  );
}
