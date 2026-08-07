import type { DateRange } from './types';

// Todas las fechas de esta app se representan como string ISO "yyyy-mm-dd".
// Al ser un formato de ancho fijo, se pueden comparar con < <= > >= como si
// fueran fechas reales, sin necesidad de instanciar Date para cada comparación.

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d + days);
  return toISODate(date);
}

export function diffNights(checkIn: string, checkOut: string): number {
  const [y1, m1, d1] = checkIn.split('-').map(Number);
  const [y2, m2, d2] = checkOut.split('-').map(Number);
  const start = new Date(y1, m1 - 1, d1);
  const end = new Date(y2, m2 - 1, d2);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((end.getTime() - start.getTime()) / msPerDay);
}

export function isDateBusy(iso: string, busy: DateRange[]): boolean {
  return busy.some((range) => iso >= range.start && iso < range.end);
}

/** ¿El rango [checkIn, checkOut) pisa alguna fecha ocupada? */
export function rangeHasConflict(checkIn: string, checkOut: string, busy: DateRange[]): boolean {
  return busy.some((range) => range.start < checkOut && range.end > checkIn);
}

const MONTH_LABELS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const WEEKDAY_LABELS = ['lu', 'ma', 'mi', 'ju', 'vi', 'sá', 'do'];

export function monthLabel(year: number, month: number): string {
  return `${MONTH_LABELS[month]} ${year}`;
}

export function weekdayLabels(): string[] {
  return WEEKDAY_LABELS;
}

export interface CalendarDay {
  iso: string;
  dayOfMonth: number;
  inCurrentMonth: boolean;
}

/** Genera la grilla de un mes (semanas de lunes a domingo), incluyendo días de relleno de meses adyacentes. */
export function buildMonthGrid(year: number, month: number): CalendarDay[] {
  const firstOfMonth = new Date(year, month, 1);
  // getDay(): 0=domingo..6=sábado -> lo convertimos a offset lunes=0..domingo=6
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const days: CalendarDay[] = [];

  for (let i = 0; i < totalCells; i++) {
    const dayOffset = i - firstWeekday + 1;
    const date = new Date(year, month, dayOffset);
    days.push({
      iso: toISODate(date),
      dayOfMonth: date.getDate(),
      inCurrentMonth: date.getMonth() === month,
    });
  }

  return days;
}

export function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
