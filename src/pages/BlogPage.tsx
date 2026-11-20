import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { blogArticles } from '../data/blog';
import { BlogCoverVisual } from '../components/BlogCoverVisual';
import { siteConfig } from '../config/siteConfig';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/MotionPrimitives';

interface BlogPageProps {
  slug?: string;
  onNavigate: (path: string, sectionId?: string) => void;
}

export function BlogPage({ slug, onNavigate }: BlogPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const categories = ['Tous', ...Array.from(new Set(blogArticles.map((a) => a.category)))];

  if (slug) {
    const article = blogArticles.find((a) => a.slug === slug);

    if (!article) {
      return (
        <main className="py-16 bg-[#020817]/30 min-h-[70vh]">
          <div className="mx-auto max-w-[840px] px-4 sm:px-6 lg:px-8 text-center space-y-5">
            <h1 className="text-3xl font-bold text-white">Article introuvable</h1>
            <p className="text-[#B9C7DC]">
              Cet article n&apos;existe plus ou son adresse a été modifiée.
            </p>
            <a
              href="/blog"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/blog');
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white bg-[#006BFF]"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Retour au blog</span>
            </a>
          </div>
        </main>
      );
    }

    const related = blogArticles.filter((a) => a.slug !== article.slug).slice(0, 2);

    return (
      <main className="py-12 sm:py-16 bg-[#020817]/30 min-h-[70vh]">
        <article className="mx-auto max-w-[840px] px-4 sm:px-6 lg:px-8 rounded-2xl bg-[#06132D]/70 backdrop-blur-md border border-[#006BFF]/25 p-6 sm:p-10">
          <a
            href="/blog"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/blog');
            }}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#B9C7DC] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Tous les articles</span>
          </a>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#B9C7DC]">
            <span className="font-semibold text-[#00CFFF]">{article.category}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={article.publishedIso}>{article.publishedAt}</time>
            <span aria-hidden="true">·</span>
            <span>{article.readingTime}</span>
          </div>

          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-white leading-tight">
            {article.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#B9C7DC] leading-relaxed">
            {article.excerpt}
          </p>

          <div className="mt-8">
            <BlogCoverVisual variant={article.coverVariant} title={article.title} />
          </div>

          <div className="mt-10 space-y-8">
            {article.sections.map((section) => (
              <ScrollReveal key={section.heading}>
                <section className="space-y-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((paragraph, pIdx) => (
                    <p key={pIdx} className="text-base text-[#B9C7DC] leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </section>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-[#020817]/75 border border-[#006BFF]/35 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <h2 className="text-lg font-bold text-white">
                Besoin d&apos;évaluer votre site actuel ?
              </h2>
              <p className="mt-1 text-sm text-[#B9C7DC]">
                Réservez votre audit technique gratuit avec Zenin Digital.
              </p>
            </div>
            <a
              href={siteConfig.calComUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#00CFFF] to-[#006BFF] whitespace-nowrap shrink-0 min-h-[44px]"
            >
              <span>Obtenir mon audit</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>

          <div className="mt-14 pt-10 border-t border-[#006BFF]/20">
            <h2 className="text-xl font-bold text-white">À lire ensuite</h2>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {related.map((rel) => (
                <a
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(`/blog/${rel.slug}`);
                  }}
                  className="rounded-2xl bg-[#020817]/65 border border-[#006BFF]/25 hover:border-[#00CFFF]/50 p-5 transition-colors block"
                >
                  <div className="text-xs text-[#00CFFF] font-semibold">
                    {rel.category} · {rel.readingTime}
                  </div>
                  <div className="mt-2 text-base font-bold text-white">{rel.title}</div>
                </a>
              ))}
            </div>
          </div>
        </article>
      </main>
    );
  }

  const filteredArticles =
    selectedCategory === 'Tous'
      ? blogArticles
      : blogArticles.filter((a) => a.category === selectedCategory);

  return (
    <main className="py-12 sm:py-16 bg-[#020817]/30 min-h-[70vh]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/', 'accueil');
          }}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#B9C7DC] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Retour à l&apos;accueil</span>
        </a>

        <ScrollReveal className="mt-6 max-w-3xl">
          <p className="text-sm font-semibold tracking-wide text-[#00CFFF]">Blog / SEO</p>
          <h1 className="mt-2 text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Conseils digitaux pour développer votre activité.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#B9C7DC] leading-relaxed">
            Ressources techniques sur la performance web, l’indépendance numérique et les bonnes pratiques SEO.
          </p>
        </ScrollReveal>

        <div
          role="group"
          aria-label="Filtrer les articles par catégorie"
          className="mt-8 inline-flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#06132D]/80 backdrop-blur-md border border-[#006BFF]/30"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors min-h-[40px] ${
                selectedCategory === category
                  ? 'bg-[#006BFF] text-white'
                  : 'text-[#B9C7DC] hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <StaggerContainer className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredArticles.map((article) => (
            <StaggerItem key={article.slug}>
              <motion.article
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="group h-full rounded-2xl bg-[#06132D]/75 backdrop-blur-md border border-[#006BFF]/30 hover:border-[#00CFFF]/60 transition-colors p-6 flex flex-col justify-between"
              >
                <div>
                  <BlogCoverVisual variant={article.coverVariant} title={article.title} />
                  <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-[#B9C7DC]">
                    <span className="font-semibold text-[#00CFFF]">{article.category}</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={article.publishedIso}>{article.publishedAt}</time>
                    <span aria-hidden="true">·</span>
                    <span>{article.readingTime}</span>
                  </div>
                  <h2 className="mt-2 text-xl sm:text-2xl font-bold text-white group-hover:text-[#00CFFF] transition-colors">
                    <a
                      href={`/blog/${article.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(`/blog/${article.slug}`);
                      }}
                    >
                      {article.title}
                    </a>
                  </h2>
                  <p className="mt-2.5 text-sm sm:text-base text-[#B9C7DC] leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#006BFF]/15">
                  <a
                    href={`/blog/${article.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(`/blog/${article.slug}`);
                    }}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#00CFFF] hover:text-white transition-colors"
                  >
                    <span>Lire l&apos;article</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </a>
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </main>
  );
}
