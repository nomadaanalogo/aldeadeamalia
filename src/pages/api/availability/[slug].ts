import type { APIRoute } from 'astro';
import { getPropertyBySlug } from '../../../config/properties';
import { parseBusyRanges } from '../../../lib/ical';

// Ruta dinámica: se ejecuta como función serverless en Cloudflare, no se pre-renderiza.
export const prerender = false;

const FETCH_TIMEOUT_MS = 10_000;
// Cuánto tiempo se puede servir la respuesta desde caché (CDN/navegador) antes de re-consultar Booking.
const CACHE_TTL_SECONDS = 1800; // 30 min

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;
  const property = slug ? getPropertyBySlug(slug) : undefined;

  if (!property) {
    return jsonResponse({ error: 'property_not_found' }, 404);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(property.icalUrl, {
      signal: controller.signal,
      headers: { Accept: 'text/calendar' },
      // Hint para el cache edge de Cloudflare (no-op fuera de ese runtime).
      cf: { cacheTtl: CACHE_TTL_SECONDS, cacheEverything: true },
    } as RequestInit);

    if (!response.ok) {
      throw new Error(`Booking respondió ${response.status}`);
    }

    const icsText = await response.text();
    const busy = parseBusyRanges(icsText);

    return jsonResponse(
      {
        slug: property.slug,
        updatedAt: new Date().toISOString(),
        busy,
      },
      200,
    );
  } catch (error) {
    // Degradación controlada: el widget sigue funcionando (sin bloquear fechas)
    // y la confirmación final siempre pasa por WhatsApp, así que no hay riesgo
    // de doble reserva por este fallback.
    return jsonResponse(
      {
        slug: property.slug,
        updatedAt: new Date().toISOString(),
        busy: [],
        warning: 'No se pudo verificar la disponibilidad en vivo. Confirmá por WhatsApp.',
      },
      200,
    );
  } finally {
    clearTimeout(timeout);
  }
};

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}, stale-while-revalidate=3600`,
    },
  });
}
