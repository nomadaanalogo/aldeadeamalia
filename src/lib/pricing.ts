import { addDaysISO } from './date';
import type { SeasonRate } from './types';

/** Tarifa de una noche puntual, o null si esa fecha no tiene temporada cargada. */
export function getNightlyRate(iso: string, seasons: SeasonRate[]): number | null {
  const season = seasons.find((s) => iso >= s.start && iso <= s.end);
  return season ? season.pricePerNight : null;
}

/**
 * Tarifa de cada noche entre checkIn (incl.) y checkOut (excl., no se cobra).
 * Si alguna noche cae fuera de las temporadas cargadas, devuelve null: no hay
 * que inventar un precio, hay que pedir que se consulte por WhatsApp.
 */
export function getStayRates(checkIn: string, checkOut: string, seasons: SeasonRate[]): number[] | null {
  const rates: number[] = [];
  let cursor = checkIn;
  while (cursor < checkOut) {
    const rate = getNightlyRate(cursor, seasons);
    if (rate === null) return null;
    rates.push(rate);
    cursor = addDaysISO(cursor, 1);
  }
  return rates;
}
