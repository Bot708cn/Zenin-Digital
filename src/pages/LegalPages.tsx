import { ArrowLeft } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { ScrollReveal } from '../components/MotionPrimitives';

interface LegalPageProps {
  type: 'mentions' | 'privacy';
  onNavigate: (path: string, sectionId?: string) => void;
}

export function LegalPage({ type, onNavigate }: LegalPageProps) {
  return (
    <main className="py-12 sm:py-16 bg-[#020817]/30 min-h-[70vh]">
      <div className="mx-auto max-w-[840px] px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="rounded-2xl bg-[#06132D]/75 backdrop-blur-md border border-[#006BFF]/30 p-6 sm:p-10">
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

          {type === 'mentions' ? (
            <div className="mt-6 space-y-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Mentions légales</h1>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-white">Éditeur du site</h2>
                <p className="text-sm sm:text-base text-[#B9C7DC] leading-relaxed">
                  {siteConfig.legal.editorName} — {siteConfig.legal.legalStatus}.
                  <br />
                  Contact :{' '}
                  <a
                    href={`mailto:${siteConfig.legal.contactEmail}`}
                    className="text-[#00CFFF] hover:underline"
                  >
                    {siteConfig.legal.contactEmail}
                  </a>
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-white">Hébergement</h2>
                <p className="text-sm sm:text-base text-[#B9C7DC] leading-relaxed">
                  Infrastructure : {siteConfig.legal.hostingProvider}.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-white">Propriété intellectuelle</h2>
                <p className="text-sm sm:text-base text-[#B9C7DC] leading-relaxed">
                  L&apos;identité visuelle, le logo Zenin Digital et les contenus éditoriaux présentés sur ce site sont la propriété de Zenin Digital. Toute reproduction sans autorisation préalable est interdite.
                </p>
              </section>
            </div>
          ) : (
            <div className="mt-6 space-y-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Politique de confidentialité
              </h1>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-white">Données collectées</h2>
                <p className="text-sm sm:text-base text-[#B9C7DC] leading-relaxed">
                  Les informations saisies dans le formulaire de contact (nom complet, adresse e-mail, entreprise, type de projet, budget estimé et description) sont collectées exclusivement afin d&apos;étudier votre demande de devis ou de diagnostic technique.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-white">Durée de conservation et droits</h2>
                <p className="text-sm sm:text-base text-[#B9C7DC] leading-relaxed">
                  Vos données ne sont ni revendues ni cédées à des tiers à des fins publicitaires. Conformément au RGPD, vous pouvez demander l&apos;accès, la rectification ou la suppression de vos données en écrivant à{' '}
                  <a
                    href={`mailto:${siteConfig.legal.contactEmail}`}
                    className="text-[#00CFFF] hover:underline"
                  >
                    {siteConfig.legal.contactEmail}
                  </a>
                  .
                </p>
              </section>
            </div>
          )}
        </ScrollReveal>
      </div>
    </main>
  );
}
