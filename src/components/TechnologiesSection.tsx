import { useEffect, useRef, useState } from 'react';
import {
  Blocks,
  ChevronDown,
  Cloud,
  Cpu,
  Gauge,
  Layers,
  Search,
} from 'lucide-react';

interface TechItem {
  number: string;
  name: string;
  role: string;
  description: string;
  icon: typeof Blocks;
}

const TECH_STACK: TechItem[] = [
  {
    number: '01',
    name: 'Astro',
    role: 'Architecture & Rendu',
    description:
      'Génération de pages ultra-légères avec zéro JavaScript inutile envoyé au navigateur.',
    icon: Blocks,
  },
  {
    number: '02',
    name: 'Cloudflare',
    role: 'Réseau Edge & Déploiement',
    description:
      'Diffusion mondiale rapide via Cloudflare Pages, HTTPS natif et protection réseau.',
    icon: Cloud,
  },
  {
    number: '03',
    name: 'Intelligence artificielle',
    role: 'Assistance & Structuration',
    description:
      'Accélération maîtrisée de la structuration des contenus et des contrôles qualité sous supervision humaine.',
    icon: Cpu,
  },
  {
    number: '04',
    name: 'SEO technique',
    role: 'Indexation & Sémantique',
    description:
      'HTML sémantique, balisage hiérarchique, données structurées Schema.org, sitemap XML et robots.txt.',
    icon: Search,
  },
  {
    number: '05',
    name: 'Performance web',
    role: 'Core Web Vitals',
    description:
      'Optimisation des polices, médias, chargement critique et réactivité sur mobile et desktop.',
    icon: Gauge,
  },
];

const STACK_PARTICLES = [
  { left: '6%', top: '16%', size: 4, phase: 0.2, speed: 1.5 },
  { left: '90%', top: '14%', size: 5, phase: 1.4, speed: 1.2 },
  { left: '12%', top: '84%', size: 3.5, phase: 2.5, speed: 1.4 },
  { left: '92%', top: '78%', size: 4.5, phase: 0.9, speed: 1.1 },
  { left: '52%', top: '5%', size: 3.5, phase: 1.9, speed: 1.6 },
  { left: '76%', top: '88%', size: 4, phase: 3.1, speed: 1.3 },
];

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

export function TechnologiesSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  // Références DOM manipulées directement par JavaScript à 120–144 FPS (aucun re-rendu React par frame)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeBorderRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const particleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const progressPctRef = useRef<HTMLSpanElement | null>(null);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const lastActiveIndexRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);

  const ENTRY_END = 0.14;

  // Boucle JavaScript haute fréquence (VSync natif jusqu'à 120/144+ FPS)
  useEffect(() => {
    const computeScrollTarget = () => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const startY = vh * 0.72;
      const endY = vh - track.offsetHeight;
      const totalTravel = startY - endY;
      if (totalTravel <= 0) {
        targetProgressRef.current = 0;
        return;
      }
      targetProgressRef.current = clamp((startY - rect.top) / totalTravel, 0, 1);
    };

    computeScrollTarget();
    currentProgressRef.current = targetProgressRef.current;

    window.addEventListener('scroll', computeScrollTarget, { passive: true });
    window.addEventListener('resize', computeScrollTarget, { passive: true });

    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const timeSec = now * 0.001;

      // Interpolation exponentielle indépendante de la fréquence (fluide à 60Hz, 120Hz, 144Hz)
      const smoothing = 1 - Math.exp(-16 * dt);
      currentProgressRef.current +=
        (targetProgressRef.current - currentProgressRef.current) * smoothing;

      const p = clamp(currentProgressRef.current, 0, 1);
      const rawEntry = clamp(p / ENTRY_END, 0, 1);
      const entryEase = 1 - Math.pow(1 - rawEntry, 2);

      const stackNorm = clamp((p - ENTRY_END) / (1 - ENTRY_END), 0, 1);
      const deckCursor = stackNorm * (TECH_STACK.length - 1);
      const nextActive = clamp(Math.round(deckCursor), 0, TECH_STACK.length - 1);

      if (nextActive !== lastActiveIndexRef.current) {
        lastActiveIndexRef.current = nextActive;
        setActiveIndex(nextActive);
      }

      const isCompact = window.innerWidth < 768;
      const peekStepY = isCompact ? 18 : 30;
      const entrySpreadBase = isCompact ? 42 : 68;
      const arcBoost = isCompact ? 16 : 24;

      // Mise à jour directe GPU de la barre continue
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${stackNorm.toFixed(4)})`;
      }
      if (progressPctRef.current) {
        progressPctRef.current.textContent = `${Math.round(stackNorm * 100)}%`;
      }

      // Animation continue des particules à 120–144 FPS
      for (let i = 0; i < STACK_PARTICLES.length; i++) {
        const el = particleRefs.current[i];
        if (!el) continue;
        const cfg = STACK_PARTICLES[i];
        const floatY = Math.sin(timeSec * cfg.speed + cfg.phase) * 11;
        const floatX = Math.cos(timeSec * cfg.speed * 0.8 + cfg.phase) * 6;
        const pulse = 0.4 + 0.55 * (0.5 + 0.5 * Math.sin(timeSec * cfg.speed + cfg.phase));
        el.style.transform = `translate3d(${floatX.toFixed(2)}px, ${floatY.toFixed(2)}px, 0)`;
        el.style.opacity = pulse.toFixed(3);
      }

      // Positionnement GPU 3D de chacune des 5 cartes dans la pile
      for (let idx = 0; idx < TECH_STACK.length; idx++) {
        const cardEl = cardRefs.current[idx];
        if (!cardEl) continue;

        const diff = idx - deckCursor;
        const absDiff = Math.abs(diff);

        const entrySpread = (idx - 2) * entrySpreadBase * (1 - entryEase);
        const entryOpacity = 0.2 + 0.8 * entryEase;

        const handoffArc = absDiff < 1 ? Math.sin(absDiff * Math.PI) * arcBoost : 0;
        const dirSign = diff === 0 ? 0 : diff > 0 ? 1 : -1;

        const translateY = diff * peekStepY + dirSign * handoffArc + entrySpread;
        const scale =
          absDiff < 0.04
            ? 1.035
            : Math.max(0.81, 1.015 - absDiff * (isCompact ? 0.055 : 0.06));
        const opacity = clamp(1 - absDiff * 0.22, 0.26, 1) * entryOpacity;
        const zIndex = Math.round(50 - absDiff * 10);
        const rotateX = isCompact ? 0 : clamp(-diff * 3.2, -8, 8);

        cardEl.style.zIndex = String(zIndex);
        cardEl.style.opacity = opacity.toFixed(4);
        cardEl.style.transform = isCompact
          ? `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`
          : `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(4)}) rotateX(${rotateX.toFixed(2)}deg)`;

        // Bordure cyan lumineuse progressive sur la carte dominante
        const borderEl = activeBorderRefs.current[idx];
        if (borderEl) {
          const glowOpacity = clamp(1 - absDiff * 1.45, 0, 1);
          borderEl.style.opacity = glowOpacity.toFixed(3);
        }

        // Icône animée fluide sur la carte mise en avant
        const iconEl = iconRefs.current[idx];
        if (iconEl) {
          const iconBreath = absDiff < 0.35 ? 1 + Math.sin(timeSec * 3.2) * 0.06 : 1;
          const iconLift = absDiff < 0.35 ? Math.sin(timeSec * 3.2) * -2.5 : 0;
          iconEl.style.transform = `translate3d(0, ${iconLift.toFixed(2)}px, 0) scale(${iconBreath.toFixed(4)})`;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', computeScrollTarget);
      window.removeEventListener('resize', computeScrollTarget);
    };
  }, []);

  const scrollToStep = (stepIndex: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const docTop = window.scrollY + rect.top;
    const startThreshold = window.innerHeight * 0.72;
    const scrollStart = docTop - startThreshold;
    const scrollEnd = docTop + track.offsetHeight - window.innerHeight;
    const targetNorm =
      ENTRY_END + (stepIndex / (TECH_STACK.length - 1)) * (1 - ENTRY_END);
    const targetY = scrollStart + (scrollEnd - scrollStart) * targetNorm;

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: 'smooth',
    });
  };

  const activeTech = TECH_STACK[activeIndex];

  return (
    <section
      id="technologies"
      className="relative bg-[#020617]/80 border-b border-[#0066FF]/25"
    >
      {/* Piste de défilement dédiée à l'expérience Sticky (zéro overflow-hidden sur cet ancêtre) */}
      <div
        ref={trackRef}
        className="relative h-[340vh] sm:h-[380vh] lg:h-[420vh]"
      >
        {/* Scène Sticky verrouillée pendant la traversée des 5 cartes */}
        <div className="sticky top-0 h-[100dvh] min-h-[580px] w-full flex flex-col justify-center overflow-hidden pt-16 pb-4 sm:pt-24 sm:pb-10">
          {/* Halos technologiques bleu nuit, bleu électrique et cyan */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full bg-[#0066FF]/12 blur-[140px]" />
            <div className="absolute top-1/2 right-[12%] -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#00D4FF]/10 blur-[110px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1280px] w-full px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 lg:gap-12 items-center">
              {/* ============================================================
                  COLONNE ÉDITORIALE & INDICATEUR DE PROGRESSION (01 / 05)
                 ============================================================ */}
              <div className="lg:col-span-5 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#030712] border border-[#00D4FF]/45 shadow-[0_0_24px_rgba(0,212,255,0.2)]">
                  <Layers className="w-3.5 h-3.5 text-[#00D4FF]" aria-hidden="true" />
                  <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-white uppercase">
                    ZENIN DIGITAL — STACK FLOW
                  </span>
                </div>

                <p className="mt-2 sm:mt-4 text-xs sm:text-sm font-semibold tracking-wide text-[#00D4FF]">
                  Technologies &amp; Standards
                </p>

                <h2 className="mt-1 sm:mt-2 text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white [text-wrap:balance]">
                  La technologie au service de votre croissance.
                </h2>

                <p className="mt-1.5 sm:mt-4 text-xs sm:text-sm lg:text-base text-[#B9C7DC] leading-relaxed max-w-xl">
                  Des choix techniques sobres, ouverts et éprouvés pour assurer rapidité, sécurité et pérennité à votre site web.
                </p>

                {/* Indicateur de progression synchronisé au scroll : 01 / 05 */}
                <div className="mt-3 sm:mt-8 rounded-2xl bg-[#030712]/95 border border-[#0066FF]/35 p-3 sm:p-5 shadow-[0_12px_36px_rgba(0,102,255,0.16)]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#B9C7DC]">
                        Carte mise en avant
                      </div>
                      <div className="mt-0.5 text-sm sm:text-base font-bold text-white truncate">
                        {activeTech.name}
                      </div>
                    </div>

                    <div className="font-mono text-xl sm:text-2xl font-extrabold tabular-nums">
                      <span className="text-[#00D4FF] drop-shadow-[0_0_10px_rgba(0,212,255,0.65)]">
                        {activeTech.number}
                      </span>
                      <span className="text-[#B9C7DC]/60"> / 05</span>
                    </div>
                  </div>

                  {/* Cinq indicateurs lumineux cliquables */}
                  <div
                    className="mt-3 grid grid-cols-5 gap-2"
                    role="list"
                    aria-label="Progression dans la pile technologique"
                  >
                    {TECH_STACK.map((tech, idx) => {
                      const isActive = idx === activeIndex;
                      const isPassed = idx < activeIndex;
                      return (
                        <button
                          key={tech.number}
                          type="button"
                          onClick={() => scrollToStep(idx)}
                          aria-label={`Aller à l'étape ${tech.number} : ${tech.name}`}
                          aria-current={isActive ? 'step' : undefined}
                          className="group text-left focus:outline-none py-1"
                        >
                          <div
                            className={`h-2 w-full rounded-full transition-colors duration-200 ${
                              isActive
                                ? 'bg-gradient-to-r from-[#0066FF] to-[#00D4FF] shadow-[0_0_14px_rgba(0,212,255,0.85)]'
                                : isPassed
                                  ? 'bg-[#0066FF]/80'
                                  : 'bg-[#020617] border border-[#0066FF]/35 group-hover:border-[#00D4FF]/65'
                            }`}
                          />
                          <div
                            className={`mt-1.5 font-mono text-[10px] font-bold tabular-nums transition-colors ${
                              isActive
                                ? 'text-[#00D4FF]'
                                : isPassed
                                  ? 'text-white/75'
                                  : 'text-[#B9C7DC]/55 group-hover:text-[#B9C7DC]'
                            }`}
                          >
                            {tech.number}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Barre continue haute fréquence pilotée directement en JS */}
                  <div className="mt-2.5 h-1 w-full rounded-full bg-[#020617] overflow-hidden">
                    <div
                      ref={progressBarRef}
                      className="h-full w-full origin-left bg-gradient-to-r from-[#0066FF] to-[#00D4FF] will-change-transform"
                      style={{ transform: 'scaleX(0)' }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-[#B9C7DC]">
                    <span className="inline-flex items-center gap-1.5">
                      <ChevronDown className="w-3.5 h-3.5 text-[#00D4FF]" aria-hidden="true" />
                      <span>Défilez pour naviguer (01 ↔ 05)</span>
                    </span>
                    <span
                      ref={progressPctRef}
                      className="font-mono text-[#00D4FF]/90 tabular-nums"
                    >
                      0%
                    </span>
                  </div>
                </div>
              </div>

              {/* ============================================================
                  PILE DE 5 CARTES GPU 120–144 FPS PILOTÉE EN JAVASCRIPT
                 ============================================================ */}
              <div className="lg:col-span-7 relative">
                <div
                  className="relative mx-auto w-full max-w-[580px] h-[250px] sm:h-[360px] lg:h-[420px] flex items-center justify-center"
                  style={{ perspective: '1200px' }}
                >
                  {/* Halo bleu électrique centré derrière la carte dominante */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute w-[88%] h-[220px] sm:h-[260px] rounded-3xl bg-gradient-to-r from-[#0066FF]/28 via-[#00D4FF]/22 to-[#0066FF]/28 blur-3xl"
                  />

                  {/* Particules lumineuses animées à 120–144 FPS en JS */}
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                    {STACK_PARTICLES.map((p, idx) => (
                      <span
                        key={idx}
                        ref={(el) => {
                          particleRefs.current[idx] = el;
                        }}
                        className="absolute rounded-full bg-[#00D4FF] shadow-[0_0_12px_rgba(0,212,255,0.9)] will-change-transform"
                        style={{
                          left: p.left,
                          top: p.top,
                          width: `${p.size}px`,
                          height: `${p.size}px`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Les 5 cartes physiquement empilées (zéro backdrop-blur lourd -> 120-144fps GPU) */}
                  {TECH_STACK.map((tech, idx) => {
                    const Icon = tech.icon;
                    const isActive = idx === activeIndex;

                    return (
                      <div
                        key={tech.name}
                        ref={(el) => {
                          cardRefs.current[idx] = el;
                        }}
                        onClick={() => scrollToStep(idx)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            scrollToStep(idx);
                          }
                        }}
                        aria-label={`Étape ${tech.number} — ${tech.name} (${tech.role})`}
                        className="absolute w-full cursor-pointer will-change-transform focus:outline-none"
                      >
                        <div className="relative rounded-2xl bg-[#030712] border border-[#0066FF]/40 shadow-[0_14px_38px_rgba(2,6,23,0.85)]">
                          {/* Couche de bordure cyan lumineuse & halo électrique pilotée en JS */}
                          <div
                            ref={(el) => {
                              activeBorderRefs.current[idx] = el;
                            }}
                            aria-hidden="true"
                            className="pointer-events-none absolute -inset-[1.5px] rounded-2xl border-2 border-[#00D4FF] shadow-[0_0_46px_rgba(0,102,255,0.52)]"
                            style={{ opacity: idx === 0 ? 1 : 0 }}
                          />

                          <div className="relative rounded-2xl bg-gradient-to-b from-[#061533]/95 via-[#020617] to-[#030712] p-4 sm:p-7 lg:p-8">
                            {/* En-tête carte : Icône animée + Catégorie + Numéro 01..05 */}
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                <div
                                  ref={(el) => {
                                    iconRefs.current[idx] = el;
                                  }}
                                  className={`inline-flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-2xl border shrink-0 will-change-transform ${
                                    isActive
                                      ? 'bg-gradient-to-br from-[#0066FF]/30 to-[#00D4FF]/22 border-[#00D4FF]/75 text-[#00D4FF] shadow-[0_0_24px_rgba(0,212,255,0.4)]'
                                      : 'bg-[#020617] border-[#0066FF]/40 text-[#00D4FF]/75'
                                  }`}
                                >
                                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                                </div>

                                <div className="min-w-0">
                                  <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#00D4FF] truncate">
                                    {tech.role}
                                  </div>
                                  <h3 className="mt-0.5 text-lg sm:text-2xl font-extrabold text-white tracking-tight truncate">
                                    {tech.name}
                                  </h3>
                                </div>
                              </div>

                              <span
                                className={`font-mono text-xl sm:text-3xl font-extrabold tabular-nums shrink-0 ${
                                  isActive
                                    ? 'text-[#00D4FF] drop-shadow-[0_0_12px_rgba(0,212,255,0.75)]'
                                    : 'text-[#00D4FF]/50'
                                }`}
                              >
                                {tech.number}
                              </span>
                            </div>

                            {/* Description conservée intégralement */}
                            <p
                              className={`mt-4 sm:mt-5 text-sm sm:text-base lg:text-[17px] leading-relaxed ${
                                isActive ? 'text-[#E2ECFA]' : 'text-[#B9C7DC]/80'
                              }`}
                            >
                              {tech.description}
                            </p>

                            {/* Pied de carte */}
                            <div className="mt-4 sm:mt-6 pt-3.5 border-t border-[#0066FF]/25 flex items-center justify-between text-[11px]">
                              <span className="font-mono font-semibold text-[#00D4FF]/90">
                                {tech.number} — {tech.name.toUpperCase()}
                              </span>
                              <span className="text-[#B9C7DC]/80">
                                {isActive ? 'Standard actif' : 'En pile'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
