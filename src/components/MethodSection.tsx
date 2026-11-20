import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code,
  Orbit,
  Palette,
  Pause,
  Play,
  Rocket,
  SearchCheck,
} from 'lucide-react';
import { ScrollReveal } from './MotionPrimitives';

interface MethodStep {
  number: string;
  title: string;
  headline: string;
  description: string;
  icon: typeof SearchCheck;
}

const METHOD_STEPS: MethodStep[] = [
  {
    number: '01',
    title: 'Diagnostic',
    headline: 'Analyse de vos besoins et de votre activité.',
    description:
      'Cadrage des objectifs, de votre cible client, de votre arborescence et des prérequis techniques.',
    icon: SearchCheck,
  },
  {
    number: '02',
    title: 'Design',
    headline: "Conception d'une interface adaptée à votre marque.",
    description:
      'Maquettage sur mesure orienté lisibilité, hiérarchie de l’information et conversion sur mobile comme sur desktop.',
    icon: Palette,
  },
  {
    number: '03',
    title: 'Développement',
    headline: 'Création avec une stack moderne et optimisée.',
    description:
      'Intégration propre en TypeScript et architecture légère, balisage SEO sémantique et validation des formulaires.',
    icon: Code,
  },
  {
    number: '04',
    title: 'Livraison',
    headline: 'Mise en ligne et remise de votre code et domaine.',
    description:
      'Déploiement sur votre infrastructure, vérifications techniques finales et transfert complet de vos accès.',
    icon: Rocket,
  },
];

const SPIN_DURATION_SEC = 1.0; // 1 seconde exacte (inchangé)
const SPIN_TOTAL_RADIANS = Math.PI * 2 * 2.25; // 2,25 tours fluides en 1s (zéro effet stroboscopique, rotation ultra visible)
const ORBIT_REVOLUTION_SPEED_RAD_PER_SEC = 1.15; // Rotation continue et bien visible des autres étapes en orbite
const PRESENTATION_DURATION_SEC = 7.0; // 7 secondes exactes (inchangé)

type OrbitPhase = 'spinning' | 'presenting';

const PARTICLE_COUNT = 6;
const PARTICLE_TRAIL_STEPS = 3;
const MOBILE_PARTICLE_COUNT = 4;

export function MethodSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const arenaRef = useRef<HTMLDivElement>(null);

  const [isInView, setIsInView] = useState(false);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [isManualPaused, setIsManualPaused] = useState(false);
  const [arenaSize, setArenaSize] = useState({ width: 960, height: 640 });

  const [phase, setPhase] = useState<OrbitPhase>('presenting');
  const [activeIndex, setActiveIndex] = useState(0);

  // Références DOM pour piloter l'animation orbitale directement en JavaScript à 60fps
  const desktopCardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileNodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const desktopSweepRef = useRef<HTMLDivElement | null>(null);
  const mobileSweepRef = useRef<HTMLDivElement | null>(null);
  const desktopWireRef = useRef<SVGEllipseElement | null>(null);
  const desktopParticleRefs = useRef<(SVGCircleElement | null)[][]>(
    Array.from({ length: PARTICLE_COUNT }, () => [])
  );
  const desktopCardTrailRefs = useRef<(SVGCircleElement | null)[][]>(
    Array.from({ length: METHOD_STEPS.length }, () => [])
  );
  const mobileWireRef = useRef<SVGCircleElement | null>(null);
  const mobileParticleRefs = useRef<(SVGCircleElement | null)[][]>(
    Array.from({ length: MOBILE_PARTICLE_COUNT }, () => [])
  );

  const arenaMetricsRef = useRef({
    width: 960,
    height: 640,
    rx: 345,
    ry: 225,
    cx: 480,
    cy: 320,
  });

  // État physique mutable piloté en JavaScript
  const simRef = useRef({
    phase: 'presenting' as OrbitPhase,
    hasStartedCycle: false,
    activeIndex: 0,
    nextIndex: 0,
    orbitAngle: -Math.PI / 2,
    spinStartAngle: -Math.PI / 2,
    spinElapsed: 0,
    presentElapsed: 0,
  });

  // Mesure exacte de l'arène orbitale (tablette & desktop)
  useEffect(() => {
    const arena = arenaRef.current;
    if (!arena) return;

    const updateSize = () => {
      const rect = arena.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const isCompact = rect.width < 880;
        const satHalfW = isCompact ? 82 : 105;
        const satHalfH = isCompact ? 58 : 62;
        const rx = Math.min(350, Math.max(246, rect.width / 2 - satHalfW - 10));
        const ry = Math.min(232, Math.max(198, rect.height / 2 - satHalfH - 10));
        arenaMetricsRef.current = {
          width: rect.width,
          height: rect.height,
          rx,
          ry,
          cx: rect.width / 2,
          cy: rect.height / 2,
        };
        setArenaSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    if (typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver(updateSize);
    ro.observe(arena);
    return () => ro.disconnect();
  }, []);

  // Détection de visibilité dans le viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setIsInView(entries.some((entry) => entry.isIntersecting));
      },
      { threshold: 0.18 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Déclenchement initial de la roulette dès l'entrée dans le champ de vision
  useEffect(() => {
    if (!isInView) return;
    if (!simRef.current.hasStartedCycle) {
      simRef.current.hasStartedCycle = true;
      simRef.current.phase = 'spinning';
      simRef.current.nextIndex = 0;
      simRef.current.spinStartAngle = simRef.current.orbitAngle;
      simRef.current.spinElapsed = 0;
      simRef.current.presentElapsed = 0;
      setPhase('spinning');
    }
  }, [isInView]);

  // Boucle JavaScript 60fps : anime cartes, faisceau rotatif, traînées et particules
  useEffect(() => {
    const applyPositions = (blurAmount: number) => {
      const sim = simRef.current;
      const spinning = sim.phase === 'spinning';
      const { rx, ry, cx, cy } = arenaMetricsRef.current;
      const angleDeg = (sim.orbitAngle * 180) / Math.PI;

      // 0. Faisceaux rotatifs centraux (Desktop & Mobile) pour rendre le sens et la vitesse ultra visibles
      if (desktopSweepRef.current) {
        desktopSweepRef.current.style.transform = `rotate(${angleDeg.toFixed(2)}deg)`;
        desktopSweepRef.current.style.opacity = spinning ? '0.95' : '0.42';
      }
      if (mobileSweepRef.current) {
        mobileSweepRef.current.style.transform = `rotate(${angleDeg.toFixed(2)}deg)`;
        mobileSweepRef.current.style.opacity = spinning ? '0.95' : '0.48';
      }

      // 1. Positionnement JS direct des cartes satellites + traînées lumineuses derrière chaque carte
      let satelliteSlot = 0;
      const satelliteTotal = METHOD_STEPS.length - 1;

      for (let idx = 0; idx < METHOD_STEPS.length; idx++) {
        const desktopEl = desktopCardRefs.current[idx];
        const mobileEl = mobileNodeRefs.current[idx];

        const isSatellite = spinning || idx !== sim.activeIndex;
        let angle = 0;

        if (spinning) {
          angle = sim.orbitAngle + (idx * Math.PI * 2) / METHOD_STEPS.length;
        } else if (isSatellite) {
          angle = sim.orbitAngle + (satelliteSlot * Math.PI * 2) / satelliteTotal;
          satelliteSlot++;
        }

        if (desktopEl && isSatellite) {
          const x = Math.cos(angle) * rx;
          const y = Math.sin(angle) * ry;
          const tilt = spinning ? Math.sin(angle * 2) * 3.5 : 0;
          desktopEl.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${tilt.toFixed(2)}deg)`;
        }

        // Traînées lumineuses derrière chaque carte pendant la rotation rapide
        for (let t = 0; t < 3; t++) {
          const trailDot = desktopCardTrailRefs.current[idx]?.[t];
          if (trailDot) {
            if (spinning) {
              const tAngle = angle - (t + 1) * 0.14;
              trailDot.setAttribute('cx', (cx + Math.cos(tAngle) * rx).toFixed(2));
              trailDot.setAttribute('cy', (cy + Math.sin(tAngle) * ry).toFixed(2));
              trailDot.style.opacity = String(0.75 - t * 0.22);
            } else {
              trailDot.style.opacity = '0';
            }
          }
        }

        if (mobileEl && isSatellite) {
          const mx = Math.cos(angle) * 102;
          const my = Math.sin(angle) * 102;
          mobileEl.style.transform = `translate3d(${mx.toFixed(2)}px, ${my.toFixed(2)}px, 0)`;
        }
      }

      // 2. Animation JS du fil lumineux et des comètes circulantes (Desktop SVG)
      if (desktopWireRef.current) {
        desktopWireRef.current.style.strokeDashoffset = `${-(sim.orbitAngle * 140)}`;
      }
      for (let p = 0; p < PARTICLE_COUNT; p++) {
        const pAngle =
          sim.orbitAngle * (spinning ? 1.05 : 1.4) + (p * Math.PI * 2) / PARTICLE_COUNT;

        for (let t = 0; t < PARTICLE_TRAIL_STEPS; t++) {
          const node = desktopParticleRefs.current[p]?.[t];
          if (!node) continue;
          const trailAngle = pAngle - t * (spinning ? 0.09 : 0.06);
          const px = cx + Math.cos(trailAngle) * rx;
          const py = cy + Math.sin(trailAngle) * ry;
          const radius = (spinning ? 6.2 : 4.4) - t * 1.1;
          node.setAttribute('cx', px.toFixed(2));
          node.setAttribute('cy', py.toFixed(2));
          node.setAttribute('r', Math.max(1.5, radius).toFixed(2));
          node.style.opacity = String(Math.max(0.2, 0.95 - t * 0.3));
        }
      }

      // 3. Animation JS du fil lumineux et des comètes circulantes (Mobile SVG)
      if (mobileWireRef.current) {
        mobileWireRef.current.style.strokeDashoffset = `${-(sim.orbitAngle * 68)}`;
      }
      for (let p = 0; p < MOBILE_PARTICLE_COUNT; p++) {
        const pAngle =
          sim.orbitAngle * (spinning ? 1.05 : 1.4) + (p * Math.PI * 2) / MOBILE_PARTICLE_COUNT;
        for (let t = 0; t < 2; t++) {
          const mParticle = mobileParticleRefs.current[p]?.[t];
          if (!mParticle) continue;
          const tAngle = pAngle - t * 0.1;
          mParticle.setAttribute('cx', (132 + Math.cos(tAngle) * 102).toFixed(2));
          mParticle.setAttribute('cy', (132 + Math.sin(tAngle) * 102).toFixed(2));
          mParticle.setAttribute('r', t === 0 ? (spinning ? '5' : '3.8') : '2.2');
          mParticle.style.opacity = t === 0 ? '0.95' : '0.45';
        }
      }
    };

    // Positionnement immédiat dès le premier rendu
    applyPositions(0);
    if (!isInView) return;

    const paused = isHoverPaused || isManualPaused;
    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const sim = simRef.current;
      let blurAmount = 0;

      if (!paused) {
        if (sim.phase === 'spinning') {
          sim.spinElapsed += dt;
          const t = Math.min(1, sim.spinElapsed / SPIN_DURATION_SEC);
          // Courbe ease-in-out cubique : accélération franche puis freinage net à l'arrêt
          const eased =
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          sim.orbitAngle = sim.spinStartAngle + SPIN_TOTAL_RADIANS * eased;
          blurAmount = Math.sin(t * Math.PI) * 1.35;

          if (sim.spinElapsed >= SPIN_DURATION_SEC) {
            sim.phase = 'presenting';
            sim.activeIndex = sim.nextIndex;
            sim.spinElapsed = 0;
            sim.presentElapsed = 0;
            blurAmount = 0;
            setActiveIndex(sim.activeIndex);
            setPhase('presenting');
          }
        } else {
          // PHASE 3 : 7 secondes de présentation pendant que les autres étapes tournent clairement en orbite
          sim.orbitAngle += ORBIT_REVOLUTION_SPEED_RAD_PER_SEC * dt;
          sim.presentElapsed += dt;

          if (sim.presentElapsed >= PRESENTATION_DURATION_SEC) {
            // PHASE 4 : Retour en orbite et accélération visible vers l'étape suivante
            sim.phase = 'spinning';
            sim.nextIndex = (sim.activeIndex + 1) % METHOD_STEPS.length;
            sim.spinStartAngle = sim.orbitAngle;
            sim.spinElapsed = 0;
            sim.presentElapsed = 0;
            setPhase('spinning');
          }
        }
      }

      applyPositions(blurAmount);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, isHoverPaused, isManualPaused, phase, activeIndex, arenaSize]);

  const selectStepManually = (index: number) => {
    const sim = simRef.current;
    sim.hasStartedCycle = true;
    sim.phase = 'presenting';
    sim.activeIndex = index;
    sim.nextIndex = (index + 1) % METHOD_STEPS.length;
    sim.spinElapsed = 0;
    sim.presentElapsed = 0;
    setActiveIndex(index);
    setPhase('presenting');
  };

  const activeStep = METHOD_STEPS[activeIndex];
  const ActiveIcon = activeStep.icon;
  const isSpinning = phase === 'spinning';
  const isPaused = isHoverPaused || isManualPaused;

  const { width: arenaW, height: arenaH, rx: orbitRx, ry: orbitRy, cx: arenaCX, cy: arenaCY } =
    arenaMetricsRef.current;

  return (
    <section
      ref={sectionRef}
      id="methode"
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') setIsHoverPaused(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') setIsHoverPaused(false);
      }}
      className="relative overflow-hidden py-16 sm:py-24 bg-[#020617]/80 border-b border-[#0066FF]/25"
    >
      {/* Halos technologiques bleu nuit, bleu électrique et cyan */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] rounded-full bg-[#0066FF]/12 blur-[140px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full bg-[#00D4FF]/10 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <ScrollReveal className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#030D24]/90 border border-[#00D4FF]/45 shadow-[0_0_24px_rgba(0,212,255,0.2)]">
            <Orbit className="w-4 h-4 text-[#00D4FF]" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-wider text-white uppercase">
              ZENIN DIGITAL PROCESS ORBIT
            </span>
          </div>

          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-white [text-wrap:balance]">
            Votre site professionnel en{' '}
            <span className="bg-gradient-to-r from-[#00D4FF] to-[#0066FF] bg-clip-text text-transparent">
              5 jours
            </span>
            .
          </h2>
          <p className="mt-3.5 text-sm sm:text-base lg:text-lg text-[#B9C7DC] leading-relaxed">
            Un parcours orbital en quatre étapes synchronisées, du cadrage stratégique à la remise complète de vos accès.
          </p>
        </ScrollReveal>

        {/* ============================================================
            1. ARÈNE ORBITALE DESKTOP & TABLETTE (md et +)
           ============================================================ */}
        <div className="hidden md:block mt-12">
          <div
            ref={arenaRef}
            className="relative mx-auto w-full max-w-[960px] h-[600px] lg:h-[640px] flex items-center justify-center"
          >
            {/* Faisceau radar rotatif synchronisé en JavaScript */}
            <div
              ref={desktopSweepRef}
              aria-hidden="true"
              className="pointer-events-none absolute w-[520px] h-[520px] lg:w-[600px] lg:h-[600px] rounded-full will-change-transform transition-opacity duration-300"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0deg, rgba(0, 212, 255, 0.24) 45deg, rgba(0, 102, 255, 0.12) 105deg, transparent 150deg, transparent 180deg, rgba(0, 212, 255, 0.16) 225deg, rgba(0, 102, 255, 0.08) 285deg, transparent 330deg)',
                maskImage: 'radial-gradient(circle, transparent 18%, black 42%, transparent 72%)',
                WebkitMaskImage:
                  'radial-gradient(circle, transparent 18%, black 42%, transparent 72%)',
              }}
            />

            {/* Fil lumineux orbital continu + traînées & comètes circulantes animées en JS */}
            <svg
              viewBox={`0 0 ${arenaW} ${arenaH}`}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient id="zeninOrbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#0066FF" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.95" />
                </linearGradient>
                <filter id="zeninOrbitGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Anneau orbital principal */}
              <ellipse
                cx={arenaCX}
                cy={arenaCY}
                rx={orbitRx}
                ry={orbitRy}
                fill="none"
                stroke="#0066FF"
                strokeOpacity="0.26"
                strokeWidth="1.5"
              />

              {/* Anneau secondaire discret */}
              <ellipse
                cx={arenaCX}
                cy={arenaCY}
                rx={orbitRx + 22}
                ry={orbitRy + 16}
                fill="none"
                stroke="#00D4FF"
                strokeOpacity="0.14"
                strokeWidth="1"
                strokeDasharray="6 10"
              />

              {/* Fil lumineux animé continu */}
              <ellipse
                ref={desktopWireRef}
                cx={arenaCX}
                cy={arenaCY}
                rx={orbitRx}
                ry={orbitRy}
                fill="none"
                stroke="url(#zeninOrbitGrad)"
                strokeWidth={isSpinning ? '3.5' : '2.2'}
                strokeDasharray={isSpinning ? '100 50' : '110 70'}
                filter="url(#zeninOrbitGlow)"
              />

              {/* Traînées lumineuses derrière chaque carte pendant la phase rapide */}
              {METHOD_STEPS.map((step, sIdx) =>
                [0, 1, 2].map((tIdx) => (
                  <circle
                    key={`card-trail-${step.number}-${tIdx}`}
                    ref={(el) => {
                      desktopCardTrailRefs.current[sIdx][tIdx] = el;
                    }}
                    cx={arenaCX}
                    cy={arenaCY}
                    r={6 - tIdx * 1.4}
                    fill={tIdx === 0 ? '#00D4FF' : '#0066FF'}
                    opacity={0}
                    filter="url(#zeninOrbitGlow)"
                  />
                ))
              )}

              {/* Comètes lumineuses + sillages pilotées en JS */}
              {Array.from({ length: PARTICLE_COUNT }).map((_, pIdx) =>
                Array.from({ length: PARTICLE_TRAIL_STEPS }).map((__, tIdx) => (
                  <circle
                    key={`particle-${pIdx}-${tIdx}`}
                    ref={(el) => {
                      desktopParticleRefs.current[pIdx][tIdx] = el;
                    }}
                    cx={arenaCX}
                    cy={arenaCY}
                    r={3.5}
                    fill={tIdx === 0 ? '#00D4FF' : '#0066FF'}
                    opacity={0.9}
                    filter={tIdx === 0 ? 'url(#zeninOrbitGlow)' : undefined}
                  />
                ))
              )}
            </svg>

            {/* Cercle de vitesse centrale pendant le tour de roulette (1s) */}
            <AnimatePresence>
              {isSpinning && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.16 }}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-[210px] h-[210px] rounded-full border border-[#00D4FF]/45 bg-[#020617]/95 shadow-[0_0_55px_rgba(0,212,255,0.35)] flex flex-col items-center justify-center gap-2">
                    <Orbit className="w-7 h-7 text-[#00D4FF] animate-spin" aria-hidden="true" />
                    <span className="text-[11px] font-mono font-bold tracking-widest text-[#00D4FF]">
                      ROTATION ORBITALE
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cartes satellites tournant réellement autour du cercle en JavaScript */}
            {METHOD_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isVisibleInOrbit = isSpinning || idx !== activeIndex;
              if (!isVisibleInOrbit) return null;

              return (
                <button
                  key={step.number}
                  ref={(el) => {
                    desktopCardRefs.current[idx] = el;
                  }}
                  type="button"
                  onClick={() => selectStepManually(idx)}
                  aria-label={`Afficher l'étape ${step.number} : ${step.title}`}
                  className={`group absolute z-20 w-[164px] lg:w-[210px] text-left rounded-2xl border transition-[border-color,box-shadow,background-color] duration-200 p-3 lg:p-3.5 will-change-transform ${
                    isSpinning
                      ? 'bg-[#030B20] border-[#00D4FF]/80 shadow-[0_0_38px_rgba(0,212,255,0.45)]'
                      : 'bg-[#030B20]/95 border-[#0066FF]/40 hover:border-[#00D4FF] hover:bg-[#061838] hover:shadow-[0_0_28px_rgba(0,102,255,0.38)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="inline-flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-xl bg-[#020617] border border-[#0066FF]/45 group-hover:border-[#00D4FF] text-[#00D4FF] transition-transform duration-300 group-hover:scale-110 shrink-0">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <span className="font-mono text-xs font-bold text-[#00D4FF] tabular-nums">
                      {step.number}
                    </span>
                  </div>
                  <div className="mt-2 text-xs lg:text-sm font-bold text-white truncate">
                    {step.title}
                  </div>
                  <p className="mt-0.5 text-[11px] text-[#B9C7DC] line-clamp-2 leading-snug">
                    {step.headline}
                  </p>
                  <div className="mt-2 h-1 w-full rounded-full bg-[#020617] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isSpinning
                          ? 'w-full bg-gradient-to-r from-[#0066FF] to-[#00D4FF]'
                          : idx < activeIndex
                            ? 'w-full bg-[#0066FF]/75'
                            : 'w-1/4 bg-[#00D4FF]/35'
                      }`}
                    />
                  </div>
                </button>
              );
            })}

            {/* PHASE 2 & 3 : Grande carte centrale au premier plan (sans compte à rebours) */}
            <AnimatePresence mode="wait">
              {!isSpinning && (
                <motion.div
                  key={activeStep.number}
                  initial={{ opacity: 0, scale: 0.78, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: -8 }}
                  transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-30 w-[300px] lg:w-[390px]"
                >
                  <div
                    aria-hidden="true"
                    className="absolute -inset-3 rounded-3xl bg-gradient-to-b from-[#00D4FF]/25 via-[#0066FF]/22 to-[#00D4FF]/20 blur-2xl pointer-events-none"
                  />

                  <div className="relative rounded-2xl p-[1.5px] bg-gradient-to-b from-[#00D4FF] via-[#0066FF] to-[#00D4FF]/80 shadow-[0_0_50px_rgba(0,102,255,0.42)]">
                    <div className="rounded-[15px] bg-[#020617] p-5 lg:p-7">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <motion.div
                            initial={{ scale: 0.8, rotate: -8 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="inline-flex items-center justify-center w-11 h-11 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-br from-[#0066FF]/25 to-[#00D4FF]/20 border border-[#00D4FF]/60 text-[#00D4FF] shadow-[0_0_24px_rgba(0,212,255,0.35)] shrink-0"
                          >
                            <ActiveIcon className="w-5 h-5 lg:w-6 lg:h-6" aria-hidden="true" />
                          </motion.div>
                          <div>
                            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#00D4FF]">
                              Étape active
                            </div>
                            <h3 className="text-lg lg:text-2xl font-extrabold text-white tracking-tight">
                              {activeStep.title}
                            </h3>
                          </div>
                        </div>

                        <span className="font-mono text-2xl lg:text-3xl font-extrabold text-[#00D4FF] drop-shadow-[0_0_12px_rgba(0,212,255,0.75)] tabular-nums">
                          {activeStep.number}
                        </span>
                      </div>

                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.08 }}
                        className="mt-4 text-sm lg:text-base font-semibold text-white leading-snug"
                      >
                        {activeStep.headline}
                      </motion.p>

                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.18 }}
                        className="mt-2.5 text-xs lg:text-sm text-[#B9C7DC] leading-relaxed"
                      >
                        {activeStep.description}
                      </motion.p>

                      {/* Indicateur d'étape sans compte à rebours */}
                      <div className="mt-5 pt-4 border-t border-[#0066FF]/25 flex items-center justify-between gap-3">
                        <span className="text-[11px] font-medium text-[#B9C7DC]">
                          Étape {activeIndex + 1} sur {METHOD_STEPS.length}
                        </span>
                        <div className="flex items-center gap-1.5" aria-hidden="true">
                          {METHOD_STEPS.map((s, idx) => (
                            <span
                              key={s.number}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                idx === activeIndex
                                  ? 'w-7 bg-gradient-to-r from-[#0066FF] to-[#00D4FF] shadow-[0_0_10px_rgba(0,212,255,0.75)]'
                                  : idx < activeIndex
                                    ? 'w-3 bg-[#0066FF]/75'
                                    : 'w-2 bg-[#030D24] border border-[#0066FF]/40'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ============================================================
            2. VERSION MOBILE (< 768px) — ANNEAU ORBITAL ANIMÉ EN JS + CARTE ACTIVE
           ============================================================ */}
        <div className="md:hidden mt-10 space-y-6">
          <div className="relative mx-auto w-[264px] h-[264px] flex items-center justify-center">
            {/* Faisceau rotatif mobile synchronisé en JavaScript */}
            <div
              ref={mobileSweepRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-1 rounded-full will-change-transform transition-opacity duration-300"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0deg, rgba(0, 212, 255, 0.34) 55deg, rgba(0, 102, 255, 0.15) 120deg, transparent 170deg)',
                maskImage: 'radial-gradient(circle, transparent 34%, black 56%, transparent 94%)',
                WebkitMaskImage:
                  'radial-gradient(circle, transparent 34%, black 56%, transparent 94%)',
              }}
            />

            <svg
              viewBox="0 0 264 264"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 w-full h-full"
            >
              <circle
                cx="132"
                cy="132"
                r="102"
                fill="none"
                stroke="#0066FF"
                strokeOpacity="0.32"
                strokeWidth="1.5"
              />
              <circle
                ref={mobileWireRef}
                cx="132"
                cy="132"
                r="102"
                fill="none"
                stroke="#00D4FF"
                strokeWidth={isSpinning ? '3.5' : '2.2'}
                strokeDasharray="65 35"
              />
              {Array.from({ length: MOBILE_PARTICLE_COUNT }).map((_, pIdx) =>
                [0, 1].map((tIdx) => (
                  <circle
                    key={`m-particle-${pIdx}-${tIdx}`}
                    ref={(el) => {
                      mobileParticleRefs.current[pIdx][tIdx] = el;
                    }}
                    cx="132"
                    cy="30"
                    r={tIdx === 0 ? 4 : 2.2}
                    fill={tIdx === 0 ? '#00D4FF' : '#0066FF'}
                  />
                ))
              )}
            </svg>

            {/* Les autres étapes tournent réellement en orbite autour de l'anneau mobile */}
            {METHOD_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isVisibleInOrbit = isSpinning || idx !== activeIndex;
              if (!isVisibleInOrbit) return null;

              return (
                <button
                  key={step.number}
                  ref={(el) => {
                    mobileNodeRefs.current[idx] = el;
                  }}
                  type="button"
                  onClick={() => selectStepManually(idx)}
                  aria-label={`Étape ${step.number} : ${step.title}`}
                  className={`absolute w-12 h-12 rounded-2xl flex flex-col items-center justify-center border transition-colors will-change-transform ${
                    isSpinning
                      ? 'bg-[#030B20]/95 border-[#00D4FF]/80 text-[#00D4FF] shadow-[0_0_24px_rgba(0,212,255,0.55)]'
                      : 'bg-[#030B20]/95 border-[#0066FF]/55 text-[#00D4FF]'
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span className="text-[9px] font-mono font-bold leading-none mt-0.5">
                    {step.number}
                  </span>
                </button>
              );
            })}

            {/* Cœur central mettant en valeur l'étape active pendant que les autres orbitent */}
            <div className="relative z-10 w-24 h-24 rounded-full bg-[#020617]/95 border border-[#00D4FF]/65 shadow-[0_0_32px_rgba(0,102,255,0.45)] flex flex-col items-center justify-center text-center px-2">
              {isSpinning ? (
                <Orbit className="w-6 h-6 text-[#00D4FF] animate-spin" aria-hidden="true" />
              ) : (
                <>
                  <span className="font-mono text-xl font-extrabold text-[#00D4FF] tabular-nums">
                    {activeStep.number}
                  </span>
                  <span className="text-[11px] font-bold text-white truncate max-w-full">
                    {activeStep.title}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Carte active pleine largeur parfaitement lisible (sans compte à rebours) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isSpinning ? 'mobile-spin' : activeStep.number}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl p-[1.5px] bg-gradient-to-b from-[#00D4FF] via-[#0066FF] to-[#00D4FF]/60 shadow-[0_0_32px_rgba(0,102,255,0.3)]"
            >
              <div className="rounded-[15px] bg-[#020617]/95 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#030D24] border border-[#00D4FF]/50 text-[#00D4FF] shrink-0">
                      <ActiveIcon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#00D4FF]">
                        Étape {activeStep.number}
                      </div>
                      <h3 className="text-xl font-bold text-white">{activeStep.title}</h3>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#00D4FF] tabular-nums">
                    {activeIndex + 1} / {METHOD_STEPS.length}
                  </span>
                </div>

                <p className="mt-4 text-sm font-semibold text-white leading-snug">
                  {activeStep.headline}
                </p>
                <p className="mt-2 text-sm text-[#B9C7DC] leading-relaxed">
                  {activeStep.description}
                </p>

                <div className="mt-4 flex items-center gap-1.5" aria-hidden="true">
                  {METHOD_STEPS.map((s, idx) => (
                    <span
                      key={s.number}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === activeIndex
                          ? 'flex-1 bg-gradient-to-r from-[#0066FF] to-[#00D4FF]'
                          : idx < activeIndex
                            ? 'w-6 bg-[#0066FF]/75'
                            : 'w-4 bg-[#030D24] border border-[#0066FF]/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ============================================================
            3. CONTRÔLES MANUELS & INDICATEUR DES 4 ÉTAPES (TOUS ÉCRANS)
           ============================================================ */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div
            role="tablist"
            aria-label="Consulter manuellement les étapes de la méthode"
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {METHOD_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isCurrent = idx === activeIndex && !isSpinning;
              return (
                <button
                  key={step.number}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  onClick={() => selectStepManually(idx)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap min-h-[42px] ${
                    isCurrent
                      ? 'bg-gradient-to-r from-[#0066FF] to-[#00D4FF] text-white shadow-[0_0_20px_rgba(0,139,255,0.45)]'
                      : 'bg-[#030B20]/90 text-[#B9C7DC] border border-[#0066FF]/35 hover:text-white hover:border-[#00D4FF]/65'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-white' : 'text-[#00D4FF]'}`}
                    aria-hidden="true"
                  />
                  <span className="font-mono tabular-nums">{step.number}</span>
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setIsManualPaused((prev) => !prev)}
            aria-label={isPaused ? 'Reprendre le cycle orbital' : 'Mettre le cycle orbital en pause'}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-[#B9C7DC] hover:text-white bg-[#030B20]/90 border border-[#0066FF]/35 hover:border-[#00D4FF]/65 transition-colors min-h-[42px]"
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 text-[#00D4FF]" aria-hidden="true" />
                <span>Reprendre</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-[#00D4FF]" aria-hidden="true" />
                <span>Pause</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
