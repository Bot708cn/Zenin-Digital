export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    id: 'cout-creation',
    question: "Combien coûte la création d'un site web ?",
    answer:
      'La création d’un site vitrine sur mesure débute à partir de 1 490 € en paiement unique. Le tarif exact dépend du nombre de pages, des fonctionnalités spécifiques demandées et du niveau d’accompagnement sur les contenus, précisés dans un devis clair après le diagnostic technique.',
  },
  {
    id: 'delai-livraison',
    question: 'Combien de temps faut-il pour livrer mon site ?',
    answer:
      'Pour un site vitrine standard, la livraison peut intervenir en 5 jours ouvrés à compter de la validation du diagnostic et de la réception de l’ensemble de vos contenus (textes, logo, visuels et accès domaine). Les projets plus étendus font l’objet d’un calendrier défini ensemble dès le départ.',
  },
  {
    id: 'propriete-code',
    question: 'Est-ce que je serai propriétaire de mon code ?',
    answer:
      'Oui. À l’issue de la livraison et du règlement de la prestation, le code source du site vous est remis (par exemple via votre dépôt Git). Vous ne dépendez pas d’un CMS propriétaire verrouillé et restez libre de faire évoluer votre site avec nous ou avec tout autre prestataire.',
  },
  {
    id: 'propriete-domaine',
    question: 'Mon nom de domaine m\'appartient-il ?',
    answer:
      'Oui. Le nom de domaine est enregistré ou géré à votre nom auprès du registrar. Vous conservez la propriété juridique et l’accès administrateur complet sur votre domaine et vos zones DNS.',
  },
  {
    id: 'optimisation-google',
    question: 'Le site sera-t-il optimisé pour Google ?',
    answer:
      'Oui sur le plan technique : chaque site est conçu avec une structure HTML sémantique, une hiérarchie H1/H2/H3 propre, des balises title et meta descriptions dédiées, un fichier sitemap.xml, robots.txt, des métadonnées Open Graph et une attention particulière portée aux temps de chargement. Le positionnement final dans Google dépend toutefois aussi de votre marché, de la concurrence et de la régularité de vos contenus.',
  },
  {
    id: 'abonnement-99',
    question: "Que comprend l'abonnement à 99€/mois ?",
    answer:
      'L’offre récurrente à 99 €/mois couvre l’hébergement sur infrastructure moderne, la gestion technique, le suivi de sécurité, les sauvegardes et des mises à jour ou ajustements courants convenus dans le contrat de maintenance. Elle est facultative si vous préférez gérer l’hébergement en autonomie.',
  },
  {
    id: 'modifications',
    question: 'Puis-je demander des modifications ?',
    answer:
      'Oui. Des retours sont intégrés pendant la phase de conception avant la mise en ligne, et vous pouvez ensuite demander des évolutions ponctuelles sur devis ou via l’abonnement mensuel selon la nature des modifications souhaitées.',
  },
];
