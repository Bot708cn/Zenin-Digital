export async function GET() {
  const webhookConfigured = Boolean(process.env.CONTACT_WEBHOOK_URL?.trim());
  return new Response(
    JSON.stringify({
      ok: true,
      service: 'zenin-digital-api',
      webhookConfigured,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
      },
    }
  );
}
