import { useEffect, useRef, useState } from 'react';
import { Code2, ExternalLink, Globe, Layers, Lock, Monitor, ShieldCheck } from 'lucide-react';
import type { PortfolioProject } from '../data/portfolio';

interface ProjectMockupPreviewProps {
  project: PortfolioProject;
  compact?: boolean;
  interactive?: boolean;
}

const DESKTOP_VIEWPORT_WIDTH = 1280;
const DESKTOP_VIEWPORT_HEIGHT = 800;

/**
 * Cadre navigateur élégant affichant l'aperçu réel du site via iframe
 * lorsque le site l'autorise, avec badge du type de projet et gestion honnête des indisponibilités.
 */
export function ProjectMockupPreview({
  project,
  compact = false,
  interactive = false,
}: ProjectMockupPreviewProps) {
  const viewportContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.32);
  const [shouldLoadIframe, setShouldLoadIframe] = useState(!compact);
  const [iframeStatus, setIframeStatus] = useState<'loading' | 'loaded' | 'blocked'>('loading');

  useEffect(() => {
    const el = viewportContainerRef.current;
    if (!el) return;

    const updateScale = () => {
      const width = el.clientWidth;
      if (width > 0) {
        setScale(width / DESKTOP_VIEWPORT_WIDTH);
      }
    };

    updateScale();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateScale);
      return () => window.removeEventListener('resize', updateScale);
    }

    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (shouldLoadIframe) return;
    const el = viewportContainerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShouldLoadIframe(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadIframe(true);
          observer.disconnect();
        }
      },
      { rootMargin: '250px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLoadIframe]);

  useEffect(() => {
    setIframeStatus('loading');
  }, [project.url]);

  useEffect(() => {
    if (!shouldLoadIframe || iframeStatus !== 'loading') return;
    const timer = window.setTimeout(() => {
      setIframeStatus((prev) => (prev === 'loading' ? 'blocked' : prev));
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [shouldLoadIframe, iframeStatus]);

  const BadgeIcon =
    project.badgeType === 'Client'
      ? ShieldCheck
      : project.badgeType === 'Interne'
        ? Monitor
        : project.badgeType === 'Maquette'
          ? Layers
          : Code2;

  return (
    <div className="overflow-hidden rounded-xl border border-[#0066FF]/40 bg-[#020617] shadow-[0_10px_30px_rgba(2,6,23,0.75)]">
      {/* Barre supérieure de navigateur stylisée : 3 points + domaine réel + badge type */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-[#0066FF]/25 bg-[#030B20]">
        <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
        </div>

        <div className="flex items-center justify-center gap-1.5 min-w-0 flex-1 px-2.5 py-1 rounded-md bg-[#020617]/95 border border-[#0066FF]/25">
          <Lock className="w-3 h-3 text-[#00D4FF] shrink-0" aria-hidden="true" />
          <span
            className="text-[11px] font-mono text-[#B9C7DC] truncate"
            title={project.url}
          >
            {project.displayUrl}
          </span>
        </div>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Ouvrir ${project.name} dans un nouvel onglet`}
          title="Ouvrir dans un nouvel onglet"
          className="inline-flex items-center justify-center w-7 h-7 rounded-md text-[#38BDF8] hover:text-white hover:bg-[#061838] transition-colors shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </div>

      {/* Fenêtre d'aperçu réel avec zoom subtil au survol et badge de type */}
      <div
        ref={viewportContainerRef}
        className={`relative w-full overflow-hidden bg-[#020617] ${
          compact ? 'aspect-[16/10]' : 'aspect-[16/10] sm:aspect-[16/9]'
        }`}
      >
        {/* Badge discret bleu-cyan indiquant la nature réelle du projet */}
        <div className="absolute top-2.5 right-2.5 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#020617]/90 backdrop-blur-md border border-[#00D4FF]/45 shadow-[0_4px_14px_rgba(0,102,255,0.28)] pointer-events-none">
          <BadgeIcon className="w-3 h-3 text-[#00D4FF] shrink-0" aria-hidden="true" />
          <span className="text-[11px] font-semibold text-white whitespace-nowrap">
            {project.badgeType}
          </span>
        </div>

        {shouldLoadIframe && iframeStatus !== 'blocked' && (
          <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.03]">
            <iframe
              src={project.url}
              title={`Aperçu en direct du site ${project.name}`}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              referrerPolicy="no-referrer"
              onLoad={() => setIframeStatus('loaded')}
              onError={() => setIframeStatus('blocked')}
              style={{
                width: `${DESKTOP_VIEWPORT_WIDTH}px`,
                height: `${DESKTOP_VIEWPORT_HEIGHT}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
              className={`border-0 bg-[#020617] transition-opacity duration-300 ${
                iframeStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
              } ${interactive ? 'pointer-events-auto' : 'pointer-events-none'}`}
            />
          </div>
        )}

        {/* État de chargement */}
        {iframeStatus === 'loading' && (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#030B20] via-[#020617] to-[#061838] px-4 text-center"
          >
            <Globe className="w-5 h-5 text-[#00D4FF] animate-pulse" />
            <span className="text-xs font-semibold text-white">{project.name}</span>
            <span className="text-[11px] text-[#B9C7DC]/75">
              Chargement de l’aperçu en direct...
            </span>
          </div>
        )}

        {/* Emplacement honnête si l'aperçu intégré est bloqué ou indisponible */}
        {iframeStatus === 'blocked' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-gradient-to-br from-[#030B20] via-[#020617] to-[#061838] px-5 text-center">
            <Globe className="w-6 h-6 text-[#00D4FF]" aria-hidden="true" />
            <div className="space-y-1 max-w-xs">
              <p className="text-sm font-bold text-white">{project.name}</p>
              <p className="text-xs text-[#B9C7DC]/80 leading-relaxed">
                Aperçu intégré indisponible pour ce site. Ouvrez le lien réel pour le consulter.
              </p>
            </div>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[#0066FF] to-[#00D4FF]"
            >
              <span>Visiter le site</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
