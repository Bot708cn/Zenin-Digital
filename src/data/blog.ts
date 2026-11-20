export interface BlogArticle {
  slug: string;
  title: string;
  category: 'Performance Web' | 'SEO Technique' | 'Conversion';
  publishedAt: string;
  publishedIso: string;
  readingTime: string;
  excerpt: string;
  coverVariant: 'speed' | 'seo' | 'ownership' | 'conversion';
  sections: Array<{
    heading: string;
    paragraphs: string[];
  }>;
}

export const blogArticles: BlogArticle[] = [
  {
    slug: 'vitesse-chargement-core-web-vitals-conversion',
    title: 'Pourquoi la vitesse de chargement influence directement vos conversions',
    category: 'Performance Web',
    publishedAt: '12 novembre 2026',
    publishedIso: '2026-11-12',
    readingTime: '4 min de lecture',
    excerpt:
      'Comprendre l’impact concret des Core Web Vitals (LCP, INP, CLS) sur le taux de rebond et la prise de contact sur mobile.',
    coverVariant: 'speed',
    sections: [
      {
        heading: 'Un site lent pénalise la première impression avant même la lecture',
        paragraphs: [
          'Sur smartphone, un visiteur qui clique depuis une recherche Google ou un lien partagé attend une page exploitable immédiatement. Chaque seconde d’attente liée à des scripts lourds ou des images non optimisées augmente le risque d’abandon avant même la découverte de votre offre.',
          'Une architecture légère privilégie le rendu HTML direct, limite le JavaScript envoyé au navigateur et charge les ressources visuelles de façon maîtrisée.',
        ],
      },
      {
        heading: 'Les trois indicateurs Core Web Vitals à surveiller',
        paragraphs: [
          'Le LCP (Largest Contentful Paint) mesure la rapidité d’affichage du bloc principal. L’INP (Interaction to Next Paint) évalue la réactivité lors d’un clic. Le CLS (Cumulative Layout Shift) vérifie que la mise en page ne saute pas pendant le chargement.',
          'Travailler ces trois critères dès la conception du site évite d’avoir à empiler des correctifs correctifs coûteux après la mise en ligne.',
        ],
      },
    ],
  },
  {
    slug: 'proprietaire-code-source-et-nom-de-domaine',
    title: 'Rester propriétaire de son code et de son nom de domaine : un choix stratégique',
    category: 'Conversion',
    publishedAt: '5 novembre 2026',
    publishedIso: '2026-11-05',
    readingTime: '3 min de lecture',
    excerpt:
      'Éviter la dépendance technique envers un prestataire ou un éditeur fermé grâce à un dépôt de code clair et un domaine à votre nom.',
    coverVariant: 'ownership',
    sections: [
      {
        heading: 'La différence entre louer un outil fermé et posséder son actif digital',
        paragraphs: [
          'De nombreuses entreprises découvrent trop tard que leur site web dépend entièrement d’un constructeur propriétaire ou d’un contrat bloquant l’export du code source. En cas de changement de prestataire, tout doit être reconstruit.',
          'Lorsque votre nom de domaine est enregistré à votre nom et que le code source vous est remis sur un dépôt standard, vous conservez le contrôle total de votre actif numérique.',
        ],
      },
      {
        heading: 'Une base technique transférable et documentée',
        paragraphs: [
          'Utiliser des technologies web standards (HTML, CSS moderne, TypeScript, Astro, déploiement sur Cloudflare Pages) garantit que n’importe quel développeur qualifié puisse reprendre ou faire évoluer votre site sans verrouillage.',
        ],
      },
    ],
  },
  {
    slug: 'fondamentaux-seo-technique-site-professionnel',
    title: 'Les fondamentaux du SEO technique pour un site professionnel',
    category: 'SEO Technique',
    publishedAt: '28 octobre 2026',
    publishedIso: '2026-10-28',
    readingTime: '5 min de lecture',
    excerpt:
      'Balises title uniques, hiérarchie H1/H2/H3, sitemap XML et données structurées : les bases saines pour faciliter l’indexation.',
    coverVariant: 'seo',
    sections: [
      {
        heading: 'Structure sémantique et hiérarchie des titres',
        paragraphs: [
          'Les moteurs de recherche analysent la structure logique de vos pages. Chaque page doit contenir un H1 unique décrivant son sujet principal, suivi de sous-titres H2 et H3 organisés de façon cohérente.',
          'Des balises title et meta description uniques par URL améliorent également la clarté de vos extraits dans les résultats de recherche.',
        ],
      },
      {
        heading: 'Indexation propre et données structurées',
        paragraphs: [
          'Un fichier robots.txt lisible, un sitemap.xml à jour, des URLs courtes et des balises Open Graph complètes assurent une diffusion propre sur les moteurs comme lors du partage sur LinkedIn ou par messagerie.',
        ],
      },
    ],
  },
  {
    slug: 'preparer-contenus-site-web-lancement-5-jours',
    title: 'Comment préparer vos contenus pour lancer votre site en 5 jours',
    category: 'Conversion',
    publishedAt: '18 octobre 2026',
    publishedIso: '2026-10-18',
    readingTime: '4 min de lecture',
    excerpt:
      'La check-list pratique des éléments à réunir (offre, preuves, coordonnées, visuels) pour fluidifier la création et la mise en ligne.',
    coverVariant: 'conversion',
    sections: [
      {
        heading: 'Clarifier votre promesse et votre action principale',
        paragraphs: [
          'Avant d’écrire une ligne de code, il faut définir à qui s’adresse le site, quel problème concret vous résolvez et quelle action vous attendez du visiteur : prise de rendez-vous, demande de devis ou appel direct.',
        ],
      },
      {
        heading: 'Réunir les éléments clés dès le diagnostic',
        paragraphs: [
          'Un logo vectoriel ou PNG haute définition, une présentation synthétique de vos services, vos mentions légales et vos coordonnées de contact suffisent pour démarrer rapidement sans blocage éditorial.',
        ],
      },
    ],
  },
];
