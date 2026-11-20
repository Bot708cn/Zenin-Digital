import { useEffect, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  Mail,
  X,
} from 'lucide-react';
import type { ServiceOffer } from '../data/offers';
import { siteConfig } from '../config/siteConfig';

interface OfferQuoteModalProps {
  offer: ServiceOffer | null;
  onClose: () => void;
  onUseMainContactForm?: (offer: ServiceOffer) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface QuoteSubmissionResult {
  mode: 'webhook_sent' | 'prepared_local';
  referenceId: string;
  summaryText: string;
  mailtoHref: string;
  notice: string;
}

export function OfferQuoteModal({
  offer,
  onClose,
  onUseMainContactForm,
}: OfferQuoteModalProps) {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [company, setCompany] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [errors, setErrors] = useState<{
    clientName?: string;
    clientEmail?: string;
    projectDescription?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<QuoteSubmissionResult | null>(null);

  useEffect(() => {
    if (!offer) return;
    setResult(null);
    setErrors({});
    setCopied(false);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [offer, onClose]);

  const buildPreparedSummary = (targetOffer: ServiceOffer) => {
    const lines = [
      `Demande de devis — Zenin Digital`,
      `Offre sélectionnée : ${targetOffer.title} (${targetOffer.priceLabel} · ${targetOffer.monthlyLabel})`,
      `Nom du client : ${clientName.trim()}`,
      `Email : ${clientEmail.trim()}`,
      ...(company.trim() ? [`Entreprise / Activité : ${company.trim()}`] : []),
      `Description du projet :`,
      projectDescription.trim(),
    ];
    return lines.join('\n');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!offer) return;

    const nextErrors: typeof errors = {};
    if (clientName.trim().length < 2) {
      nextErrors.clientName = 'Veuillez saisir votre nom complet (min. 2 caractères).';
    }
    if (!EMAIL_REGEX.test(clientEmail.trim())) {
      nextErrors.clientEmail = 'Veuillez indiquer une adresse e-mail valide.';
    }
    if (projectDescription.trim().length < 20) {
      nextErrors.projectDescription =
        'Merci de décrire votre projet en quelques phrases (minimum 20 caractères).';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    const summaryText = buildPreparedSummary(offer);
    const mailtoSubject = encodeURIComponent(
      `Demande de devis ${offer.title} (${offer.priceLabel}) — ${clientName.trim()}`
    );
    const mailtoBody = encodeURIComponent(summaryText);
    const mailtoHref = `mailto:${siteConfig.contactEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

    try {
      const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT || '/api/contact';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: clientName.trim(),
          email: clientEmail.trim(),
          company: company.trim() || 'Non précisée',
          projectType: `${offer.title} (${offer.priceLabel} / ${offer.monthlyLabel})`,
          budget: `${offer.priceLabel} (${offer.monthlyLabel})`,
          description: projectDescription.trim(),
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      const payload = contentType.includes('application/json')
        ? ((await response.json()) as {
            ok?: boolean;
            id?: string;
            webhookDelivered?: boolean;
          })
        : null;

      if (response.ok && payload?.ok && payload.webhookDelivered) {
        setResult({
          mode: 'webhook_sent',
          referenceId: payload.id || 'CONFIRMÉ',
          summaryText,
          mailtoHref,
          notice:
            'Votre demande de devis a bien été préparée et transmise à Zenin Digital via le webhook configuré.',
        });
      } else {
        // Ne jamais prétendre qu'un e-mail a été envoyé si aucun service backend d'envoi n'est actif
        setResult({
          mode: 'prepared_local',
          referenceId: payload?.id || 'BROUILLON',
          summaryText,
          mailtoHref,
          notice:
            "Votre demande de devis est prête, mais aucun service d'envoi e-mail automatique n'est actif pour la transmettre directement. Utilisez l'un des moyens ci-dessous (messagerie, copie du récapitulatif ou Cal.com).",
        });
      }
    } catch {
      setResult({
        mode: 'prepared_local',
        referenceId: 'BROUILLON',
        summaryText,
        mailtoHref,
        notice:
          "Votre demande de devis est préparée localement, mais le serveur d'envoi automatique est indisponible. Vous pouvez l'envoyer via votre messagerie, la copier ou réserver directement sur Cal.com.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.summaryText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <AnimatePresence>
      {offer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/85 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="offer-quote-modal-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl p-[1px] bg-gradient-to-b from-[#00CFFF]/60 via-[#0066FF]/50 to-[#702BFF]/60 shadow-[0_24px_80px_rgba(0,102,255,0.4)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-[15px] bg-[#030712]/95 p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-[#00CFFF] bg-[#06132D] border border-[#00CFFF]/35">
                    Demande de devis · Offre {offer.title}
                  </span>
                  <h2
                    id="offer-quote-modal-title"
                    className="mt-2.5 text-2xl sm:text-[1.75rem] font-bold text-white"
                  >
                    Préparer votre devis {offer.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fermer la fenêtre de devis"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#06132D] border border-[#0066FF]/35 text-[#B9C7DC] hover:text-white hover:border-[#00CFFF] transition-colors shrink-0"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Récapitulatif automatique de l'offre sélectionnée et de son prix */}
              <div className="mt-5 rounded-xl bg-[#06132D]/85 border border-[#0066FF]/35 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-white">
                    {offer.title} — <span className="text-[#B9C7DC] font-normal">{offer.tagline}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#B9C7DC]">{offer.description}</p>
                </div>
                <div className="sm:text-right shrink-0">
                  <div className="text-xl font-extrabold text-white tabular-nums">
                    {offer.priceLabel}
                  </div>
                  <div className="text-xs font-semibold text-[#7C8BFF] tabular-nums">
                    {offer.monthlyLabel}
                  </div>
                </div>
              </div>

              {result ? (
                <div className="mt-6 space-y-5">
                  <div
                    role="status"
                    className={`rounded-xl p-4 flex items-start gap-3 text-sm border ${
                      result.mode === 'webhook_sent'
                        ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-100'
                        : 'bg-[#0066FF]/15 border-[#00CFFF]/40 text-[#E2ECFA]'
                    }`}
                  >
                    {result.mode === 'webhook_sent' ? (
                      <CheckCircle2
                        className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                    ) : (
                      <AlertCircle
                        className="w-5 h-5 text-[#00CFFF] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                    )}
                    <div>
                      <div className="font-semibold text-white">
                        {result.mode === 'webhook_sent'
                          ? `Demande transmise (${result.referenceId})`
                          : 'Demande de devis préparée'}
                      </div>
                      <p className="mt-1 text-xs sm:text-sm leading-relaxed opacity-90">
                        {result.notice}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#020617] border border-[#0066FF]/30 p-4">
                    <div className="text-xs font-semibold text-[#00CFFF] mb-2">
                      Récapitulatif préparé
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-[#D1DDF0] leading-relaxed">
                      {result.summaryText}
                    </pre>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-[#06132D] border border-[#0066FF]/45 hover:border-[#00CFFF] transition-colors min-h-[44px]"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                          <span>Récapitulatif copié</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-[#00CFFF]" aria-hidden="true" />
                          <span>Copier la demande</span>
                        </>
                      )}
                    </button>

                    <a
                      href={result.mailtoHref}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-[#06132D] border border-[#702BFF]/50 hover:border-[#00CFFF] transition-colors min-h-[44px]"
                    >
                      <Mail className="w-4 h-4 text-[#00CFFF]" aria-hidden="true" />
                      <span>Ouvrir dans ma messagerie</span>
                    </a>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setResult(null)}
                      className="text-xs sm:text-sm font-medium text-[#B9C7DC] hover:text-white transition-colors py-2"
                    >
                      Modifier ma demande
                    </button>

                    <a
                      href={siteConfig.calComUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#00CFFF] via-[#0066FF] to-[#702BFF] shadow-[0_0_24px_rgba(0,102,255,0.45)] min-h-[44px]"
                    >
                      <Calendar className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Réserver un appel Cal.com</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="quote-client-name"
                        className="block text-xs sm:text-sm font-medium text-white mb-1.5"
                      >
                        Nom complet <span className="text-[#00CFFF]">*</span>
                      </label>
                      <input
                        id="quote-client-name"
                        type="text"
                        required
                        autoComplete="name"
                        value={clientName}
                        onChange={(e) => {
                          setClientName(e.target.value);
                          if (errors.clientName) setErrors((p) => ({ ...p, clientName: undefined }));
                        }}
                        placeholder="Ex. Camille Laurent"
                        aria-invalid={Boolean(errors.clientName)}
                        className="w-full rounded-xl bg-[#020617] border border-[#0066FF]/40 px-3.5 py-2.5 text-sm text-white placeholder:text-[#B9C7DC]/45 focus:border-[#00CFFF] focus:outline-none min-h-[44px]"
                      />
                      {errors.clientName && (
                        <p className="mt-1 text-xs text-rose-300">{errors.clientName}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="quote-client-email"
                        className="block text-xs sm:text-sm font-medium text-white mb-1.5"
                      >
                        Adresse e-mail <span className="text-[#00CFFF]">*</span>
                      </label>
                      <input
                        id="quote-client-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={clientEmail}
                        onChange={(e) => {
                          setClientEmail(e.target.value);
                          if (errors.clientEmail) setErrors((p) => ({ ...p, clientEmail: undefined }));
                        }}
                        placeholder="vous@entreprise.fr"
                        aria-invalid={Boolean(errors.clientEmail)}
                        className="w-full rounded-xl bg-[#020617] border border-[#0066FF]/40 px-3.5 py-2.5 text-sm text-white placeholder:text-[#B9C7DC]/45 focus:border-[#00CFFF] focus:outline-none min-h-[44px]"
                      />
                      {errors.clientEmail && (
                        <p className="mt-1 text-xs text-rose-300">{errors.clientEmail}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="quote-client-company"
                      className="block text-xs sm:text-sm font-medium text-white mb-1.5"
                    >
                      Entreprise / Activité <span className="text-[#B9C7DC]/60">(optionnel)</span>
                    </label>
                    <input
                      id="quote-client-company"
                      type="text"
                      autoComplete="organization"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Ex. Cabinet, commerce, PME..."
                      className="w-full rounded-xl bg-[#020617] border border-[#0066FF]/40 px-3.5 py-2.5 text-sm text-white placeholder:text-[#B9C7DC]/45 focus:border-[#00CFFF] focus:outline-none min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="quote-project-description"
                      className="block text-xs sm:text-sm font-medium text-white mb-1.5"
                    >
                      Description de votre projet <span className="text-[#00CFFF]">*</span>
                    </label>
                    <textarea
                      id="quote-project-description"
                      rows={4}
                      required
                      value={projectDescription}
                      onChange={(e) => {
                        setProjectDescription(e.target.value);
                        if (errors.projectDescription) {
                          setErrors((p) => ({ ...p, projectDescription: undefined }));
                        }
                      }}
                      placeholder="Décrivez votre activité, vos objectifs, les pages souhaitées ou le lien de votre site actuel..."
                      aria-invalid={Boolean(errors.projectDescription)}
                      className="w-full rounded-xl bg-[#020617] border border-[#0066FF]/40 px-3.5 py-2.5 text-sm text-white placeholder:text-[#B9C7DC]/45 focus:border-[#00CFFF] focus:outline-none"
                    />
                    {errors.projectDescription && (
                      <p className="mt-1 text-xs text-rose-300">{errors.projectDescription}</p>
                    )}
                  </div>

                  <div className="pt-2 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
                    {onUseMainContactForm ? (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onUseMainContactForm(offer);
                        }}
                        className="text-xs text-[#B9C7DC] hover:text-white transition-colors underline underline-offset-4 py-2"
                      >
                        Passer au formulaire complet
                      </button>
                    ) : (
                      <span />
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#00CFFF] via-[#0066FF] to-[#702BFF] shadow-[0_0_24px_rgba(0,102,255,0.45)] hover:shadow-[0_0_32px_rgba(0,207,255,0.65)] disabled:opacity-60 transition-all min-h-[46px]"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                          <span>Préparation...</span>
                        </>
                      ) : (
                        <>
                          <span>Préparer la demande de devis</span>
                          <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
