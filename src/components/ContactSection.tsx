import { useState, useEffect, type FormEvent } from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Loader2,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { ScrollReveal } from './MotionPrimitives';

export interface OfferPreset {
  projectType: string;
  budget: string;
}

interface ContactSectionProps {
  offerPreset?: OfferPreset | null;
}

interface FormValues {
  fullName: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  description: string;
}

type FieldErrors = Partial<Record<keyof FormValues, string>>;

const PROJECT_TYPES = [
  'Création de site vitrine',
  'Site web professionnel',
  'Optimisation de performance & SEO',
  'Refonte complète',
  'Maintenance & accompagnement (99 €/mois)',
];

const BUDGET_RANGES = [
  '1 490 € – 2 500 €',
  '2 500 € – 5 000 €',
  '5 000 € et plus',
  'Abonnement 99 €/mois',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ContactSection({ offerPreset }: ContactSectionProps) {
  const [values, setValues] = useState<FormValues>({
    fullName: '',
    email: '',
    company: '',
    projectType: PROJECT_TYPES[0],
    budget: BUDGET_RANGES[0],
    description: '',
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<{
    id: string;
    message: string;
  } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (offerPreset) {
      setValues((prev) => ({
        ...prev,
        projectType: offerPreset.projectType,
        budget: offerPreset.budget,
      }));
    }
  }, [offerPreset]);

  const validateClient = (data: FormValues): FieldErrors => {
    const nextErrors: FieldErrors = {};
    if (data.fullName.trim().length < 2) {
      nextErrors.fullName = 'Veuillez saisir votre nom complet (minimum 2 caractères).';
    }
    if (!EMAIL_REGEX.test(data.email.trim())) {
      nextErrors.email = 'Veuillez indiquer une adresse e-mail valide.';
    }
    if (data.company.trim().length < 2) {
      nextErrors.company = 'Veuillez indiquer le nom de votre entreprise ou activité.';
    }
    if (!data.projectType) {
      nextErrors.projectType = 'Veuillez sélectionner un type de projet.';
    }
    if (!data.budget) {
      nextErrors.budget = 'Veuillez choisir une tranche de budget estimé.';
    }
    if (data.description.trim().length < 20) {
      nextErrors.description =
        'Merci de décrire votre projet en quelques mots (minimum 20 caractères).';
    }
    return nextErrors;
  };

  const handleFieldChange = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitSuccess(null);
    setSubmitError(null);

    const clientErrors = validateClient(values);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT || '/api/contact';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const contentType = response.headers.get('content-type') || '';
      const payload = contentType.includes('application/json')
        ? ((await response.json()) as {
            ok?: boolean;
            id?: string;
            message?: string;
            errors?: FieldErrors;
          })
        : null;

      if (!response.ok || !payload?.ok) {
        if (payload?.errors) {
          setErrors(payload.errors);
        }
        setSubmitError(
          payload?.message ||
            "Le service de formulaire n'a pas pu traiter l'envoi pour le moment. Vous pouvez réserver un créneau direct via Cal.com."
        );
        return;
      }

      setSubmitSuccess({
        id: payload.id || 'CONFIRMÉ',
        message:
          payload.message ||
          'Votre demande a bien été transmise à Zenin Digital. Nous revenons vers vous rapidement.',
      });
      setValues({
        fullName: '',
        email: '',
        company: '',
        projectType: PROJECT_TYPES[0],
        budget: BUDGET_RANGES[0],
        description: '',
      });
      setErrors({});
    } catch {
      setSubmitError(
        "Impossible de joindre le serveur d'envoi pour le moment. Utilisez le bouton Cal.com ci-contre pour réserver votre diagnostic technique."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-[#040B1F]/40 backdrop-blur-[2px]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Colonne gauche : Accroche & Cal.com */}
          <ScrollReveal className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-sm font-semibold tracking-wide text-[#00CFFF]">
                Contact &amp; Diagnostic
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Prêt à transformer votre présence digitale ?
              </h2>
              <p className="mt-4 text-base sm:text-lg text-[#B9C7DC] leading-relaxed">
                Parlons de votre projet et construisons ensemble votre prochain site web.
              </p>
            </div>

            <div className="rounded-2xl bg-[#06132D]/80 backdrop-blur-md border border-[#006BFF]/35 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#020817] border border-[#00CFFF]/40 text-[#00CFFF] shrink-0">
                  <Calendar className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Préférez un échange direct ?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#B9C7DC]">
                    Réservez votre diagnostic technique gratuit en ligne.
                  </p>
                </div>
              </div>

              <motion.a
                href={siteConfig.calComUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#00CFFF] to-[#006BFF] shadow-[0_0_24px_rgba(0,153,255,0.4)] hover:shadow-[0_0_32px_rgba(0,207,255,0.65)] transition-shadow duration-200 min-h-[46px]"
              >
                <span>Réserver sur Cal.com</span>
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </motion.a>
            </div>

            <div className="space-y-3 pt-2 text-sm text-[#B9C7DC]">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#00CFFF] shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="hover:text-white transition-colors"
                >
                  {siteConfig.contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#00CFFF] shrink-0" aria-hidden="true" />
                <span>Propriété complète de votre code source et de votre domaine.</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Colonne droite : Formulaire complet validé */}
          <ScrollReveal delay={0.12} className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-2xl bg-[#06132D]/80 backdrop-blur-md border border-[#006BFF]/35 p-6 sm:p-8 space-y-5"
            >
              {submitSuccess && (
                <div
                  role="status"
                  className="rounded-xl bg-emerald-500/15 border border-emerald-400/40 p-4 flex items-start gap-3 text-sm text-emerald-200"
                >
                  <CheckCircle2
                    className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <div className="font-semibold text-white">
                      Demande enregistrée ({submitSuccess.id})
                    </div>
                    <p className="mt-1 text-emerald-100/90">{submitSuccess.message}</p>
                  </div>
                </div>
              )}

              {submitError && (
                <div
                  role="alert"
                  className="rounded-xl bg-rose-500/15 border border-rose-400/40 p-4 flex items-start gap-3 text-sm text-rose-200"
                >
                  <AlertCircle
                    className="w-5 h-5 text-rose-300 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <div className="font-semibold text-white">Envoi impossible</div>
                    <p className="mt-1">{submitError}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="contact-fullName"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Nom complet <span className="text-[#00CFFF]">*</span>
                  </label>
                  <input
                    id="contact-fullName"
                    name="fullName"
                    type="text"
                    required
                    autoComplete="name"
                    value={values.fullName}
                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                    placeholder="Ex. Camille Laurent"
                    aria-invalid={Boolean(errors.fullName)}
                    className="w-full rounded-xl bg-[#020817]/90 border border-[#006BFF]/35 px-4 py-3 text-sm text-white placeholder:text-[#B9C7DC]/50 focus:border-[#00CFFF] focus:outline-none min-h-[44px]"
                  />
                  {errors.fullName && (
                    <p className="mt-1.5 text-xs text-rose-300">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Adresse e-mail <span className="text-[#00CFFF]">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={values.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    placeholder="vous@entreprise.fr"
                    aria-invalid={Boolean(errors.email)}
                    className="w-full rounded-xl bg-[#020817]/90 border border-[#006BFF]/35 px-4 py-3 text-sm text-white placeholder:text-[#B9C7DC]/50 focus:border-[#00CFFF] focus:outline-none min-h-[44px]"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-rose-300">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="contact-company"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Entreprise <span className="text-[#00CFFF]">*</span>
                  </label>
                  <input
                    id="contact-company"
                    name="company"
                    type="text"
                    required
                    autoComplete="organization"
                    value={values.company}
                    onChange={(e) => handleFieldChange('company', e.target.value)}
                    placeholder="Nom de votre société ou cabinet"
                    aria-invalid={Boolean(errors.company)}
                    className="w-full rounded-xl bg-[#020817]/90 border border-[#006BFF]/35 px-4 py-3 text-sm text-white placeholder:text-[#B9C7DC]/50 focus:border-[#00CFFF] focus:outline-none min-h-[44px]"
                  />
                  {errors.company && (
                    <p className="mt-1.5 text-xs text-rose-300">{errors.company}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-projectType"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Type de projet <span className="text-[#00CFFF]">*</span>
                  </label>
                  <select
                    id="contact-projectType"
                    name="projectType"
                    value={values.projectType}
                    onChange={(e) => handleFieldChange('projectType', e.target.value)}
                    aria-invalid={Boolean(errors.projectType)}
                    className="w-full rounded-xl bg-[#020817]/90 border border-[#006BFF]/35 px-4 py-3 text-sm text-white focus:border-[#00CFFF] focus:outline-none min-h-[44px]"
                  >
                    {PROJECT_TYPES.map((type) => (
                      <option key={type} value={type} className="bg-[#020817] text-white">
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.projectType && (
                    <p className="mt-1.5 text-xs text-rose-300">{errors.projectType}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-budget"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Budget estimé <span className="text-[#00CFFF]">*</span>
                </label>
                <select
                  id="contact-budget"
                  name="budget"
                  value={values.budget}
                  onChange={(e) => handleFieldChange('budget', e.target.value)}
                  aria-invalid={Boolean(errors.budget)}
                  className="w-full rounded-xl bg-[#020817]/90 border border-[#006BFF]/35 px-4 py-3 text-sm text-white focus:border-[#00CFFF] focus:outline-none min-h-[44px]"
                >
                  {BUDGET_RANGES.map((range) => (
                    <option key={range} value={range} className="bg-[#020817] text-white">
                      {range}
                    </option>
                  ))}
                </select>
                {errors.budget && (
                  <p className="mt-1.5 text-xs text-rose-300">{errors.budget}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-description"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Description du projet <span className="text-[#00CFFF]">*</span>
                </label>
                <textarea
                  id="contact-description"
                  name="description"
                  rows={4}
                  required
                  value={values.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="Précisez votre activité, vos objectifs principaux, le nombre de pages estimé ou l'URL de votre site actuel..."
                  aria-invalid={Boolean(errors.description)}
                  className="w-full rounded-xl bg-[#020817]/90 border border-[#006BFF]/35 px-4 py-3 text-sm text-white placeholder:text-[#B9C7DC]/50 focus:border-[#00CFFF] focus:outline-none"
                />
                {errors.description && (
                  <p className="mt-1.5 text-xs text-rose-300">{errors.description}</p>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-[#B9C7DC]/80">
                  Vos données servent uniquement à répondre à votre demande.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#006BFF] to-[#00CFFF] shadow-[0_0_24px_rgba(0,107,255,0.45)] hover:shadow-[0_0_32px_rgba(0,207,255,0.65)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap shrink-0 min-h-[46px]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Envoyer ma demande</span>
                      <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
