interface Env {
  CONTACT_WEBHOOK_URL?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body = (await context.request.json()) as Record<string, unknown>;
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const company = typeof body.company === 'string' ? body.company.trim() : '';
    const projectType = typeof body.projectType === 'string' ? body.projectType.trim() : '';
    const budget = typeof body.budget === 'string' ? body.budget.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';

    const errors: Record<string, string> = {};
    if (fullName.length < 2) errors.fullName = 'Nom complet requis (min. 2 caractères).';
    if (!EMAIL_REGEX.test(email)) errors.email = 'Adresse e-mail invalide.';
    if (company.length < 2) errors.company = 'Nom de votre entreprise requis.';
    if (!projectType) errors.projectType = 'Type de projet requis.';
    if (!budget) errors.budget = 'Budget estimé requis.';
    if (description.length < 20) errors.description = 'Description requise (min. 20 caractères).';

    if (Object.keys(errors).length > 0) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Validation échouée.', errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!context.env.CONTACT_WEBHOOK_URL) {
      return new Response(
        JSON.stringify({
          ok: false,
          message:
            'Aucun connecteur webhook configuré dans Cloudflare Pages (CONTACT_WEBHOOK_URL). Utilisez Cal.com pour réserver directement.',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const record = {
      id: `ZD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      receivedAt: new Date().toISOString(),
      fullName,
      email,
      company,
      projectType,
      budget,
      description,
    };

    const webhookUrl = context.env.CONTACT_WEBHOOK_URL.trim();
    const lowerUrl = webhookUrl.toLowerCase();
    let payloadBody: Record<string, unknown> = record;

    if (
      lowerUrl.includes('discord.com/api/webhooks/') ||
      lowerUrl.includes('discordapp.com/api/webhooks/')
    ) {
      payloadBody = {
        content: `Nouvelle demande Zenin Digital (${record.id}) — ${record.fullName} (${record.company})`,
        embeds: [
          {
            title: `${record.projectType} — ${record.budget}`,
            description: record.description,
            fields: [
              { name: 'Nom', value: record.fullName, inline: true },
              { name: 'E-mail', value: record.email, inline: true },
              { name: 'Entreprise', value: record.company, inline: true },
            ],
            timestamp: record.receivedAt,
          },
        ],
      };
    } else if (lowerUrl.includes('hooks.slack.com/')) {
      payloadBody = {
        text: `Nouvelle demande Zenin Digital (${record.id}) : ${record.fullName} (${record.company}) — ${record.projectType} [${record.budget}] — ${record.email}\n${record.description}`,
        ...record,
      };
    }

    const forwardRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadBody),
      signal: AbortSignal.timeout(8000),
    });

    if (!forwardRes.ok) {
      throw new Error(`Webhook status ${forwardRes.status}`);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        id: record.id,
        receivedAt: record.receivedAt,
        webhookDelivered: true,
        message: 'Votre demande a bien été transmise.',
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({
        ok: false,
        message: "Erreur lors de l'envoi. Réservez votre diagnostic via Cal.com.",
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
