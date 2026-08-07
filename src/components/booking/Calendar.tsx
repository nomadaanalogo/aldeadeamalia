import { buildMonthGrid, isDateBusy, monthLabel, weekdayLabels } from '../../lib/date';
import { getNightlyRate } from '../../lib/pricing';
import type { DateRange, SeasonRate } from '../../lib/types';

interface CalendarProps {
  year: number;
  month: number; // 0-indexed
  onNavigate: (direction: -1 | 1) => void;
  busy: DateRange[];
  minDate: string;
  checkIn: string | null;
  checkOut: string | null;
  onSelectDate: (iso: string) => void;
  seasons: SeasonRate[];
}

export default function Calendar({
  year,
  month,
  onNavigate,
  busy,
  minDate,
  checkIn,
  checkOut,
  onSelectDate,
  seasons,
}: CalendarProps) {
  const days = buildMonthGrid(year, month);

  return (
    <div className="select-none">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate(-1)}
          aria-label="Mes anterior"
          className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
        >
          ‹
        </button>
        <p className="text-sm font-medium capitalize tracking-wide text-stone-900">
          {monthLabel(year, month)}
        </p>
        <button
          type="button"
          onClick={() => onNavigate(1)}
          aria-label="Mes siguiente"
          className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {weekdayLabels().map((label) => (
          <span key={label} className="pb-1 text-[11px] font-medium uppercase tracking-wide text-stone-400">
            {label}
          </span>
        ))}

        {days.map((day) => {
          const disabled = !day.inCurrentMonth || day.iso < minDate || isDateBusy(day.iso, busy);
          const isCheckIn = day.iso === checkIn;
          const isCheckOut = day.iso === checkOut;
          const inRange = !!checkIn && !!checkOut && day.iso > checkIn && day.iso < checkOut;
          const isEdge = isCheckIn || isCheckOut;
          const rate = day.inCurrentMonth ? getNightlyRate(day.iso, seasons) : null;

          return (
            <div key={day.iso} className={inRange ? 'bg-stone-100' : isCheckIn && checkOut ? 'bg-stone-100 rounded-l-full' : isCheckOut ? 'bg-stone-100 rounded-r-full' : ''}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelectDate(day.iso)}
                aria-label={day.iso}
                aria-pressed={isEdge}
                className={[
                  'flex h-12 w-10 flex-col items-center justify-center gap-0.5 rounded-full text-sm transition mx-auto',
                  !day.inCurrentMonth ? 'invisible' : '',
                  disabled && day.inCurrentMonth ? 'cursor-not-allowed text-stone-300 line-through' : '',
                  !disabled && !isEdge ? 'text-stone-700 hover:bg-stone-200' : '',
                  isEdge ? 'bg-stone-900 text-white hover:bg-stone-900' : '',
                ].join(' ')}
              >
                <span>{day.dayOfMonth}</span>
                {rate !== null && (
                  <span
                    className={[
                      'text-[9px] font-normal leading-none',
                      isEdge ? 'text-white/80' : disabled ? 'text-stone-300' : 'text-sky-600',
                    ].join(' ')}
                  >
                    ${rate}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
