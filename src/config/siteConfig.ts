export interface TrustBarItem {
  id: string;
  icon: 'gauge' | 'code' | 'zap' | 'wallet';
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeTone?: 'emerald' | 'blue';
  editableNote?: string;
}

export interface SocialProofConfig {
  enabled: boolean;
  stars: number;
  quote: string;
  author: string;
  isDemoContent: boolean;
  demoNotice: string;
}

export const siteConfig = {
  brandName: 'Zenin Digital',
  tagline: 'Agence Web & Digital',
  description:
    'Agence Web & Digital spécialisée dans la création de sites web ultra-rapides, performants et orientés conversion.',
  calComUrl: 'https://cal.com/zenin-digital/diagnostic',
  contactEmail: 'contact@zenin-digital.fr',
  location: 'France — Interventions à distance & sur rendez-vous',
  assets: {
    logo: '/images/zenin-logo.png',
    emblem3d: '/images/zenin-emblem.jpg',
    heroBg: '/images/hero-bg.png',
    heroBgExternal: 'https://i.postimg.cc/qqNWJ4tw/file-00000000a5288208bb1a2e540c872b21.png',
    heroIllustration: '/images/hero-laptop-rocket.png',
    heroReference: '/images/hero-mockup.png',
  },
  hero: {
    badge: '🚀 Agence Web & Digital',
    subtitleSegments: [
      { label: 'Stack Astro + Cloudflare + IA', icon: 'layers' as const },
      { label: 'Livré en 5j', icon: 'clock' as const },
      { label: 'Propriétaire de votre code & domaine', icon: 'shield' as const },
      { label: 'À partir de 1 490€', icon: 'tag' as const },
    ],
    primaryCtaLabel: 'Obtenir mon Audit Technique Gratuit',
    secondaryCtaLabel: 'Voir nos réalisations',
  },
  /**
   * Configuration modifiable des engagements affichés sous le Hero.
   * Mettre à jour `badgeText` et `verificationNote` selon les résultats d'audit réels.
   */
  trustBar: {
    items: [
      {
        id: 'lighthouse',
        icon: 'gauge',
        title: 'Lighthouse 100/100',
        badgeText: 'Objectif sur audit',
        badgeTone: 'emerald',
        editableNote: 'Cible de performance visée lors de la conception, validée par audit réel avant livraison.',
      },
      {
        id: 'ownership',
        icon: 'code',
        title: 'Propriétaire Code',
        subtitle: '& Domaine',
      },
      {
        id: 'delivery',
        icon: 'zap',
        title: 'Livré en 5j',
        subtitle: 'Contenu Fourni',
      },
      {
        id: 'maintenance',
        icon: 'wallet',
        title: '99€/mois',
        subtitle: 'Tout Inclus',
      },
    ] as TrustBarItem[],
    verificationFootnote:
      'Les objectifs de performance et délais (5 jours ouvrés sous réserve de fourniture des contenus) sont configurables dans siteConfig.ts et confirmés lors du diagnostic technique.',
  },
  /**
   * Témoignage de démonstration issu de la maquette.
   * Remplacer `isDemoContent: false` et les textes par un avis client vérifié avant publication.
   */
  socialProof: {
    enabled: true,
    stars: 5,
    quote: '« +42% de leads en 2 mois pour Cabinet Dentaire Lumière — Site livré en 4j. »',
    author: 'Dr. Martin, Lyon',
    isDemoContent: true,
    demoNotice: 'Exemple de démonstration (maquette) — à remplacer par un témoignage client vérifié.',
  } as SocialProofConfig,
  legal: {
    editorName: 'Zenin Digital',
    legalStatus: 'Entreprise individuelle / Agence digitale (à compléter avec votre SIRET)',
    hostingProvider: 'Cloudflare Pages (Cloudflare, Inc.)',
    contactEmail: 'contact@zenin-digital.fr',
  },
};
