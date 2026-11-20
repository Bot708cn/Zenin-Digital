import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Zap, LayoutGrid, FileText, Mail, ArrowRight, Menu, X } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { ScrollProgressBar } from './MotionPrimitives';

export type NavSectionId = 'accueil' | 'tarifs' | 'realisations' | 'blog' | 'contact';

interface NavbarProps {
  currentPath: string;
  activeSection: NavSectionId;
  onNavigate: (path: string, sectionId?: string) => void;
}

export function Navbar({ currentPath, activeSection, onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems: Array<{
    id: NavSectionId;
    label: string;
    href: string;
    path: string;
    sectionId?: string;
    icon: typeof Home;
  }> = [
    { id: 'accueil', label: 'Accueil', href: '/', path: '/', sectionId: 'accueil', icon: Home },
    {
      id: 'realisations',
      label: 'Réalisations',
      href: '/portfolio',
      path: currentPath === '/' ? '/' : '/portfolio',
      sectionId: currentPath === '/' ? 'realisations' : undefined,
      icon: LayoutGrid,
    },
    { id: 'tarifs', label: 'Tarifs', href: '/#tarifs', path: '/', sectionId: 'tarifs', icon: Zap },
    {
      id: 'blog',
      label: 'Blog/SEO',
      href: '/blog',
      path: currentPath === '/' ? '/' : '/blog',
      sectionId: currentPath === '/' ? 'blog' : undefined,
      icon: FileText,
    },
    { id: 'contact', label: 'Contact', href: '/#contact', path: '/', sectionId: 'contact', icon: Mail },
  ];

  const isItemActive = (item: (typeof navItems)[number]) => {
    if (currentPath.startsWith('/portfolio')) {
      return item.id === 'realisations';
    }
    if (currentPath.startsWith('/blog')) {
      return item.id === 'blog';
    }
    if (currentPath !== '/') {
      return false;
    }
    return activeSection === item.id;
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
    sectionId?: string
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(path, sectionId);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 border-b ${
        scrolled
          ? 'bg-[#020617]/90 backdrop-blur-xl border-[#0066FF]/45 shadow-[0_8px_32px_rgba(0,40,120,0.3)]'
          : 'bg-[#020617]/75 backdrop-blur-md border-[#0066FF]/25'
      }`}
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 h-16 sm:h-[74px] flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1 : Logo officiel Zenin Digital */}
        <a
          href="/"
          onClick={(e) => handleNavClick(e, '/', 'accueil')}
          className="flex items-center shrink-0 focus-visible:rounded-lg transition-transform duration-200 hover:scale-[1.02]"
          aria-label="Zenin Digital — Retour à l'accueil"
        >
          <img
            src={siteConfig.assets.logo}
            alt="Logo Zenin Digital"
            className="h-8 sm:h-10 w-auto object-contain"
          />
        </a>

        {/* Zone 2 : Navigation centrale desktop avec soulignement cyan actif */}
        <nav aria-label="Navigation principale" className="hidden lg:flex items-center gap-2 xl:gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item);
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.path, item.sectionId)}
                aria-current={active ? 'page' : undefined}
                className={`relative inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-200 ${
                  active
                    ? 'text-white bg-[#061838]/75'
                    : 'text-[#B9C7DC] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    active ? 'text-[#00D4FF]' : 'text-[#B9C7DC]'
                  }`}
                  aria-hidden="true"
                />
                <span>{item.label}</span>

                {active && (
                  <motion.span
                    layoutId="activeNavUnderline"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full bg-gradient-to-r from-[#0066FF] via-[#00D4FF] to-[#38BDF8] shadow-[0_0_12px_rgba(0,212,255,0.85)]"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3 : CTA lumineux bleu-cyan + menu hamburger mobile */}
        <div className="flex items-center gap-3 shrink-0">
          <motion.a
            href="/#contact"
            onClick={(e) => handleNavClick(e, '/', 'contact')}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white whitespace-nowrap shrink-0 bg-gradient-to-r from-[#0066FF] via-[#008BFF] to-[#00D4FF] shadow-[0_0_24px_rgba(0,139,255,0.45)] hover:shadow-[0_0_32px_rgba(0,212,255,0.7)] transition-shadow duration-200"
          >
            <span>Demander un devis</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </motion.a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-[#0066FF]/40 bg-[#030B20]/85 text-white hover:border-[#00D4FF]/65 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile responsive animé */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            id="mobile-nav-drawer"
            aria-label="Navigation mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-[#0066FF]/25 bg-[#020617]/95 backdrop-blur-xl px-4 py-4 space-y-2"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item);
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.path, item.sectionId)}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors min-h-[44px] ${
                    active
                      ? 'bg-[#061838] text-white border border-[#00D4FF]/50 shadow-[0_0_16px_rgba(0,212,255,0.18)]'
                      : 'text-[#B9C7DC] hover:text-white hover:bg-[#030B20]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${active ? 'text-[#00D4FF]' : 'text-[#B9C7DC]'}`}
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </span>
                  {active && (
                    <span className="w-6 h-[2px] rounded-full bg-gradient-to-r from-[#0066FF] to-[#00D4FF]" />
                  )}
                </a>
              );
            })}
            <div className="pt-2">
              <a
                href="/#contact"
                onClick={(e) => handleNavClick(e, '/', 'contact')}
                className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-full text-base font-semibold text-white bg-gradient-to-r from-[#0066FF] to-[#00D4FF] shadow-[0_0_24px_rgba(0,139,255,0.4)] min-h-[44px]"
              >
                <span>Demander un devis</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Barre de progression dynamique au scroll */}
      <ScrollProgressBar />
    </header>
  );
}
