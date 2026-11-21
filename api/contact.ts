import crypto from 'node:crypto';
import dns from 'node:dns/promises';
import net from 'node:net';
import { Agent, fetch as undiciFetch } from 'undici';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_BODY_BYTES = 32 * 1024; // 32 Ko max

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

const API_SECURITY_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, max-age=0',
  'X-Content-Type-Options': 'nosniff',
};

function jsonResponse(payload: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: API_SECURITY_HEADERS,
  });
}

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
  // Convert trailing embedded IPv4 (e.g. ::ffff:127.0.0.1) to 2 hex groups
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

    // ::ffff:0:0/96 (IPv4-mapped IPv6) & ::/96 (IPv4-compatible IPv6)
    if (w[0] === 0 && w[1] === 0 && w[2] === 0 && w[3] === 0 && w[4] === 0 && (w[5] === 0xffff || w[5] === 0)) {
      const embeddedV4 = [(w[6] >> 8) & 0xff, w[6] & 0xff, (w[7] >> 8) & 0xff, w[7] & 0xff];
      return isBlockedIpv4Octets(embeddedV4);
    }

    if (w[0] === 0x0064 && w[1] === 0xff9b) return true; // 64:ff9b::/96 & /48 (NAT64)
    if (w[0] === 0x0100 && w[1] === 0 && w[2] === 0 && w[3] === 0) return true; // 100::/64 (Discard)
    if (w[0] === 0x2001 && w[1] === 0x0000) return true; // 2001::/32 (Teredo)
    if (w[0] === 0x2001 && w[1] === 0x0db8) return true; // 2001:db8::/32 (Docs)
    if (w[0] === 0x2002) return true; // 2002::/16 (6to4)
    if ((w[0] & 0xfe00) === 0xfc00) return true; // fc00::/7 (ULA)
    if ((w[0] & 0xffc0) === 0xfe80) return true; // fe80::/10 (Link-local)
    if ((w[0] & 0xffc0) === 0xfec0) return true; // fec0::/10 (Site-local)
    if ((w[0] & 0xff00) === 0xff00) return true; // ff00::/8 (Multicast)

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

    // Bloquer tout domaine dont au moins une IP résolue est privée/locale/réservée
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

export async function POST(request: Request) {
  try {
    const declaredLength = Number(request.headers.get('content-length') || '0');
    if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
      return jsonResponse(
        { ok: false, message: 'Requête trop volumineuse (limite de 32 Ko dépassée).' },
        413
      );
    }

    const rawText = await request.text();
    const byteLength = new TextEncoder().encode(rawText).length;
    if (byteLength > MAX_BODY_BYTES) {
      return jsonResponse(
        { ok: false, message: 'Requête trop volumineuse (limite de 32 Ko dépassée).' },
        413
      );
    }

    let parsedBody: unknown;
    try {
      parsedBody = JSON.parse(rawText);
    } catch {
      return jsonResponse({ ok: false, message: 'Format JSON invalide.' }, 400);
    }

    if (!parsedBody || typeof parsedBody !== 'object' || Array.isArray(parsedBody)) {
      return jsonResponse({ ok: false, message: 'Corps de requête invalide.' }, 400);
    }

    const body = parsedBody as Record<string, unknown>;
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const company = typeof body.company === 'string' ? body.company.trim() : '';
    const projectType = typeof body.projectType === 'string' ? body.projectType.trim() : '';
    const budget = typeof body.budget === 'string' ? body.budget.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';

    const errors: Record<string, string> = {};
    if (fullName.length < FIELD_LIMITS.fullNameMin) {
      errors.fullName = 'Nom complet requis (min. 2 caractères).';
    } else if (fullName.length > FIELD_LIMITS.fullNameMax) {
      errors.fullName = `Nom complet trop long (max. ${FIELD_LIMITS.fullNameMax} caractères).`;
    }

    if (!EMAIL_REGEX.test(email) || email.length > FIELD_LIMITS.emailMax) {
      errors.email = 'Adresse e-mail invalide.';
    }

    if (company.length < FIELD_LIMITS.companyMin) {
      errors.company = 'Nom de votre entreprise requis.';
    } else if (company.length > FIELD_LIMITS.companyMax) {
      errors.company = `Nom d'entreprise trop long (max. ${FIELD_LIMITS.companyMax} caractères).`;
    }

    if (!projectType || projectType.length > FIELD_LIMITS.projectTypeMax) {
      errors.projectType = 'Type de projet invalide ou requis.';
    }

    if (!budget || budget.length > FIELD_LIMITS.budgetMax) {
      errors.budget = 'Budget estimé invalide ou requis.';
    }

    if (description.length < FIELD_LIMITS.descriptionMin) {
      errors.description = 'Description requise (min. 20 caractères).';
    } else if (description.length > FIELD_LIMITS.descriptionMax) {
      errors.description = `Description trop longue (max. ${FIELD_LIMITS.descriptionMax} caractères).`;
    }

    if (Object.keys(errors).length > 0) {
      return jsonResponse(
        { ok: false, message: 'Certains champs nécessitent votre attention.', errors },
        400
      );
    }

    const webhookUrl = process.env.CONTACT_WEBHOOK_URL?.trim();
    if (!webhookUrl) {
      return jsonResponse(
        {
          ok: false,
          message:
            'Variable CONTACT_WEBHOOK_URL non configurée dans Vercel. Utilisez Cal.com pour réserver directement.',
        },
        503
      );
    }

    const safeTarget = await isSafeWebhookUrl(webhookUrl);
    if (!safeTarget) {
      return jsonResponse(
        {
          ok: false,
          message:
            'Configuration webhook invalide côté serveur. Utilisez Cal.com pour réserver directement.',
        },
        500
      );
    }

    // Format JSON conservé à l'identique pour l'intégration Make / Discord / Slack
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

    // Épinglage strict de l'IP vérifiée via undici Agent (empêche le DNS rebinding) + redirect: 'error'
    const pinnedAgent = new Agent({
      connect: {
        lookup: (_hostname, options, callback) => {
          if (options && typeof options === 'object' && options.all) {
            callback(null, [{ address: safeTarget.pinnedAddress, family: safeTarget.pinnedFamily }]);
            return;
          }
          callback(null, safeTarget.pinnedAddress, safeTarget.pinnedFamily);
        },
      },
    });

    try {
      const forwardRes = await undiciFetch(safeTarget.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadBody),
        redirect: 'error',
        dispatcher: pinnedAgent,
        signal: AbortSignal.timeout(8000),
      });

      if (!forwardRes.ok) {
        throw new Error(`Webhook status ${forwardRes.status}`);
      }
    } finally {
      await pinnedAgent.close().catch(() => {});
    }

    return jsonResponse(
      {
        ok: true,
        id: record.id,
        receivedAt: record.receivedAt,
        deliveryMode: 'webhook',
        webhookDelivered: true,
        message: 'Votre demande a bien été transmise.',
      },
      201
    );
  } catch {
    return jsonResponse(
      {
        ok: false,
        message: "Erreur lors de l'envoi. Réservez votre diagnostic via Cal.com.",
      },
      500
    );
  }
}
