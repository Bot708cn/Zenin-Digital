import { motion } from 'motion/react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { portfolioProjects, type PortfolioProject } from '../data/portfolio';
import { ProjectMockupPreview } from './ProjectMockupPreview';
import { ScrollReveal, StaggerContainer, StaggerItem } from './MotionPrimitives';

interface PortfolioSectionProps {
  onOpenProject: (project: PortfolioProject) => void;
  onViewAllPortfolio: () => void;
  showAll?: boolean;
}

export function PortfolioSection({
  onOpenProject,
  onViewAllPortfolio,
  showAll = false,
}: PortfolioSectionProps) {
  const projects = showAll ? portfolioProjects : portfolioProjects.slice(0, 4);

  return (
    <section
      id="realisations"
      className="py-16 sm:py-24 bg-[#020817]/25 border-b border-[#006BFF]/20"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-wide text-[#00CFFF]">
              Réalisations &amp; Architectures
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Des interfaces conçues pour convertir dès le premier écran.
            </h2>
            <p className="mt-4 text-base text-[#B9C7DC] leading-relaxed">
              Exemples d’architectures web réalisées avec notre stack moderne. Chaque structure est adaptée à votre identité, vos contenus et vos objectifs.
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
              <span>Explorer le portfolio</span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </motion.a>
          )}
        </ScrollReveal>

        <StaggerContainer className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project) => (
            <StaggerItem key={project.id}>
              <motion.article
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="group h-full rounded-2xl bg-[#06132D]/75 backdrop-blur-md border border-[#006BFF]/30 hover:border-[#00CFFF]/60 hover:shadow-[0_12px_36px_rgba(0,107,255,0.2)] transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="transition-transform duration-300 group-hover:-translate-y-0.5">
                    <ProjectMockupPreview project={project} compact />
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-xs text-[#B9C7DC]">
                    <span className="font-medium text-[#00CFFF]">{project.siteType}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.statusLabel}</span>
                  </div>

                  <h3 className="mt-2 text-xl font-bold text-white">{project.name}</h3>
                  <p className="mt-2.5 text-sm sm:text-base text-[#B9C7DC] leading-relaxed">
                    {project.shortDescription}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#006BFF]/15 flex items-center justify-between gap-4">
                  <span className="text-xs font-mono text-[#B9C7DC]/80 truncate">
                    {project.stack.slice(0, 3).join(' · ')}
                  </span>
                  <motion.button
                    type="button"
                    onClick={() => onOpenProject(project)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#020817]/80 border border-[#006BFF]/40 hover:border-[#00CFFF] hover:bg-[#081B3E] transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
                  >
                    <span>Voir le projet</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  </motion.button>
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
