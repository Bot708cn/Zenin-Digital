import { Gauge, Search, ShieldCheck, TrendingUp } from 'lucide-react';
import type { BlogArticle } from '../data/blog';

interface BlogCoverVisualProps {
  variant: BlogArticle['coverVariant'];
  title: string;
}

/**
 * Illustration éditoriale vectorielle dédiée aux articles (aucune image stock ou IA).
 */
export function BlogCoverVisual({ variant, title }: BlogCoverVisualProps) {
  const config = {
    speed: {
      icon: Gauge,
      accent: '#00CFFF',
      label: 'Core Web Vitals',
      bars: [42, 68, 84, 98],
    },
    seo: {
      icon: Search,
      accent: '#006BFF',
      label: 'Architecture SEO',
      bars: [55, 72, 88, 95],
    },
    ownership: {
      icon: ShieldCheck,
      accent: '#38BDF8',
      label: 'Code & Domaine',
      bars: [60, 75, 90, 100],
    },
    conversion: {
      icon: TrendingUp,
      accent: '#00CFFF',
      label: 'Parcours Client',
      bars: [38, 62, 79, 92],
    },
  }[variant];

  const Icon = config.icon;

  return (
    <div
      className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-[#006BFF]/25 bg-[#020817] p-5 flex flex-col justify-between"
      role="img"
      aria-label={`Illustration éditoriale : ${title}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-75"
        style={{
          background: `radial-gradient(circle at 85% 15%, ${config.accent}28, transparent 58%), linear-gradient(145deg, #06132D 0%, #020817 100%)`,
        }}
      />

      {/* Grille technique discrète */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,107,255,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,107,255,0.22) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#040D24] border border-[#00CFFF]/40 text-[#00CFFF]">
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
        <span className="text-xs font-mono text-[#B9C7DC]/80">{config.label}</span>
      </div>

      {/* Barres de progression visuelles */}
      <div className="relative z-10 flex items-end gap-2.5 h-14 pt-3" aria-hidden="true">
        {config.bars.map((height, idx) => (
          <div
            key={idx}
            className="flex-1 rounded-t-md bg-gradient-to-t from-[#006BFF]/70 to-[#00CFFF]/90"
            style={{ height: `${height}%`, opacity: 0.45 + idx * 0.16 }}
          />
        ))}
      </div>
    </div>
  );
}
