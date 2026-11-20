import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, ExternalLink, MessageSquareQuote, X } from 'lucide-react';
import type { PortfolioProject } from '../data/portfolio';
import { ProjectMockupPreview } from './ProjectMockupPreview';

interface ProjectDetailModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
  onRequestSimilar: (project: PortfolioProject) => void;
}

export function ProjectDetailModal({
  project,
  onClose,
  onRequestSimilar,
}: ProjectDetailModalProps) {
  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020817]/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#06132D]/95 backdrop-blur-xl border border-[#00CFFF]/45 shadow-[0_24px_80px_rgba(0,107,255,0.35)] p-5 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#B9C7DC]">
                  <span className="font-semibold text-[#00CFFF]">{project.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.natureLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.siteType}</span>
                </div>
                <h2
                  id="project-modal-title"
                  className="mt-1.5 text-2xl sm:text-3xl font-bold text-white"
                >
                  {project.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer l'aperçu du projet"
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#020817]/80 border border-[#006BFF]/35 text-[#B9C7DC] hover:text-white hover:border-[#00CFFF] transition-colors shrink-0"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6">
              <ProjectMockupPreview project={project} interactive />
            </div>

            <p className="mt-6 text-sm sm:text-base text-[#B9C7DC] leading-relaxed">
              {project.fullDescription}
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-[#006BFF]/20 pt-6">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Points clés de l&apos;interface
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {project.architecturePoints.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-[#B9C7DC]">
                      <Check
                        className="w-4 h-4 text-[#00CFFF] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">
                  Témoignage &amp; retour d&apos;expérience
                </h3>
                {project.testimonial?.verifiedAuthorized ? (
                  <blockquote className="mt-3 rounded-xl bg-[#020817]/70 border border-[#006BFF]/25 p-4 text-sm text-[#E2ECFA] leading-relaxed">
                    <p className="italic">« {project.testimonial.quote} »</p>
                    <footer className="mt-2 text-xs font-semibold text-[#00CFFF] not-italic">
                      — {project.testimonial.authorName}
                      {project.testimonial.authorRole
                        ? `, ${project.testimonial.authorRole}`
                        : ''}
                    </footer>
                  </blockquote>
                ) : (
                  <div className="mt-3 rounded-xl bg-[#020817]/60 border border-[#006BFF]/20 p-4 flex items-start gap-2.5 text-xs sm:text-sm text-[#B9C7DC]/80 leading-relaxed">
                    <MessageSquareQuote
                      className="w-4 h-4 text-[#00CFFF] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>
                      Témoignage à venir — aucun avis n’est publié sans confirmation et autorisation du propriétaire du site.
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#006BFF]/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white border border-[#00CFFF]/55 bg-[#020817]/75 hover:bg-[#081B3E] transition-colors whitespace-nowrap min-h-[44px]"
              >
                <span>Visiter le site</span>
                <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() => onRequestSimilar(project)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#006BFF] to-[#00CFFF] shadow-[0_0_20px_rgba(0,107,255,0.4)] hover:shadow-[0_0_28px_rgba(0,207,255,0.6)] transition-all whitespace-nowrap min-h-[44px]"
              >
                <span>Demander un devis similaire</span>
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
