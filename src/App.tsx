import { useState, useEffect, useCallback, useMemo } from 'react';
import { MotionConfig, AnimatePresence, motion } from 'motion/react';
import { Navbar, type NavSectionId } from './components/Navbar';
import { PersistentBackground } from './components/PersistentBackground';
import { HeroSection } from './components/HeroSection';
import { OffersSection } from './components/OffersSection';
import { PortfolioSection } from './components/PortfolioSection';
import { MethodSection } from './components/MethodSection';
import { TechnologiesSection } from './components/TechnologiesSection';
import { BlogSection } from './components/BlogSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection, type OfferPreset } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { Logo3DIntroGate } from './components/Logo3DIntroGate';
import { SeoHead } from './components/SeoHead';
import { PortfolioPage } from './pages/PortfolioPage';
import { BlogPage } from './pages/BlogPage';
import { LegalPage } from './pages/LegalPages';
import type { ServiceOffer } from './data/offers';
import type { PortfolioProject } from './data/portfolio';
import { blogArticles } from './data/blog';
import { faqItems } from './data/faq';

function normalizePath(rawPath: string): string {
  if (!rawPath) return '/';
  const cleaned = rawPath.split('?')[0].replace(/\/+$/, '');
  return cleaned === '' ? '/' : cleaned;
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() =>
    normalizePath(window.location.pathname)
  );
  const [activeSection, setActiveSection] = useState<NavSectionId>('accueil');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [offerPreset, setOfferPreset] = useState<OfferPreset | null>(null);
  const [introUnlocked, setIntroUnlocked] = useState(false);

  useEffect(() => {
    if (!introUnlocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [introUnlocked]);

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (currentPath !== '/') return;

    const sectionIds: Array<{ id: string; nav: NavSectionId }> = [
      { id: 'accueil', nav: 'accueil' },
      { id: 'tarifs', nav: 'tarifs' },
      { id: 'realisations', nav: 'realisations' },
      { id: 'blog', nav: 'blog' },
      { id: 'contact', nav: 'contact' },
    ];

    const handleScroll = () => {
      const scrollY = window.scrollY + 140;
      let current: NavSectionId = 'accueil';
      for (const item of sectionIds) {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollY) {
          current = item.nav;
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPath]);

  const navigate = useCallback((path: string, sectionId?: string) => {
    const targetPath = normalizePath(path);
    const current = normalizePath(window.location.pathname);

    if (targetPath !== current) {
      window.history.pushState({}, '', targetPath);
      setCurrentPath(targetPath);
    }

    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 80);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleSelectOffer = useCallback(
    (offer: ServiceOffer) => {
      setOfferPreset({
        projectType: offer.presetProjectType,
        budget: offer.presetBudget,
      });
      navigate('/', 'contact');
    },
    [navigate]
  );

  const handleRequestSimilarProject = useCallback(
    (project: PortfolioProject) => {
      setSelectedProject(null);
      setOfferPreset({
        projectType:
          project.siteType === 'Site Web Professionnel'
            ? 'Site web professionnel'
            : 'Création de site vitrine',
        budget: '1 490 € – 2 500 €',
      });
      navigate('/', 'contact');
    },
    [navigate]
  );

  const seoMeta = useMemo(() => {
    if (currentPath === '/portfolio') {
      return {
        title: 'Réalisations & Architectures Web | Zenin Digital',
        description:
          'Découvrez les architectures de sites vitrines et professionnels conçus par Zenin Digital : rapidité, lisibilité mobile et conversion.',
        jsonLd: null,
      };
    }

    if (currentPath === '/blog') {
      return {
        title: 'Blog SEO & Performance Web | Zenin Digital',
        description:
          'Conseils pratiques sur les Core Web Vitals, le SEO technique, l’architecture Astro + Cloudflare et la propriété de votre site web.',
        jsonLd: null,
      };
    }

    if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.replace('/blog/', '');
      const article = blogArticles.find((a) => a.slug === slug);
      if (article) {
        return {
          title: `${article.title} | Zenin Digital`,
          description: article.excerpt,
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: article.title,
            description: article.excerpt,
            datePublished: article.publishedIso,
            author: { '@type': 'Organization', name: 'Zenin Digital' },
          },
        };
      }
    }

    if (currentPath === '/mentions-legales') {
      return {
        title: 'Mentions légales | Zenin Digital',
        description: 'Mentions légales et informations éditeur de Zenin Digital.',
        jsonLd: null,
      };
    }

    if (currentPath === '/politique-de-confidentialite') {
      return {
        title: 'Politique de confidentialité | Zenin Digital',
        description:
          'Politique de confidentialité et gestion des données du formulaire de contact Zenin Digital.',
        jsonLd: null,
      };
    }

    return {
      title: 'Zenin Digital — Sites Web Ultra-Rapides & Orientés Conversion',
      description:
        'Agence Web & Digital : sites ultra-rapides Astro + Cloudflare + IA livrés en 5 jours. Propriétaire de votre code et nom de domaine, à partir de 1 490 €.',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    };
  }, [currentPath]);

  const blogSlug = currentPath.startsWith('/blog/')
    ? currentPath.replace('/blog/', '')
    : undefined;

  const routeKey =
    currentPath === '/portfolio'
      ? 'portfolio'
      : currentPath === '/blog' || blogSlug
        ? `blog-${blogSlug || 'index'}`
        : currentPath === '/mentions-legales'
          ? 'mentions'
          : currentPath === '/politique-de-confidentialite'
            ? 'privacy'
            : 'home';

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen text-white">
        <SeoHead
          title={seoMeta.title}
          description={seoMeta.description}
          path={currentPath}
          jsonLd={seoMeta.jsonLd}
        />

        {/* Arrière-plan permanent sur l'ensemble des pages et sections */}
        <PersistentBackground />

        <div className="relative z-10 min-h-screen flex flex-col">
          <Navbar
            currentPath={currentPath}
            activeSection={activeSection}
            onNavigate={navigate}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={routeKey}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col"
            >
              {currentPath === '/portfolio' ? (
                <PortfolioPage onNavigate={navigate} onOpenProject={setSelectedProject} />
              ) : currentPath === '/blog' || blogSlug ? (
                <BlogPage slug={blogSlug} onNavigate={navigate} />
              ) : currentPath === '/mentions-legales' ? (
                <LegalPage type="mentions" onNavigate={navigate} />
              ) : currentPath === '/politique-de-confidentialite' ? (
                <LegalPage type="privacy" onNavigate={navigate} />
              ) : (
                <main className="flex-1">
                  <HeroSection onNavigate={navigate} />
                  <OffersSection onSelectOffer={handleSelectOffer} />
                  <PortfolioSection
                    onOpenProject={setSelectedProject}
                    onViewAllPortfolio={() => navigate('/portfolio')}
                  />
                  <MethodSection />
                  <TechnologiesSection />
                  <BlogSection
                    onOpenArticle={(slug) => navigate(`/blog/${slug}`)}
                    onViewAllBlog={() => navigate('/blog')}
                  />
                  <FaqSection />
                  <ContactSection offerPreset={offerPreset} />
                </main>
              )}
            </motion.div>
          </AnimatePresence>

          <Footer onNavigate={navigate} />
        </div>

        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onRequestSimilar={handleRequestSimilarProject}
        />

        {!introUnlocked && (
          <Logo3DIntroGate onUnlock={() => setIntroUnlocked(true)} />
        )}
      </div>
    </MotionConfig>
  );
}
