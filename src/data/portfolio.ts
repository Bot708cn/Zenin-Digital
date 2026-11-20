export interface PortfolioProject {
  id: string;
  slug: string;
  name: string;
  siteType: string;
  shortDescription: string;
  fullDescription: string;
  statusLabel: string;
  stack: string[];
  architecturePoints: string[];
  accentColor: string;
  previewLayout: 'cabinet' | 'b2b' | 'artisan' | 'saas';
  previewHeadline: string;
  previewSubline: string;
  previewCta: string;
}

/**
 * Réalisations / Démonstrateurs d'architecture Zenin Digital.
 * Modifiez ce fichier avec vos projets clients validés et autorisés avant publication.
 */
export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'arch-cabinet',
    slug: 'architecture-cabinet-sante',
    name: 'Modèle Cabinet & Praticien',
    siteType: 'Site Vitrine Prise de RDV',
    statusLabel: 'Démonstrateur d’architecture',
    shortDescription:
      'Structure claire orientée prise de rendez-vous rapide, rassurance patient et visibilité locale sur mobile.',
    fullDescription:
      'Conception de référence destinée aux professionnels de santé, cabinets libéraux et structures locales. L’interface privilégie la lecture immédiate des spécialités, l’accès direct au créneau de rendez-vous et une structure SEO locale propre.',
    stack: ['Astro', 'TypeScript', 'Cloudflare Pages', 'SEO Local'],
    architecturePoints: [
      'Navigation directe vers la prise de rendez-vous en un clic',
      'Structure de titres sémantique adaptée aux requêtes locales',
      'Chargement prioritaire des informations pratiques sur smartphone',
    ],
    accentColor: '#00CFFF',
    previewLayout: 'cabinet',
    previewHeadline: 'Votre consultation planifiée en moins d’une minute',
    previewSubline: 'Présentation claire des soins, équipe et accès au cabinet.',
    previewCta: 'Prendre rendez-vous',
  },
  {
    id: 'arch-b2b',
    slug: 'architecture-conseil-b2b',
    name: 'Modèle Conseil & Services B2B',
    siteType: 'Site Web Professionnel',
    statusLabel: 'Démonstrateur d’architecture',
    shortDescription:
      'Vitrine éditoriale pour cabinets de conseil et prestataires B2B avec parcours de qualification des demandes.',
    fullDescription:
      'Architecture multi-sections pensée pour présenter une offre B2B complexe de manière lisible. Intègre une hiérarchie nette des services, une FAQ dédiée aux objections courantes et un formulaire de contact qualifiant.',
    stack: ['Astro', 'Cloudflare', 'JSON-LD', 'Tailwind CSS'],
    architecturePoints: [
      'Parcours progressif : proposition de valeur, méthode, FAQ et devis',
      'Formulaire structuré par type de besoin et budget',
      'Données structurées Schema.org pour les moteurs de recherche',
    ],
    accentColor: '#006BFF',
    previewLayout: 'b2b',
    previewHeadline: 'Structurer votre offre B2B pour générer des contacts qualifiés',
    previewSubline: 'Positionnement, méthodologie et prise de brief simplifiée.',
    previewCta: 'Demander une étude',
  },
  {
    id: 'arch-artisan',
    slug: 'architecture-habitat-artisanat',
    name: 'Modèle Entreprise & Artisanat',
    siteType: 'Vitrine & Galerie Projets',
    statusLabel: 'Démonstrateur d’architecture',
    shortDescription:
      'Mise en avant des savoir-faire, zones d’intervention et demandes de devis rapides sur chantier ou mobile.',
    fullDescription:
      'Interface sobre et contrastée conçue pour les entreprises du bâtiment, bureaux d’études et artisans qualifiés. Met l’accent sur la clarté des prestations et la facilité de contact depuis un smartphone.',
    stack: ['Astro', 'Cloudflare Pages', 'HTML Sémantique', 'Optimisation WebP'],
    architecturePoints: [
      'Affichage rapide des zones d’intervention et spécialités',
      'Boutons d’action dimensionnés pour un usage tactile confortable',
      'Poids de page maîtrisé pour les connexions mobiles 4G',
    ],
    accentColor: '#38BDF8',
    previewLayout: 'artisan',
    previewHeadline: 'Valorisez votre savoir-faire technique et vos réalisations',
    previewSubline: 'Présentation de vos chantiers et formulaire de devis direct.',
    previewCta: 'Chiffrer un projet',
  },
  {
    id: 'arch-saas',
    slug: 'architecture-produit-numerique',
    name: 'Modèle Produit & Offre Tech',
    siteType: 'Landing Page Conversion',
    statusLabel: 'Démonstrateur d’architecture',
    shortDescription:
      'Page de lancement haute lisibilité pour solutions digitales avec comparatif d’offres et documentation éditoriale.',
    fullDescription:
      'Structure dédiée aux éditeurs, startups et offres digitales exigeant une identité technologique nette, un affichage clair des formules tarifaires et un espace éditorial optimisé pour le référencement organique.',
    stack: ['TypeScript', 'Cloudflare', 'Core Web Vitals', 'SEO Technique'],
    architecturePoints: [
      'Hiérarchie typographique marquée et contrastes conformes WCAG',
      'Architecture prête pour la publication d’articles SEO',
      'Code modulaire facilement maintenable et transférable',
    ],
    accentColor: '#00CFFF',
    previewLayout: 'saas',
    previewHeadline: 'Présentez votre solution numérique avec clarté et rigueur',
    previewSubline: 'Architecture de conversion, offres lisibles et blog intégré.',
    previewCta: 'Découvrir l’offre',
  },
];
