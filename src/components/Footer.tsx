import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface FooterProps {
  onNavigate: (path: string, sectionId?: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const year = new Date().getFullYear();

  const handleLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
    sectionId?: string
  ) => {
    e.preventDefault();
    onNavigate(path, sectionId);
  };

  return (
    <footer className="bg-[#020817]/75 backdrop-blur-md border-t border-[#006BFF]/30 text-[#B9C7DC]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Logo et présentation */}
          <div className="lg:col-span-4 space-y-4">
            <a
              href="/"
              onClick={(e) => handleLink(e, '/', 'accueil')}
              className="inline-block"
              aria-label="Zenin Digital — Accueil"
            >
              <img
                src={siteConfig.assets.logo}
                alt="Logo Zenin Digital"
                className="h-9 w-auto object-contain"
                loading="lazy"
              />
            </a>
            <p className="text-sm leading-relaxed text-[#B9C7DC]">
              Agence Web &amp; Digital spécialisée dans la création de sites web ultra-rapides, performants et orientés conversion, avec propriété complète de votre code et de votre domaine.
            </p>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-semibold text-white">Navigation</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="/"
                  onClick={(e) => handleLink(e, '/', 'accueil')}
                  className="hover:text-white transition-colors"
                >
                  Accueil
                </a>
              </li>
              <li>
                <a
                  href="/#tarifs"
                  onClick={(e) => handleLink(e, '/', 'tarifs')}
                  className="hover:text-white transition-colors"
                >
                  Tarifs
                </a>
              </li>
              <li>
                <a
                  href="/portfolio"
                  onClick={(e) => handleLink(e, '/portfolio')}
                  className="hover:text-white transition-colors"
                >
                  Réalisations
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  onClick={(e) => handleLink(e, '/blog')}
                  className="hover:text-white transition-colors"
                >
                  Blog / SEO
                </a>
              </li>
              <li>
                <a
                  href="/#faq"
                  onClick={(e) => handleLink(e, '/', 'faq')}
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-semibold text-white">Services</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="/#tarifs"
                  onClick={(e) => handleLink(e, '/', 'tarifs')}
                  className="hover:text-white transition-colors"
                >
                  Création de sites vitrines
                </a>
              </li>
              <li>
                <a
                  href="/#tarifs"
                  onClick={(e) => handleLink(e, '/', 'tarifs')}
                  className="hover:text-white transition-colors"
                >
                  Sites web professionnels
                </a>
              </li>
              <li>
                <a
                  href="/#technologies"
                  onClick={(e) => handleLink(e, '/', 'technologies')}
                  className="hover:text-white transition-colors"
                >
                  Optimisation de performance &amp; SEO
                </a>
              </li>
              <li>
                <a
                  href="/#tarifs"
                  onClick={(e) => handleLink(e, '/', 'tarifs')}
                  className="hover:text-white transition-colors"
                >
                  Maintenance à 99 €/mois
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-semibold text-white">Contact</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="hover:text-white transition-colors"
                >
                  {siteConfig.contactEmail}
                </a>
              </li>
              <li>{siteConfig.location}</li>
              <li className="pt-1">
                <a
                  href={siteConfig.calComUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#00CFFF] hover:text-white font-medium transition-colors"
                >
                  <span>Prendre rendez-vous (Cal.com)</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Barre inférieure légale */}
        <div className="mt-12 pt-8 border-t border-[#006BFF]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#B9C7DC]/80">
          <p>© {year} Zenin Digital. Tous droits réservés.</p>
          <div className="flex flex-wrap items-center gap-5">
            <a
              href="/mentions-legales"
              onClick={(e) => handleLink(e, '/mentions-legales')}
              className="hover:text-white transition-colors"
            >
              Mentions légales
            </a>
            <a
              href="/politique-de-confidentialite"
              onClick={(e) => handleLink(e, '/politique-de-confidentialite')}
              className="hover:text-white transition-colors"
            >
              Politique de confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
