export interface ServiceOffer {
  id: string;
  category: string;
  title: string;
  priceLabel: string;
  billingNote: string;
  summary: string;
  highlights: string[];
  highlighted?: boolean;
  presetProjectType: string;
  presetBudget: string;
}

/**
 * Offres et tarifs modifiables.
 * Conservez uniquement des prestations confirmées et vérifiables.
 */
export const serviceOffers: ServiceOffer[] = [
  {
    id: 'site-vitrine',
    category: 'Création sur mesure',
    title: 'Site Vitrine Ultra-Rapide',
    priceLabel: 'À partir de 1 490 €',
    billingNote: 'Paiement unique · Code & domaine à votre nom',
    summary:
      'Idéal pour les indépendants, cabinets et PME souhaitant une présence en ligne claire, rapide et orientée prise de contact.',
    highlights: [
      'Architecture moderne statique / hybride à faible latence',
      'Structure sémantique HTML5 et balises SEO essentielles',
      'Design responsive adapté mobile, tablette et desktop',
      'Remise complète du code source et du nom de domaine',
    ],
    highlighted: true,
    presetProjectType: 'Création de site vitrine',
    presetBudget: '1 490 € – 2 500 €',
  },
  {
    id: 'site-pro',
    category: 'Croissance & Conversion',
    title: 'Site Web Professionnel',
    priceLabel: 'Sur devis (dès 1 490 €)',
    billingNote: 'Tarif ajusté selon le nombre de pages et besoins',
    summary:
      'Pour les entreprises qui veulent structurer plusieurs services, présenter leurs réalisations et capter des demandes qualifiées.',
    highlights: [
      'Pages services dédiées et parcours de conversion structurés',
      'Section réalisations et module éditorial SEO (blog)',
      'Formulaires validés et connexion à votre prise de rendez-vous',
      'Déploiement optimisé sur infrastructure Cloudflare',
    ],
    presetProjectType: 'Site web professionnel',
    presetBudget: '2 500 € – 5 000 €',
  },
  {
    id: 'optimisation-perf',
    category: 'Performance & SEO',
    title: 'Optimisation de Performance',
    priceLabel: 'Sur audit préalable',
    billingNote: 'Diagnostic technique gratuit avant intervention',
    summary:
      'Analyse technique de votre site existant afin d’améliorer les temps de chargement, la lisibilité et la structure SEO.',
    highlights: [
      'Audit Core Web Vitals, poids des ressources et rendu',
      'Optimisation des images, polices et chargement critique',
      'Correction de la hiérarchie H1/H2/H3 et métadonnées',
      'Rapport clair des actions réalisées et recommandations',
    ],
    presetProjectType: 'Optimisation de performance & SEO',
    presetBudget: '1 490 € – 2 500 €',
  },
  {
    id: 'maintenance-mensuelle',
    category: 'Accompagnement continu',
    title: 'Maintenance & Suivi Tout Inclus',
    priceLabel: '99 €/mois',
    billingNote: 'Formule récurrente tout inclus · Sans blocage de propriété',
    summary:
      'Déléguez la gestion technique, l’hébergement et les mises à jour courantes tout en gardant la maîtrise de vos actifs.',
    highlights: [
      'Hébergement edge, certificats SSL et supervision technique',
      'Mises à jour de sécurité et sauvegardes régulières',
      'Ajustements de contenus et évolutions mineures selon forfait',
      'Accompagnement réactif pour vos besoins du quotidien',
    ],
    presetProjectType: 'Maintenance & accompagnement (99 €/mois)',
    presetBudget: 'Abonnement 99 €/mois',
  },
];
