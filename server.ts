import 'dotenv/config';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import dns from 'node:dns/promises';
import net from 'node:net';
import { Agent, fetch as undiciFetch } from 'undici';

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

const FIELD_LIMITS = {
  fullNameMin: 2,
  fullNameMax: 120,
  emailMax: 254,
  companyMin: 2,
  companyMax: 150,
  projectTypeMax: 120,
  budgetMax: 100,
  descriptionMin: 20,
  descriptionMax: 5000,
} as const;

function isBlockedIpv4Octets(octets: number[]): boolean {
  if (octets.length !== 4 || octets.some((o) => !Number.isInteger(o) || o < 0 || o > 255)) {
    return true;
  }
  const [a, b, c] = octets;

  if (a === 0) return true; // 0.0.0.0/8
  if (a === 10) return true; // 10.0.0.0/8 (RFC 1918)
  if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 (CGNAT)
  if (a === 127) return true; // 127.0.0.0/8 (Loopback)
  if (a === 169 && b === 254) return true; // 169.254.0.0/16 (Link-local & Metadata)
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12 (RFC 1918)
  if (a === 192 && b === 0 && c === 0) return true; // 192.0.0.0/24
  if (a === 192 && b === 0 && c === 2) return true; // 192.0.2.0/24 (TEST-NET-1)
  if (a === 192 && b === 168) return true; // 192.168.0.0/16 (RFC 1918)
  if (a === 198 && (b === 18 || b === 19)) return true; // 198.18.0.0/15 (Benchmark)
  if (a === 198 && b === 51 && c === 100) return true; // 198.51.100.0/24 (TEST-NET-2)
  if (a === 203 && b === 0 && c === 113) return true; // 203.0.113.0/24 (TEST-NET-3)
  if (a >= 224) return true; // 224.0.0.0/4 Multicast & 240.0.0.0/4 Reserved/Broadcast

  return false;
}

function expandIpv6Words(rawIpv6: string): number[] | null {
  const clean = rawIpv6.split('%')[0].toLowerCase().trim();
  if (!clean) return null;

  let expandedStr = clean;
  const lastColon = clean.lastIndexOf(':');
  const tail = lastColon !== -1 ? clean.slice(lastColon + 1) : '';
  if (tail.includes('.')) {
    const v4Parts = tail.split('.').map(Number);
    if (v4Parts.length !== 4 || v4Parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
      return null;
    }
    const hi = ((v4Parts[0] << 8) | v4Parts[1]).toString(16);
    const lo = ((v4Parts[2] << 8) | v4Parts[3]).toString(16);
    expandedStr = `${clean.slice(0, lastColon + 1)}${hi}:${lo}`;
  }

  const parts = expandedStr.split('::');
  if (parts.length > 2) return null;

  const headGroups = parts[0] ? parts[0].split(':') : [];
  const tailGroups = parts.length === 2 && parts[1] ? parts[1].split(':') : [];
  const missing = 8 - (headGroups.length + tailGroups.length);

  if (parts.length === 1 && headGroups.length !== 8) return null;
  if (parts.length === 2 && missing < 0) return null;

  const allGroups =
    parts.length === 2
      ? [...headGroups, ...Array(missing).fill('0'), ...tailGroups]
      : headGroups;

  if (allGroups.length !== 8) return null;

  const words: number[] = [];
  for (const g of allGroups) {
    if (!/^[0-9a-f]{1,4}$/.test(g)) return null;
    words.push(parseInt(g, 16));
  }
  return words;
}

function isBlockedIpAddress(rawIp: string): boolean {
  const clean = rawIp.replace(/^\[|\]$/g, '').split('%')[0].trim();
  const ipVersion = net.isIP(clean);

  if (ipVersion === 4) {
    return isBlockedIpv4Octets(clean.split('.').map(Number));
  }

  if (ipVersion === 6) {
    const w = expandIpv6Words(clean);
    if (!w) return true;

    const isAllZeroExceptLast = w.slice(0, 7).every((x) => x === 0);
    if (isAllZeroExceptLast && (w[7] === 0 || w[7] === 1)) return true; // :: & ::1

    if (w[0] === 0 && w[1] === 0 && w[2] === 0 && w[3] === 0 && w[4] === 0 && (w[5] === 0xffff || w[5] === 0)) {
      const embeddedV4 = [(w[6] >> 8) & 0xff, w[6] & 0xff, (w[7] >> 8) & 0xff, w[7] & 0xff];
      return isBlockedIpv4Octets(embeddedV4);
    }

    if (w[0] === 0x0064 && w[1] === 0xff9b) return true; // NAT64
    if (w[0] === 0x0100 && w[1] === 0 && w[2] === 0 && w[3] === 0) return true; // Discard
    if (w[0] === 0x2001 && w[1] === 0x0000) return true; // Teredo
    if (w[0] === 0x2001 && w[1] === 0x0db8) return true; // Docs
    if (w[0] === 0x2002) return true; // 6to4
    if ((w[0] & 0xfe00) === 0xfc00) return true; // ULA
    if ((w[0] & 0xffc0) === 0xfe80) return true; // Link-local
    if ((w[0] & 0xffc0) === 0xfec0) return true; // Site-local
    if ((w[0] & 0xff00) === 0xff00) return true; // Multicast

    return false;
  }

  return true;
}

interface SafeWebhookTarget {
  url: string;
  pinnedAddress: string;
  pinnedFamily: 4 | 6;
}

async function isSafeWebhookUrl(rawUrl: string): Promise<SafeWebhookTarget | null> {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'https:') return null;
    if (parsed.username || parsed.password) return null;
    if (parsed.port && parsed.port !== '443') return null;

    const host = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.+$/, '');
    if (!host) return null;

    if (
      host === 'localhost' ||
      host.endsWith('.localhost') ||
      host.endsWith('.local') ||
      host.endsWith('.internal') ||
      host.endsWith('.localdomain') ||
      host.endsWith('.home.arpa')
    ) {
      return null;
    }

    const literalVersion = net.isIP(host);
    if (literalVersion !== 0) {
      if (isBlockedIpAddress(host)) return null;
      return {
        url: parsed.toString(),
        pinnedAddress: host,
        pinnedFamily: literalVersion as 4 | 6,
      };
    }

    const resolved = await dns.lookup(host, { all: true });
    if (!resolved || resolved.length === 0) return null;

    for (const entry of resolved) {
      if (isBlockedIpAddress(entry.address)) {
        return null;
      }
    }

    const preferred = resolved.find((r) => r.family === 4) || resolved[0];
    return {
      url: parsed.toString(),
      pinnedAddress: preferred.address,
      pinnedFamily: (preferred.family === 6 ? 6 : 4) as 4 | 6,
    };
  } catch {
    return null;
  }
}

function validateContactPayload(body: unknown): {
  valid: boolean;
  errors: Record<string, string>;
  data?: ContactPayload;
} {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
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

  if (fullName.length < FIELD_LIMITS.fullNameMin) {
    errors.fullName = 'Veuillez renseigner votre nom complet (minimum 2 caractères).';
  } else if (fullName.length > FIELD_LIMITS.fullNameMax) {
    errors.fullName = `Le nom complet ne peut pas dépasser ${FIELD_LIMITS.fullNameMax} caractères.`;
  }

  if (!EMAIL_REGEX.test(email) || email.length > FIELD_LIMITS.emailMax) {
    errors.email = 'Veuillez saisir une adresse e-mail valide.';
  }

  if (company.length < FIELD_LIMITS.companyMin) {
    errors.company = 'Veuillez indiquer le nom de votre entreprise ou activité.';
  } else if (company.length > FIELD_LIMITS.companyMax) {
    errors.company = `Le nom d'entreprise ne peut pas dépasser ${FIELD_LIMITS.companyMax} caractères.`;
  }

  if (!projectType || projectType.length > FIELD_LIMITS.projectTypeMax) {
    errors.projectType = 'Veuillez sélectionner un type de projet valide.';
  }

  if (!budget || budget.length > FIELD_LIMITS.budgetMax) {
    errors.budget = 'Veuillez sélectionner une tranche de budget estimé valide.';
  }

  if (description.length < FIELD_LIMITS.descriptionMin) {
    errors.description = 'Décrivez votre besoin en quelques phrases (minimum 20 caractères).';
  } else if (description.length > FIELD_LIMITS.descriptionMax) {
    errors.description = `La description ne peut pas dépasser ${FIELD_LIMITS.descriptionMax} caractères.`;
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
  const isProduction = process.env.NODE_ENV === 'production';

  app.disable('x-powered-by');

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), interest-cohort=()'
    );

    if (isProduction) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    }

    if (req.path.startsWith('/api/')) {
      res.setHeader('Cache-Control', 'no-store, max-age=0');
    }

    next();
  });

  app.use(express.json({ limit: '32kb' }));

  app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
    const e = err as { type?: string; status?: number };
    if (e?.type === 'entity.too.large' || e?.status === 413) {
      res.status(413).json({
        ok: false,
        message: 'Requête trop volumineuse (limite de 32 Ko dépassée).',
      });
      return;
    }
    if (e?.type === 'entity.parse.failed' || (err instanceof SyntaxError && e?.status === 400)) {
      res.status(400).json({
        ok: false,
        message: 'Format JSON invalide.',
      });
      return;
    }
    next(err);
  });

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
        const safeTarget = await isSafeWebhookUrl(webhookUrl);
        if (!safeTarget) {
          deliveryMode = 'recorded_on_server_invalid_webhook';
          console.error('Configured CONTACT_WEBHOOK_URL rejected by SSRF safety check');
        } else {
          const pinnedAgent = new Agent({
            connect: {
              lookup: (_hostname, options, callback) => {
                if (options && typeof options === 'object' && options.all) {
                  callback(null, [
                    { address: safeTarget.pinnedAddress, family: safeTarget.pinnedFamily },
                  ]);
                  return;
                }
                callback(null, safeTarget.pinnedAddress, safeTarget.pinnedFamily);
              },
            },
          });

          try {
            const lowerUrl = safeTarget.url.toLowerCase();
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

            const webhookRes = await undiciFetch(safeTarget.url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payloadBody),
              redirect: 'error',
              dispatcher: pinnedAgent,
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
          } finally {
            await pinnedAgent.close().catch(() => {});
          }
        }
      }

      res.status(201).json({
        ok: true,
        id,
        receivedAt,
        deliveryMode,
        webhookDelivered,
        message: 'Votre demande a bien été transmise par notre serveur.',
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
