import { useEffect, useMemo, useState } from 'react';
import Calendar from './Calendar';
import {
  diffNights,
  formatDisplayDate,
  rangeHasConflict,
  todayISO,
} from '../../lib/date';
import { getStayRates } from '../../lib/pricing';
import type { DateRange, Property } from '../../lib/types';

interface BookingWidgetProps {
  properties: Property[];
  initialSlug?: string;
}

interface AvailabilityState {
  busy: DateRange[];
  loading: boolean;
  warning: string | null;
}

function formatPrice(amount: number, currency: string): string {
  if (currency === 'USD') return `US$ ${amount.toLocaleString('es-AR')}`;
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getStoredSlug(properties: Property[]): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const stored = sessionStorage.getItem('selected-property');
  return stored && properties.some((p) => p.slug === stored) ? stored : undefined;
}

export default function BookingWidget({ properties, initialSlug }: BookingWidgetProps) {
  const [selectedSlug, setSelectedSlug] = useState(
    () => getStoredSlug(properties) ?? initialSlug ?? properties[0]?.slug,
  );
  const property = useMemo(
    () => properties.find((p) => p.slug === selectedSlug) ?? properties[0],
    [properties, selectedSlug],
  );

  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [conflict, setConflict] = useState<string | null>(null);
  const [guests, setGuests] = useState(Math.min(2, property.capacity.guests));

  const today = useMemo(() => new Date(), []);
  const [baseYear, setBaseYear] = useState(today.getFullYear());
  const [baseMonth, setBaseMonth] = useState(today.getMonth());

  const [availability, setAvailability] = useState<AvailabilityState>({
    busy: [],
    loading: true,
    warning: null,
  });

  useEffect(() => {
    let cancelled = false;
    setAvailability({ busy: [], loading: true, warning: null });

    fetch(`/api/availability/${property.slug}`)
      .then((res) => res.json())
      .then((data: { busy: DateRange[]; warning?: string }) => {
        if (cancelled) return;
        setAvailability({ busy: data.busy ?? [], loading: false, warning: data.warning ?? null });
      })
      .catch(() => {
        if (cancelled) return;
        setAvailability({
          busy: [],
          loading: false,
          warning: 'No se pudo verificar la disponibilidad en vivo. Confirmá por WhatsApp.',
        });
      });

    return () => {
      cancelled = true;
    };
  }, [property.slug]);

  function handleSelectProperty(slug: string) {
    if (!properties.some((p) => p.slug === slug)) return;
    setSelectedSlug(slug);
    setCheckIn(null);
    setCheckOut(null);
    setConflict(null);
    const nextProperty = properties.find((p) => p.slug === slug);
    if (nextProperty) setGuests((g) => Math.min(g, nextProperty.capacity.guests));
  }

  // Los botones "Ver disponibilidad de [casa]" (fuera de este componente) avisan
  // qué casa preseleccionar disparando este evento — ver PropertyShowcase.astro.
  useEffect(() => {
    function handleExternalSelect(event: Event) {
      const slug = (event as CustomEvent<string>).detail;
      if (slug) handleSelectProperty(slug);
    }
    window.addEventListener('select-property', handleExternalSelect);
    return () => window.removeEventListener('select-property', handleExternalSelect);
  });

  function handleSelectDate(iso: string) {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(iso);
      setCheckOut(null);
      setConflict(null);
      return;
    }

    if (iso <= checkIn) {
      setCheckIn(iso);
      setCheckOut(null);
      setConflict(null);
      return;
    }

    if (rangeHasConflict(checkIn, iso, availability.busy)) {
      setConflict('Ese rango incluye fechas no disponibles. Elegí otra fecha de salida.');
      return;
    }

    setCheckOut(iso);
    setConflict(null);
  }

  function handleNavigate(direction: -1 | 1) {
    const newMonth = baseMonth + direction;
    const newDate = new Date(baseYear, newMonth, 1);
    setBaseYear(newDate.getFullYear());
    setBaseMonth(newDate.getMonth());
  }

  const nights = checkIn && checkOut ? diffNights(checkIn, checkOut) : 0;
  const meetsMinStay = nights >= property.pricing.minNights;
  const stayRates = checkIn && checkOut ? getStayRates(checkIn, checkOut, property.pricing.seasons) : null;
  const uniformRate = stayRates && stayRates.every((r) => r === stayRates[0]) ? stayRates[0] : null;
  const nightsTotal = stayRates ? stayRates.reduce((sum, r) => sum + r, 0) : null;
  const total = nightsTotal !== null ? nightsTotal + property.pricing.cleaningFee : null;

  const secondMonth = new Date(baseYear, baseMonth + 1, 1);
  const minDate = todayISO();

  const whatsappHref = useMemo(() => {
    const lines = [
      `Hola! Quiero consultar disponibilidad para *${property.name}* en La Aldea de Amalia.`,
    ];

    if (checkIn && checkOut) {
      lines.push(`📅 Check-in: ${formatDisplayDate(checkIn)}`);
      lines.push(`📅 Check-out: ${formatDisplayDate(checkOut)}`);
      lines.push(`🌙 ${nights} noche${nights === 1 ? '' : 's'}`);
    }
    lines.push(`👥 ${guests} huésped${guests === 1 ? '' : 'es'}`);

    if (checkIn && checkOut && meetsMinStay && total !== null) {
      lines.push(`💰 Total estimado: ${formatPrice(total, property.pricing.currency)} (incluye limpieza)`);
    }

    lines.push('', '¿Está disponible?');

    const text = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/${property.whatsappNumber}?text=${text}`;
  }, [property, checkIn, checkOut, nights, guests, meetsMinStay, total]);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6 flex justify-center gap-2">
        {properties.map((p) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => handleSelectProperty(p.slug)}
            className={[
              'rounded-full px-5 py-2 text-sm font-medium transition',
              p.slug === selectedSlug
                ? 'bg-stone-900 text-white'
                : 'bg-white text-stone-600 ring-1 ring-inset ring-stone-200 hover:bg-stone-50',
            ].join(' ')}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-[0_2px_40px_-12px_rgba(0,0,0,0.15)] ring-1 ring-stone-100">
        <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-2">
          <div>
            <Calendar
              year={baseYear}
              month={baseMonth}
              onNavigate={handleNavigate}
              busy={availability.busy}
              minDate={minDate}
              checkIn={checkIn}
              checkOut={checkOut}
              onSelectDate={handleSelectDate}
            />
          </div>
          <div className="hidden md:block">
            <Calendar
              year={secondMonth.getFullYear()}
              month={secondMonth.getMonth()}
              onNavigate={handleNavigate}
              busy={availability.busy}
              minDate={minDate}
              checkIn={checkIn}
              checkOut={checkOut}
              onSelectDate={handleSelectDate}
            />
          </div>
        </div>

        {conflict && (
          <p className="border-t border-amber-100 bg-amber-50 px-6 py-3 text-center text-sm text-amber-800">
            {conflict}
          </p>
        )}

        {availability.warning && (
          <p className="border-t border-amber-100 bg-amber-50 px-6 py-3 text-center text-sm text-amber-800">
            {availability.warning}
          </p>
        )}

        <div className="border-t border-stone-100 bg-stone-50/60 p-6 sm:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-stone-400">Check-in</p>
                <p className="font-medium text-stone-900">
                  {checkIn ? formatDisplayDate(checkIn) : 'Elegí una fecha'}
                </p>
              </div>
              <div>
                <p className="text-stone-400">Check-out</p>
                <p className="font-medium text-stone-900">
                  {checkOut ? formatDisplayDate(checkOut) : 'Elegí una fecha'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-stone-400">Huéspedes</span>
              <div className="flex items-center gap-3 rounded-full bg-white px-3 py-1.5 ring-1 ring-stone-200">
                <button
                  type="button"
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  aria-label="Menos huéspedes"
                  className="flex h-6 w-6 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100"
                >
                  −
                </button>
                <span className="w-4 text-center text-sm font-medium text-stone-900">{guests}</span>
                <button
                  type="button"
                  onClick={() => setGuests((g) => Math.min(property.capacity.guests, g + 1))}
                  aria-label="Más huéspedes"
                  className="flex h-6 w-6 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {checkIn && checkOut && meetsMinStay && total !== null ? (
            <div className="mb-6 space-y-2 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>
                  {uniformRate !== null
                    ? `${formatPrice(uniformRate, property.pricing.currency)} x ${nights} noche${nights === 1 ? '' : 's'}`
                    : `Alojamiento x ${nights} noche${nights === 1 ? '' : 's'}`}
                </span>
                <span>{formatPrice(nightsTotal ?? 0, property.pricing.currency)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Limpieza</span>
                <span>{formatPrice(property.pricing.cleaningFee, property.pricing.currency)}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2 text-base font-semibold text-stone-900">
                <span>Total estimado</span>
                <span>{formatPrice(total, property.pricing.currency)}</span>
              </div>
            </div>
          ) : checkIn && checkOut && meetsMinStay ? (
            <p className="mb-6 text-sm text-stone-500">
              Esas fechas todavía no tienen tarifa cargada — consultanos el precio por WhatsApp.
            </p>
          ) : checkIn && checkOut && !meetsMinStay ? (
            <p className="mb-6 text-sm text-stone-500">
              La estadía mínima en {property.name} es de {property.pricing.minNights} noches.
            </p>
          ) : (
            <p className="mb-6 text-sm text-stone-500">
              Elegí check-in y check-out para ver el precio estimado.
            </p>
          )}

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
          >
            Reservar por WhatsApp
          </a>
          <p className="mt-3 text-center text-xs text-stone-400">
            Sin pagos online. Coordinás y confirmás la reserva directamente con nosotros.
          </p>
        </div>
      </div>
    </div>
  );
}
