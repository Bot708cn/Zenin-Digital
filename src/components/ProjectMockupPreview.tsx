import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Globe, Lock } from 'lucide-react';
import type { PortfolioProject } from '../data/portfolio';

interface ProjectMockupPreviewProps {
  project: PortfolioProject;
  compact?: boolean;
  interactive?: boolean;
}

const DESKTOP_VIEWPORT_WIDTH = 1280;
const DESKTOP_VIEWPORT_HEIGHT = 800;

/**
 * Cadre navigateur élégant affichant un aperçu réel du site via iframe
 * lorsque le site l'autorise, avec gestion honnête du chargement et des erreurs.
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

  // Calcul précis de l'échelle pour afficher la page complète dans le cadre sans coupure
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

  // Chargement différé propre des iframes lorsque la carte entre dans le champ de vision
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

  // Réinitialisation si on change de projet dans la modale
  useEffect(() => {
    setIframeStatus('loading');
  }, [project.url]);

  // Timeout de sécurité si une iframe est bloquée silencieusement par un navigateur
  useEffect(() => {
    if (!shouldLoadIframe || iframeStatus !== 'loading') return;
    const timer = window.setTimeout(() => {
      setIframeStatus((prev) => (prev === 'loading' ? 'blocked' : prev));
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [shouldLoadIframe, iframeStatus]);

  return (
    <div className="overflow-hidden rounded-xl border border-[#006BFF]/35 bg-[#020817] shadow-[0_10px_30px_rgba(2,8,23,0.65)]">
      {/* Barre supérieure du navigateur : 3 points + adresse réelle du site */}
      <div className="flex items-center justify-between gap-2.5 px-3 py-2 border-b border-[#006BFF]/25 bg-[#040D24]">
        <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400/75" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/75" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/75" />
        </div>

        <div className="flex items-center justify-center gap-1.5 min-w-0 flex-1 px-2.5 py-1 rounded-md bg-[#020817]/90 border border-[#006BFF]/20">
          <Lock className="w-3 h-3 text-[#00CFFF] shrink-0" aria-hidden="true" />
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
          className="inline-flex items-center justify-center w-7 h-7 rounded-md text-[#B9C7DC] hover:text-white hover:bg-[#06132D] transition-colors shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </div>

      {/* Fenêtre d'aperçu réel du site */}
      <div
        ref={viewportContainerRef}
        className={`relative w-full overflow-hidden bg-[#020817] ${
          compact ? 'aspect-[16/10]' : 'aspect-[16/10] sm:aspect-[16/9]'
        }`}
      >
        {shouldLoadIframe && iframeStatus !== 'blocked' && (
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
            className={`border-0 bg-white transition-opacity duration-300 ${
              iframeStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
            } ${interactive ? 'pointer-events-auto' : 'pointer-events-none'}`}
          />
        )}

        {/* État de chargement pendant la récupération du site réel */}
        {iframeStatus === 'loading' && (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-gradient-to-br from-[#040D24] via-[#020817] to-[#06132D] px-4 text-center"
          >
            <Globe className="w-5 h-5 text-[#00CFFF] animate-pulse" />
            <span className="text-xs font-medium text-[#B9C7DC]">
              Chargement de l’aperçu en direct...
            </span>
            <span className="text-[11px] font-mono text-[#B9C7DC]/65 truncate max-w-full">
              {project.displayUrl}
            </span>
          </div>
        )}

        {/* Message honnête si l'iframe est bloquée ou inaccessible */}
        {iframeStatus === 'blocked' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#040D24] px-5 text-center">
            <Globe className="w-6 h-6 text-[#00CFFF]" aria-hidden="true" />
            <div className="space-y-1 max-w-xs">
              <p className="text-xs sm:text-sm font-semibold text-white">
                Aperçu intégré non disponible
              </p>
              <p className="text-[11px] sm:text-xs text-[#B9C7DC]/85 leading-relaxed">
                Ce site bloque l’affichage en cadre intégré ou n’a pas pu être chargé ici.
              </p>
            </div>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-[#006BFF] hover:bg-[#0080FF] transition-colors"
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
