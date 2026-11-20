import { motion, useScroll, useTransform } from 'motion/react';
import { siteConfig } from '../config/siteConfig';

/**
 * Arrière-plan permanent sur toutes les pages et sections.
 * Utilise l'asset local /images/hero-bg.png (identique à l'URL fournie) + URL de secours,
 * enrichi d'un léger parallaxe au défilement et d'un voile de lisibilité contrasté.
 */
export function PersistentBackground() {
  const { scrollYProgress } = useScroll();
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '-3%']);
  const orbTopY = useTransform(scrollYProgress, [0, 1], ['0px', '-140px']);
  const orbBottomY = useTransform(scrollYProgress, [0, 1], ['0px', '120px']);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020817]"
    >
      {/* Image de fond permanente avec parallaxe subtil */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{
          scale: bgScale,
          y: bgY,
          backgroundImage: `url('${siteConfig.assets.heroBg}'), url('${siteConfig.assets.heroBgExternal}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Voile de contraste équilibré pour préserver la lisibilité WCAG sur chaque section */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020817]/45 via-[#020817]/60 to-[#020817]/75" />

      {/* Halos dynamiques réactifs au scroll */}
      <motion.div
        style={{ y: orbTopY }}
        animate={{ opacity: [0.22, 0.36, 0.22], scale: [1, 1.06, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full bg-[#006BFF]/25 blur-[120px]"
      />
      <motion.div
        style={{ y: orbBottomY }}
        animate={{ opacity: [0.16, 0.28, 0.16], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-140px] -left-24 w-[480px] h-[480px] rounded-full bg-[#00CFFF]/20 blur-[130px]"
      />
    </div>
  );
}
