export type ProjectCategory = 'client' | 'demo';

export interface ProjectTestimonial {
  /** Citation exacte validée et autorisée par le client/propriétaire. */
  quote: string;
  /** Nom ou raison sociale autorisée pour publication. */
  authorName: string;
  /** Fonction ou ville (optionnel, uniquement si confirmé). */
  authorRole?: string;
  /** Doit être explicitement true après confirmation et autorisation écrite. */
  verifiedAuthorized: boolean;
}

export interface PortfolioProject {
  id: string;
  slug: string;
  name: string;
  url: string;
  displayUrl: string;
  category: ProjectCategory;
  categoryLabel: 'Réalisations clients' | 'Projets & démonstrations';
  natureLabel: string;
  siteType: string;
  shortDescription: string;
  fullDescription: string;
  architecturePoints: string[];
  accentColor: string;
  /** Emplacement réservé aux témoignages authentiques et autorisés. */
  testimonial?: ProjectTestimonial;
}

/**
 * Portfolio Zenin Digital.
 *
 * Règle éditoriale stricte :
 * - Zenin Digital (l'agence) ne figure jamais comme projet dans ses propres réalisations.
 * - Un projet n'est classé en `category: 'client'` qu'avec relation client et autorisation confirmées.
 * - Aucun témoignage n'est affiché sans `verifiedAuthorized: true`.
 */
export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'ml-menuiserie',
    slug: 'ml-menuiserie',
    name: 'ML Menuiserie',
    url: 'https://mlmenuiserie.vercel.app/',
    displayUrl: 'mlmenuiserie.vercel.app',
    category: 'demo',
    categoryLabel: 'Projets & démonstrations',
    natureLabel: 'Démonstration secteur habitat',
    siteType: 'Site Vitrine Menuiserie',
    shortDescription:
      'Vitrine dédiée aux menuiseries sur-mesure à Bordeaux et en Gironde : fenêtres, baies vitrées, volets, portes, portails et pergolas.',
    fullDescription:
      'Présentation structurée des menuiseries sur-mesure (fenêtres, baies vitrées, volets, portes, portails et pergolas) avec mise en avant de la zone d’intervention en Gironde et accès direct à la demande de devis.',
    architecturePoints: [
      'Mise en avant claire des gammes de menuiseries et de la zone locale',
      'Parcours orienté vers la prise de contact et la demande de devis',
      'Interface responsive adaptée à la consultation sur mobile et ordinateur',
    ],
    accentColor: '#00CFFF',
  },
  {
    id: 'ets-dubois',
    slug: 'ets-dubois',
    name: 'Ets Dubois',
    url: 'https://sitedubois.vercel.app/',
    displayUrl: 'sitedubois.vercel.app',
    category: 'demo',
    categoryLabel: 'Projets & démonstrations',
    natureLabel: 'Démonstration artisanat local',
    siteType: 'Site Vitrine Chauffage & Sanitaire',
    shortDescription:
      'Vitrine dédiée aux services de chauffage et sanitaire à Liège : installation, entretien, dépannage et accès rapide au contact.',
    fullDescription:
      'Site de présentation axé sur la lisibilité des prestations en chauffage et sanitaire à Liège (installation, entretien, dépannage), conçu pour faciliter l’appel ou la prise de contact immédiate.',
    architecturePoints: [
      'Hiérarchie nette des services d’installation, entretien et dépannage',
      'Accès direct aux coordonnées et appels à l’action visibles dès le haut de page',
      'Consultation fluide sur smartphone en situation d’urgence ou de recherche locale',
    ],
    accentColor: '#006BFF',
  },
  {
    id: 'the-wild-knead',
    slug: 'the-wild-knead',
    name: 'The Wild Knead',
    url: 'https://marcsitemaquette-iota.vercel.app/',
    displayUrl: 'marcsitemaquette-iota.vercel.app',
    category: 'demo',
    categoryLabel: 'Projets & démonstrations',
    natureLabel: 'Maquette vitrine',
    siteType: 'Vitrine Boulangerie & Pâtisserie',
    shortDescription:
      'Maquette de site vitrine pour boulangerie et pâtisserie artisanale mettant en valeur pains de tradition, viennoiseries et créations.',
    fullDescription:
      'Maquette dédiée à l’univers de la boulangerie et pâtisserie artisanale : présentation des pains de tradition, viennoiseries pur beurre et créations personnalisées dans une mise en page éditoriale soignée.',
    architecturePoints: [
      'Mise en scène éditoriale des produits et spécialités artisanales',
      'Navigation directe entre carte des créations et informations pratiques',
      'Adaptation mobile conçue pour la consultation rapide',
    ],
    accentColor: '#38BDF8',
  },
  {
    id: 'zenin-market',
    slug: 'zenin-market',
    name: 'Zenin Market',
    url: 'https://zenin-market.vercel.app/',
    displayUrl: 'zenin-market.vercel.app',
    category: 'demo',
    categoryLabel: 'Projets & démonstrations',
    natureLabel: 'Projet interne · E-commerce',
    siteType: 'Boutique en ligne Streetwear',
    shortDescription:
      'Boutique en ligne dédiée au streetwear malgache avec mise en avant du catalogue, fiches produits et expérience d’achat moderne.',
    fullDescription:
      'Projet interne orienté commerce en ligne pour la présentation de collections streetwear, la navigation par articles et la fluidité d’affichage sur mobile.',
    architecturePoints: [
      'Catalogue produit structuré pour la découverte rapide des pièces',
      'Interface sombre et contrastée valorisant les visuels produits',
      'Navigation pensée en priorité pour les acheteurs sur smartphone',
    ],
    accentColor: '#00CFFF',
  },
  {
    id: 'execlingo',
    slug: 'execlingo',
    name: 'ExecLingo',
    url: 'https://anglais-terminale.vercel.app/',
    displayUrl: 'anglais-terminale.vercel.app',
    category: 'demo',
    categoryLabel: 'Projets & démonstrations',
    natureLabel: 'Projet interne · Éducation',
    siteType: 'Plateforme d’apprentissage',
    shortDescription:
      'Plateforme interactive d’apprentissage de l’anglais basée sur le programme de Terminale et adaptée au contexte professionnel.',
    fullDescription:
      'Application web éducative structurant des parcours d’apprentissage de l’anglais professionnel et scolaire à travers des modules interactifs accessibles en ligne.',
    architecturePoints: [
      'Organisation par modules progressifs et exercices interactifs',
      'Interface claire favorisant la régularité et la lisibilité sur tous écrans',
      'Déploiement web rapide accessible sans installation',
    ],
    accentColor: '#006BFF',
  },
  {
    id: 'zenin-langues',
    slug: 'zenin-langues',
    name: 'Zénin Langues',
    url: 'https://zeninlangues.vercel.app/',
    displayUrl: 'zeninlangues.vercel.app',
    category: 'demo',
    categoryLabel: 'Projets & démonstrations',
    natureLabel: 'Projet interne · Éducation',
    siteType: 'Application Web Éducative',
    shortDescription:
      'Application interactive d’entraînement à la conjugaison des verbes en français et en anglais avec exercices, flashcards et dictionnaire.',
    fullDescription:
      'Outil interactif consacré à l’apprentissage des verbes français et anglais réunissant exercices pratiques, fiches de révision (flashcards) et dictionnaire intégré.',
    architecturePoints: [
      'Outils d’entraînement interactifs : exercices, flashcards et dictionnaire',
      'Parcours bilingue français / anglais structuré et réactif',
      'Ergonomie tactile adaptée aux sessions de révision sur mobile',
    ],
    accentColor: '#38BDF8',
  },
  {
    id: 'zenin-chatt',
    slug: 'zenin-chatt',
    name: 'Zenin Chatt',
    url: 'https://zenin-chatt-nu.vercel.app/',
    displayUrl: 'zenin-chatt-nu.vercel.app',
    category: 'demo',
    categoryLabel: 'Projets & démonstrations',
    natureLabel: 'Projet interne · Application Web',
    siteType: 'Messagerie & Espace d’étude',
    shortDescription:
      'Application web de discussion et d’étude conçue pour faciliter les échanges entre étudiants dans une interface moderne.',
    fullDescription:
      'Projet d’application web centré sur la communication et le travail collaboratif entre étudiants, avec une interface épurée et adaptée au format mobile comme bureau.',
    architecturePoints: [
      'Interface applicative dédiée aux discussions et sessions d’étude',
      'Disposition épurée optimisée pour la lecture des échanges',
      'Expérience responsive sur téléphone et ordinateur',
    ],
    accentColor: '#00CFFF',
  },
  {
    id: 'broly-store',
    slug: 'broly-store',
    name: 'Broly Store',
    url: 'https://broly-store-seven.vercel.app/',
    displayUrl: 'broly-store-seven.vercel.app',
    category: 'demo',
    categoryLabel: 'Projets & démonstrations',
    natureLabel: 'Démonstration boutique digitale',
    siteType: 'Boutique Produits Numériques',
    shortDescription:
      'Vitrine et boutique en ligne dédiée à la présentation d’offres et recharges numériques dans une interface sombre à fort contraste.',
    fullDescription:
      'Interface de boutique digitale structurée pour afficher clairement les offres disponibles et orienter l’utilisateur vers la commande en quelques clics.',
    architecturePoints: [
      'Grille d’offres lisible facilitant le choix rapide sur mobile',
      'Design sombre contrasté adapté à l’univers gaming',
      'Accès direct aux actions principales sans surcharge visuelle',
    ],
    accentColor: '#006BFF',
  },
  {
    id: 'bacc-2027-timer',
    slug: 'bacc-2027-timer',
    name: 'BACC 2027 Timer',
    url: 'https://bac-timer-peach.vercel.app/',
    displayUrl: 'bac-timer-peach.vercel.app',
    category: 'demo',
    categoryLabel: 'Projets & démonstrations',
    natureLabel: 'Projet interne · Outil temps réel',
    siteType: 'Application Web Temps Réel',
    shortDescription:
      'Compte à rebours en direct vers le BACC 2027 à Madagascar avec calcul du temps de cours restant et suivi en temps réel.',
    fullDescription:
      'Application web utilitaire dédiée au suivi du calendrier vers le BACC 2027 à Madagascar, affichant le compte à rebours, le temps de cours restant et des indicateurs de progression en direct.',
    architecturePoints: [
      'Calcul dynamique en temps réel et affichage lisible des échéances',
      'Interface légère à chargement quasi instantané sur mobile',
      'Consultation directe sans création de compte ni friction',
    ],
    accentColor: '#38BDF8',
  },
];
