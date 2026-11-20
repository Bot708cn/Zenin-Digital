import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ContactPayload {
  fullName: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  description: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATA_DIR = path.resolve(__dirname, 'data');
const REQUESTS_FILE = path.join(DATA_DIR, 'contact-requests.json');

function validateContactPayload(body: unknown): {
  valid: boolean;
  errors: Record<string, string>;
  data?: ContactPayload;
} {
  if (!body || typeof body !== 'object') {
    return { valid: false, errors: { form: 'Requête invalide.' } };
  }

  const raw = body as Record<string, unknown>;
  const fullName = typeof raw.fullName === 'string' ? raw.fullName.trim() : '';
  const email = typeof raw.email === 'string' ? raw.email.trim() : '';
  const company = typeof raw.company === 'string' ? raw.company.trim() : '';
  const projectType = typeof raw.projectType === 'string' ? raw.projectType.trim() : '';
  const budget = typeof raw.budget === 'string' ? raw.budget.trim() : '';
  const description = typeof raw.description === 'string' ? raw.description.trim() : '';

  const errors: Record<string, string> = {};

  if (fullName.length < 2) {
    errors.fullName = 'Veuillez renseigner votre nom complet (minimum 2 caractères).';
  }
  if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Veuillez saisir une adresse e-mail valide.';
  }
  if (company.length < 2) {
    errors.company = 'Veuillez indiquer le nom de votre entreprise ou activité.';
  }
  if (!projectType) {
    errors.projectType = 'Veuillez sélectionner un type de projet.';
  }
  if (!budget) {
    errors.budget = 'Veuillez sélectionner une tranche de budget estimé.';
  }
  if (description.length < 20) {
    errors.description = 'Décrivez votre besoin en quelques phrases (minimum 20 caractères).';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    data: { fullName, email, company, projectType, budget, description },
  };
}

interface ContactRecord extends ContactPayload {
  id: string;
  receivedAt: string;
}

async function persistInquiry(entry: ContactRecord) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  let existing: Array<ContactRecord | Record<string, unknown>> = [];
  try {
    const raw = await fs.readFile(REQUESTS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      existing = parsed as Array<Record<string, unknown>>;
    }
  } catch {
    existing = [];
  }
  existing.push(entry);
  await fs.writeFile(REQUESTS_FILE, JSON.stringify(existing, null, 2), 'utf8');
}

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '64kb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    const webhookConfigured = Boolean(process.env.CONTACT_WEBHOOK_URL?.trim());
    res.json({
      ok: true,
      service: 'zenin-digital-api',
      webhookConfigured,
      timestamp: new Date().toISOString(),
    });
  });

  app.post('/api/contact', async (req: Request, res: Response) => {
    const validation = validateContactPayload(req.body);
    if (!validation.valid || !validation.data) {
      res.status(400).json({
        ok: false,
        message: 'Certains champs nécessitent votre attention.',
        errors: validation.errors,
      });
      return;
    }

    const id = `ZD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const receivedAt = new Date().toISOString();
    const record = { id, receivedAt, ...validation.data };

    try {
      await persistInquiry(record);

      let deliveryMode = 'recorded_on_server';
      let webhookDelivered = false;
      const webhookUrl = process.env.CONTACT_WEBHOOK_URL?.trim();

      if (webhookUrl) {
        try {
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

          const webhookRes = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadBody),
            signal: AbortSignal.timeout(8000),
          });

          if (webhookRes.ok) {
            deliveryMode = 'webhook_and_server';
            webhookDelivered = true;
          } else {
            deliveryMode = 'recorded_on_server_webhook_failed';
            console.error(`Webhook returned HTTP ${webhookRes.status}`);
          }
        } catch (webhookErr) {
          deliveryMode = 'recorded_on_server_webhook_failed';
          console.error('Webhook request failed:', webhookErr);
        }
      }

      res.status(201).json({
        ok: true,
        id,
        receivedAt,
        deliveryMode,
        webhookDelivered,
        message: 'Votre demande a bien été enregistrée par notre serveur.',
      });
    } catch (error) {
      console.error('Error saving contact inquiry:', error);
      res.status(500).json({
        ok: false,
        message:
          "Impossible d'enregistrer votre demande pour le moment. Vous pouvez réserver un diagnostic directement via Cal.com.",
      });
    }
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir, { index: false }));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Zenin Digital server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
