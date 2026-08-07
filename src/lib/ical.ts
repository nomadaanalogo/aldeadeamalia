import type { DateRange } from './types';

/**
 * Parser de iCal minimalista y sin dependencias (compatible con el runtime de
 * Cloudflare Workers, que no tiene APIs de Node como `fs`).
 *
 * Solo nos interesan los VEVENT con DTSTART/DTEND en formato de fecha
 * (VALUE=DATE), que es lo que exporta Booking.com para marcar rangos
 * ocupados/bloqueados. Se ignora todo lo demás (SUMMARY, UID, RRULE, etc).
 */
export function parseBusyRanges(icsText: string): DateRange[] {
  const lines = unfoldLines(icsText);
  const ranges: DateRange[] = [];

  let inEvent = false;
  let start: string | null = null;
  let end: string | null = null;

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      start = null;
      end = null;
      continue;
    }
    if (line === 'END:VEVENT') {
      if (inEvent && start && end) {
        ranges.push({ start, end });
      }
      inEvent = false;
      continue;
    }
    if (!inEvent) continue;

    if (line.startsWith('DTSTART')) {
      start = extractDate(line);
    } else if (line.startsWith('DTEND')) {
      end = extractDate(line);
    }
  }

  return mergeOverlapping(ranges);
}

/** RFC 5545: las líneas largas vienen "plegadas" con un salto + espacio/tab al inicio de la continuación. */
function unfoldLines(icsText: string): string[] {
  const rawLines = icsText.split(/\r\n|\n|\r/);
  const unfolded: string[] = [];

  for (const line of rawLines) {
    if ((line.startsWith(' ') || line.startsWith('\t')) && unfolded.length > 0) {
      unfolded[unfolded.length - 1] += line.slice(1);
    } else {
      unfolded.push(line);
    }
  }

  return unfolded;
}

/** "DTSTART;VALUE=DATE:20261204" -> "2026-12-04" */
function extractDate(line: string): string | null {
  const value = line.split(':')[1]?.trim();
  if (!value) return null;

  const match = value.match(/^(\d{4})(\d{2})(\d{2})/);
  if (!match) return null;

  const [, year, month, day] = match;
  return `${year}-${month}-${day}`;
}

/** Combina rangos solapados o contiguos para simplificar lo que consume el calendario. */
function mergeOverlapping(ranges: DateRange[]): DateRange[] {
  if (ranges.length <= 1) return ranges;

  const sorted = [...ranges].sort((a, b) => a.start.localeCompare(b.start));
  const merged: DateRange[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    if (current.start <= last.end) {
      if (current.end > last.end) last.end = current.end;
    } else {
      merged.push({ ...current });
    }
  }

  return merged;
}
