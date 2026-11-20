import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { blogArticles, type BlogArticle } from '../data/blog';
import { BlogCoverVisual } from './BlogCoverVisual';
import { ScrollReveal, StaggerContainer, StaggerItem } from './MotionPrimitives';

interface BlogSectionProps {
  onOpenArticle: (slug: string) => void;
  onViewAllBlog: () => void;
}

export function BlogSection({ onOpenArticle, onViewAllBlog }: BlogSectionProps) {
  const previewArticles: BlogArticle[] = blogArticles.slice(0, 3);

  return (
    <section
      id="blog"
      className="py-16 sm:py-24 bg-[#040B1F]/40 backdrop-blur-[2px] border-b border-[#006BFF]/20"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-wide text-[#00CFFF]">
              Blog &amp; Ressources SEO
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Conseils digitaux pour développer votre activité.
            </h2>
            <p className="mt-4 text-base text-[#B9C7DC] leading-relaxed">
              Guides pratiques sur la performance web, l’indépendance technique et les fondamentaux du référencement naturel.
            </p>
          </div>

          <motion.a
            href="/blog"
            onClick={(e) => {
              e.preventDefault();
              onViewAllBlog();
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white border border-[#006BFF]/45 bg-[#06132D]/75 backdrop-blur-md hover:border-[#00CFFF] transition-colors whitespace-nowrap shrink-0 self-start md:self-auto min-h-[44px]"
          >
            <span>Tous les articles</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </motion.a>
        </ScrollReveal>

        <StaggerContainer className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewArticles.map((article) => (
            <StaggerItem key={article.slug}>
              <motion.article
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="group h-full rounded-2xl bg-[#06132D]/75 backdrop-blur-md border border-[#006BFF]/30 hover:border-[#00CFFF]/60 hover:shadow-[0_12px_36px_rgba(0,107,255,0.2)] transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <BlogCoverVisual variant={article.coverVariant} title={article.title} />

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#B9C7DC]">
                    <span className="font-semibold text-[#00CFFF]">{article.category}</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={article.publishedIso}>{article.publishedAt}</time>
                    <span aria-hidden="true">·</span>
                    <span>{article.readingTime}</span>
                  </div>

                  <h3 className="mt-2.5 text-lg font-bold text-white leading-snug group-hover:text-[#00CFFF] transition-colors">
                    <a
                      href={`/blog/${article.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenArticle(article.slug);
                      }}
                      className="focus-visible:underline"
                    >
                      {article.title}
                    </a>
                  </h3>

                  <p className="mt-2.5 text-sm text-[#B9C7DC] leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#006BFF]/15">
                  <a
                    href={`/blog/${article.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenArticle(article.slug);
                    }}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#00CFFF] hover:text-white transition-colors"
                  >
                    <span>Lire l&apos;article</span>
                    <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </a>
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
