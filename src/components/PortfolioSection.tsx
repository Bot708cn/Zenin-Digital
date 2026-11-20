import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Code2,
  ExternalLink,
  Eye,
  LayoutGrid,
  MessageSquareQuote,
  Rocket,
  Search,
  User,
  X,
} from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');

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
    const query = searchQuery.trim().toLowerCase();
    return portfolioProjects.filter((project) => {
      const matchesCategory =
        activeCategory === 'all' || project.category === activeCategory;
      if (!matchesCategory) return false;
      if (!query) return true;

      return (
        project.name.toLowerCase().includes(query) ||
        project.siteType.toLowerCase().includes(query) ||
        project.natureLabel.toLowerCase().includes(query) ||
        project.displayUrl.toLowerCase().includes(query) ||
        project.shortDescription.toLowerCase().includes(query)
      );
    });
  }, [activeCategory, searchQuery]);

  const filterOptions: Array<{
    id: CategoryFilter;
    label: string;
    count: number;
    icon: typeof LayoutGrid;
  }> = [
    { id: 'all', label: 'Tous les projets', count: counts.all, icon: LayoutGrid },
    { id: 'client', label: 'Réalisations clients', count: counts.client, icon: User },
    { id: 'demo', label: 'Projets & démonstrations', count: counts.demo, icon: Code2 },
  ];

  const handleScrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = '/#contact';
    }
  };

  return (
    <section
      id="realisations"
      className="relative overflow-hidden py-16 sm:py-24 bg-[#020617]/65 backdrop-blur-[2px] border-b border-[#0066FF]/25"
    >
      {/* Halos lumineux exclusivement bleu électrique et cyan */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[780px] h-[320px] rounded-full bg-[#0066FF]/18 blur-[130px]" />
        <div className="absolute top-1/2 -left-28 w-[420px] h-[420px] rounded-full bg-[#00D4FF]/10 blur-[130px]" />
        <div className="absolute -bottom-24 right-[-60px] w-[460px] h-[420px] rounded-full bg-[#008BFF]/15 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* 4. SECTION HERO CENTRÉE */}
        <ScrollReveal className="relative text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#030D24]/90 border border-[#00D4FF]/45 shadow-[0_0_24px_rgba(0,212,255,0.2)]">
            <span
              aria-hidden="true"
              className="w-2 h-2 rounded-full bg-[#00D4FF] shadow-[0_0_10px_#00D4FF]"
            />
            <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">
              Nos Réalisations
            </span>
          </div>

          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[2.85rem] font-extrabold tracking-tight text-white leading-[1.15] [text-wrap:balance]">
            Aperçus réels de nos{' '}
            <span className="bg-gradient-to-r from-[#00D4FF] via-[#38BDF8] to-[#0066FF] bg-clip-text text-transparent">
              réalisations
            </span>
            , maquettes et projets web.
          </h2>

          <p className="mt-4 text-sm sm:text-base lg:text-lg text-[#B9C7DC] leading-relaxed">
            Chaque projet présenté ci-dessous renvoie vers son site réel. Nous distinguons clairement les réalisations clients confirmées des projets internes, maquettes et démonstrations.
          </p>

          <div
            aria-hidden="true"
            className="mt-5 mx-auto w-24 h-[2px] rounded-full bg-gradient-to-r from-[#00D4FF] via-[#008BFF] to-[#0066FF]/40"
          />

          {!showAll && (
            <div className="mt-6 flex justify-center lg:justify-end">
              <motion.a
                href="/portfolio"
                onClick={(e) => {
                  e.preventDefault();
                  onViewAllPortfolio();
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white border border-[#00D4FF]/45 bg-[#030D24]/85 backdrop-blur-md hover:border-[#00D4FF] hover:shadow-[0_0_20px_rgba(0,212,255,0.28)] transition-all whitespace-nowrap min-h-[42px]"
              >
                <span>Vue d&apos;éditeur portfolio</span>
                <ArrowRight className="w-4 h-4 text-[#00D4FF] shrink-0" aria-hidden="true" />
              </motion.a>
            </div>
          )}
        </ScrollReveal>

        {/* 5. FILTRES ET RECHERCHE */}
        <div className="mt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Filtrer les réalisations par catégorie"
            className="flex flex-wrap items-center gap-2"
          >
            {filterOptions.map((option) => {
              const isActive = activeCategory === option.id;
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(option.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all min-h-[42px] ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0066FF] via-[#008BFF] to-[#00D4FF] text-white shadow-[0_0_24px_rgba(0,139,255,0.45)]'
                      : 'bg-[#030D24]/85 text-[#B9C7DC] border border-[#0066FF]/35 hover:text-white hover:border-[#00D4FF]/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#00D4FF]'}`}
                    aria-hidden="true"
                  />
                  <span>{option.label}</span>
                  <span className="tabular-nums opacity-95">({option.count})</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="hidden lg:block w-px h-8 bg-[#0066FF]/35 shrink-0"
            />
            <div className="relative w-full lg:w-72 xl:w-80">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00D4FF]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un projet..."
                aria-label="Rechercher un projet"
                className="w-full rounded-full bg-[#030D24]/90 border border-[#0066FF]/40 pl-10 pr-9 py-2.5 text-sm text-white placeholder:text-[#B9C7DC]/65 focus:border-[#00D4FF] focus:outline-none focus:shadow-[0_0_18px_rgba(0,212,255,0.2)] transition-all min-h-[42px]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Effacer la recherche"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-6 h-6 rounded-full text-[#B9C7DC] hover:text-white hover:bg-[#061838] transition-colors"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* États vides honnêtes (catégorie client vide ou recherche sans résultat) */}
        {filteredProjects.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-[#030D24]/85 backdrop-blur-md border border-[#0066FF]/35 p-8 sm:p-10 text-center">
            {activeCategory === 'client' && !searchQuery.trim() ? (
              <>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Aucune réalisation client publiée pour le moment
                </h3>
                <p className="mt-2.5 text-sm sm:text-base text-[#B9C7DC] max-w-xl mx-auto leading-relaxed">
                  Par transparence, seuls les projets dont la relation client et l’autorisation de diffusion sont confirmées apparaissent ici. Consultez nos 9 projets internes, maquettes et démonstrations en ligne.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#0066FF] to-[#00D4FF] shadow-[0_0_20px_rgba(0,102,255,0.4)] min-h-[44px]"
                >
                  <span>Afficher tous les projets ({counts.all})</span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Aucun projet ne correspond à « {searchQuery} »
                </h3>
                <p className="mt-2 text-sm text-[#B9C7DC]">
                  Essayez un autre mot-clé ou réinitialisez les filtres.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#0066FF] to-[#00D4FF] min-h-[44px]"
                >
                  <span>Réinitialiser la recherche</span>
                </button>
              </>
            )}
          </div>
        ) : (
          /* 6 & 7. GRILLE 3 COLONNES DES PROJETS */
          <StaggerContainer
            key={`${activeCategory}-${searchQuery}`}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-7"
          >
            {filteredProjects.map((project) => (
              <StaggerItem key={project.id}>
                <motion.article
                  whileHover={{ y: -5, scale: 1.01 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="group h-full rounded-2xl bg-[#030B20]/90 backdrop-blur-xl border border-[#0066FF]/35 hover:border-[#00D4FF]/70 hover:shadow-[0_16px_42px_rgba(0,102,255,0.26)] transition-all duration-300 p-5 flex flex-col justify-between"
                >
                  <div>
                    <ProjectMockupPreview project={project} compact />

                    {/* Badge bleu-cyan + nature réelle */}
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-[#0066FF]/20 border border-[#00D4FF]/40 text-[#00D4FF] font-semibold">
                        {project.siteType}
                      </span>
                      <span aria-hidden="true" className="text-[#B9C7DC]/60">
                        ·
                      </span>
                      <span className="text-[#B9C7DC]">{project.natureLabel}</span>
                    </div>

                    <h3 className="mt-3 text-xl font-bold text-white tracking-tight">
                      {project.name}
                    </h3>
                    <p className="mt-2 text-sm text-[#B9C7DC] leading-relaxed">
                      {project.shortDescription}
                    </p>

                    {/* Emplacement réservé aux témoignages authentiques */}
                    <div className="mt-4 pt-3 border-t border-[#0066FF]/15">
                      {project.testimonial?.verifiedAuthorized ? (
                        <blockquote className="text-xs sm:text-sm text-[#E2ECFA] leading-relaxed">
                          <p className="italic">« {project.testimonial.quote} »</p>
                          <footer className="mt-1.5 text-xs font-medium text-[#00D4FF] not-italic">
                            — {project.testimonial.authorName}
                            {project.testimonial.authorRole
                              ? `, ${project.testimonial.authorRole}`
                              : ''}
                          </footer>
                        </blockquote>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-[#B9C7DC]/65">
                          <MessageSquareQuote
                            className="w-3.5 h-3.5 text-[#008BFF] shrink-0"
                            aria-hidden="true"
                          />
                          <span>Témoignage à venir</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Boutons Détails & Visiter le site */}
                  <div className="mt-5 pt-4 border-t border-[#0066FF]/20 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onOpenProject(project)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#020617] border border-[#00D4FF]/45 hover:border-[#00D4FF] hover:bg-[#061838] transition-colors whitespace-nowrap shrink-0 min-h-[42px]"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#00D4FF] shrink-0" aria-hidden="true" />
                      <span>Détails</span>
                    </button>

                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#0066FF] via-[#008BFF] to-[#00D4FF] shadow-[0_0_18px_rgba(0,102,255,0.38)] hover:shadow-[0_0_26px_rgba(0,212,255,0.6)] transition-all whitespace-nowrap shrink-0 min-h-[42px]"
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

        {/* 9. SECTION FINALE — GRANDE BANNIÈRE HORIZONTALE LUMINEUSE */}
        <ScrollReveal delay={0.1} className="mt-12 sm:mt-14">
          <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-r from-[#00D4FF]/55 via-[#0066FF]/45 to-[#00D4FF]/55 shadow-[0_0_44px_rgba(0,102,255,0.24)]">
            <div className="relative rounded-[15px] bg-gradient-to-r from-[#030A1C]/95 via-[#061838]/95 to-[#030B20]/95 px-6 sm:px-8 py-6 sm:py-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0066FF]/25 to-[#00D4FF]/20 border border-[#00D4FF]/45 text-[#00D4FF] shadow-[0_0_24px_rgba(0,212,255,0.22)] shrink-0">
                  <Rocket className="w-7 h-7" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Un projet en tête ?
                  </h3>
                  <p className="mt-1 text-sm sm:text-base text-[#B9C7DC] leading-relaxed">
                    Transformons ensemble votre idée en une solution digitale performante.
                  </p>
                </div>
              </div>

              <motion.a
                href="/#contact"
                onClick={handleScrollToContact}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.16 }}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm sm:text-base font-bold text-white bg-gradient-to-r from-[#0066FF] via-[#008BFF] to-[#00D4FF] shadow-[0_0_28px_rgba(0,139,255,0.5)] hover:shadow-[0_0_38px_rgba(0,212,255,0.75)] transition-shadow whitespace-nowrap shrink-0 min-h-[48px]"
              >
                <span>Demander un devis maintenant</span>
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </motion.a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
