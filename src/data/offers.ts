export interface ServiceOffer {
  id: 'essentiel' | 'croissance' | 'scale' | string;
  title: string;
  tagline: string;
  description: string;
  priceAmount: string;
  priceUnit: string;
  priceLabel: string;
  monthlyLabel: string;
  icon: 'rocket' | 'chart' | 'gem';
  features: string[];
  ctaLabel: string;
  highlighted?: boolean;
  recommendedBadge?: string;
  presetProjectType: string;
  presetBudget: string;
}

export interface ComplementaryService {
  id: 'recurrents' | 'options';
  icon: 'wrench' | 'puzzle';
  title: string;
  description: string;
  linkLabel: string;
  /** Renseigner une URL réelle (ex. "/services-recurrents" ou externe) si une page dédiée est publiée. */
  destinationUrl?: string;
  items: Array<{
    name: string;
    detail: string;
    presetProjectType: string;
    presetBudget: string;
  }>;
}

export const serviceOffers: ServiceOffer[] = [
  {
    id: 'essentiel',
    title: 'Essentiel',
    tagline: 'Pour démarrer',
    description: 'Créez votre présence sur Internet et présentez vos services.',
    priceAmount: '1 490 €',
    priceUnit: 'HT',
    priceLabel: '1 490 € HT',
    monthlyLabel: '+ 99 € / mois',
    icon: 'rocket',
    features: [
      '5 Pages (Accueil, Services, À propos...)',
      'Formulaire → Email / Telegram',
      'CMS simple et intuitif',
      'SEO optimisé & RGPD',
      'Déploiement rapide (5j)',
    ],
    ctaLabel: 'Demander un devis Vitrine',
    highlighted: false,
    presetProjectType: 'Création de site vitrine',
    presetBudget: '1 490 € – 2 500 €',
  },
  {
    id: 'croissance',
    title: 'Croissance',
    tagline: 'Le choix idéal pour grandir',
    description: 'Développez votre visibilité et recevez plus de demandes de devis.',
    priceAmount: '1 980 €',
    priceUnit: 'HT',
    priceLabel: '1 980 € HT',
    monthlyLabel: '+ 148 € / mois',
    icon: 'chart',
    features: [
      "Tout l'Essentiel +",
      '10-20 Pages « Service × Ville »',
      '4 Articles Blog / Mois (IA + Relu)',
      'Google Business Profile Optimisé',
      'Reporting Mensuel + Visio 15 min',
    ],
    ctaLabel: 'Demander un devis Pro',
    highlighted: true,
    recommendedBadge: 'Recommandée',
    presetProjectType: 'Site web professionnel',
    presetBudget: '1 490 € – 2 500 €',
  },
  {
    id: 'scale',
    title: 'Scale',
    tagline: 'La totale, sans limites',
    description: 'Automatisez votre activité et dominez votre marché.',
    priceAmount: '2 980 €',
    priceUnit: 'HT',
    priceLabel: '2 980 € HT',
    monthlyLabel: '+ 298 € / mois',
    icon: 'gem',
    features: [
      'Tout le Croissance +',
      'Automatisation Leads (n8n/Make)',
      'Prise RDV Auto & Relances IA',
      '1h Dev Sur-Mesure / Mois',
      'Revue Stratégique Trimestrielle',
    ],
    ctaLabel: 'Demander un devis Scale',
    highlighted: false,
    presetProjectType: 'Refonte complète',
    presetBudget: '2 500 € – 5 000 €',
  },
];

export const guaranteeInfo = {
  titlePrefix: 'Satisfait ou une',
  titleHighlight: 'retouche gratuite',
  description:
    'Votre satisfaction est notre priorité. Si quelque chose ne vous convient pas, nous le corrigeons gratuitement.',
  rightBadges: [
    { id: 'performance', icon: 'zap' as const, label: 'Performance', emphasis: '100/100' },
    { id: 'ownership', icon: 'lock' as const, label: 'Propriété totale', emphasis: '' },
  ],
};

export const complementaryServices: ComplementaryService[] = [
  {
    id: 'recurrents',
    icon: 'wrench',
    title: 'Nos services récurrents',
    description: 'Maintenance & Suivi Tout Inclus ou Optimisation Performance & SEO.',
    linkLabel: 'En savoir plus',
    destinationUrl: '#services-recurrents',
    items: [
      {
        name: 'Maintenance & Suivi Tout Inclus',
        detail:
          'Hébergement edge, certificats SSL, sauvegardes, mises à jour de sécurité et évolutions mensuelles selon votre forfait.',
        presetProjectType: 'Maintenance & accompagnement (99 €/mois)',
        presetBudget: 'Abonnement 99 €/mois',
      },
      {
        name: 'Optimisation Performance & SEO',
        detail:
          'Audit technique Core Web Vitals, optimisation des images/polices, balisage Schema.org et amélioration du référencement local.',
        presetProjectType: 'Optimisation de performance & SEO',
        presetBudget: '1 490 € – 2 500 €',
      },
    ],
  },
  {
    id: 'options',
    icon: 'puzzle',
    title: 'Options à la carte',
    description: 'Rédaction, automatisation, pages supplémentaires...',
    linkLabel: 'Découvrir les options',
    destinationUrl: '#options-a-la-carte',
    items: [
      {
        name: 'Pages « Service × Ville » supplémentaires',
        detail:
          'Extension ciblée de votre maillage SEO local pour couvrir de nouvelles zones géographiques ou prestations.',
        presetProjectType: 'Optimisation de performance & SEO',
        presetBudget: '1 490 € – 2 500 €',
      },
      {
        name: 'Automatisations Leads (n8n / Make / CRM)',
        detail:
          'Connexion de vos formulaires, prises de rendez-vous et notifications vers Telegram, Slack, CRM ou e-mail.',
        presetProjectType: 'Site web professionnel',
        presetBudget: '2 500 € – 5 000 €',
      },
      {
        name: 'Rédaction SEO & Contenus relus',
        detail:
          'Production d’articles de blog structurés, optimisés pour l’intention de recherche et relus avant publication.',
        presetProjectType: 'Optimisation de performance & SEO',
        presetBudget: '1 490 € – 2 500 €',
      },
    ],
  },
];
