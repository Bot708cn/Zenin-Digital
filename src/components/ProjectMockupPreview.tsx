import type { PortfolioProject } from '../data/portfolio';

interface ProjectMockupPreviewProps {
  project: PortfolioProject;
  compact?: boolean;
}

/**
 * Aperçu vectoriel et UI de démonstration (aucune image stock ou générée par IA).
 */
export function ProjectMockupPreview({ project, compact = false }: ProjectMockupPreviewProps) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-[#006BFF]/30 bg-[#020817] ${
        compact ? 'aspect-[16/10]' : 'aspect-[16/9]'
      }`}
      role="img"
      aria-label={`Aperçu d'architecture pour ${project.name}`}
    >
      {/* Dégradé de fond subtil inspiré de la charte Zenin Digital */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(circle at 80% 20%, ${project.accentColor}26, transparent 55%), linear-gradient(160deg, #06132D 0%, #020817 100%)`,
        }}
      />

      {/* Barre de navigateur minimaliste */}
      <div className="relative z-10 flex items-center justify-between px-3.5 py-2 border-b border-[#006BFF]/20 bg-[#040D24]/90">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="w-2 h-2 rounded-full bg-white/25" />
          <span className="w-2 h-2 rounded-full bg-white/25" />
          <span className="w-2 h-2 rounded-full bg-white/25" />
        </div>
        <div className="text-[10px] font-mono text-[#B9C7DC]/80 truncate max-w-[65%]">
          {project.slug}.pages.dev
        </div>
        <div className="text-[10px] font-medium text-[#00CFFF]">HTTPS</div>
      </div>

      {/* Corps du démonstrateur UI */}
      <div className="relative z-10 p-4 sm:p-5 flex flex-col justify-between h-[calc(100%-33px)]">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[10px] text-[#B9C7DC]/80">
            <span className="font-semibold text-white">{project.name}</span>
            <span>{project.siteType}</span>
          </div>

          <div className="pt-1 max-w-[90%]">
            <div className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2">
              {project.previewHeadline}
            </div>
            <p className="mt-1 text-[11px] sm:text-xs text-[#B9C7DC] line-clamp-2">
              {project.previewSubline}
            </p>
          </div>
        </div>

        {/* Blocs structurels et bouton simulé dans la maquette */}
        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="grid grid-cols-3 gap-2 flex-1">
            {project.stack.slice(0, 3).map((tech) => (
              <div
                key={tech}
                className="px-2 py-1.5 rounded-md bg-[#06132D]/90 border border-[#006BFF]/25 text-[10px] text-[#B9C7DC] truncate text-center"
              >
                {tech}
              </div>
            ))}
          </div>
          <span
            className="px-3 py-1.5 rounded-full text-[10px] font-semibold text-white shrink-0"
            style={{
              background: `linear-gradient(90deg, #006BFF, ${project.accentColor})`,
            }}
          >
            {project.previewCta}
          </span>
        </div>
      </div>
    </div>
  );
}
