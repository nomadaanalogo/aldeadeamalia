import type { Property } from '../lib/types';

/**
 * Único número de WhatsApp para todas las propiedades (decisión del cliente:
 * "que nos hablen y les damos precios/detalles por WhatsApp").
 * TODO: reemplazar por el número real antes de publicar.
 * Formato internacional, solo dígitos, sin "+" (ej. Argentina: 549 + código de área sin 0 + número sin 15).
 */
export const WHATSAPP_NUMBER = '5492235550000';

export const SITE = {
  name: 'La Aldea de Amalia',
  shortName: 'La Aldea de Amalia',
  location: 'Sur de Mar del Plata, Buenos Aires, Argentina',
  areaLabel: 'sur de Mar del Plata',
  // Coordenadas reales (de la ficha de Google Maps del lugar) — se usan para centrar el mapa.
  coords: { lat: -38.0895964, lng: -57.5931634 },
  description: 'Dos casas cómodas y familiares, pensadas para que te sientas como en tu hogar.',
  // Título y descripción para buscadores (SEO) — separados del copy del hero para poder
  // meter las palabras clave de búsqueda sin tocar el tono cercano del sitio.
  metaTitle: 'La Aldea de Amalia — Alquiler de casas en Mar del Plata (Zona Sur)',
  metaDescription:
    'Alquiler de casas para hasta 5 huéspedes en el sur de Mar del Plata, cerca de Mute y las playas de Punta Mogotes. Consultá disponibilidad y reservá por WhatsApp.',
  url: 'https://aldeadeamalia.com',
};

/**
 * Tarifas por temporada (USD/noche), iguales para las dos casas.
 * Temporada 2026/2027, según lo indicado por el cliente.
 */
const SEASON_RATES: Property['pricing']['seasons'] = [
  { start: '2026-10-01', end: '2026-10-31', pricePerNight: 37 },
  { start: '2026-11-01', end: '2026-12-28', pricePerNight: 40 },
  { start: '2026-12-29', end: '2027-01-15', pricePerNight: 58 },
  { start: '2027-01-16', end: '2027-01-31', pricePerNight: 45 },
  { start: '2027-02-01', end: '2027-03-31', pricePerNight: 40 },
];

/** Lista de servicios compartida: ambas casas ofrecen exactamente lo mismo. */
const SHARED_AMENITIES: Property['amenities'] = [
  { icon: 'wifi', label: 'WiFi de alta velocidad' },
  { icon: 'kitchen', label: 'Cocina totalmente equipada' },
  { icon: 'parking', label: 'Cochera privada' },
  { icon: 'washer', label: 'Lavarropas' },
  { icon: 'garden', label: 'Jardín / patio' },
  { icon: 'grill', label: 'Parrilla' },
  { icon: 'tv', label: 'Smart TV' },
];

/**
 * Fuente de verdad para precios y datos de cada propiedad.
 * Editar acá y hacer commit/push alcanza para actualizar el sitio (sin admin, sin base de datos).
 */
export const PROPERTIES: Property[] = [
  {
    id: 'casa-a',
    slug: 'casa-a',
    name: 'Casa A',
    tagline: 'Dúplex cómodo para toda la familia',
    description:
      'Dúplex para hasta 5 huéspedes: cocina, living y baño en planta baja, con un dormitorio abajo y otro arriba. Arriba hay una cama doble; abajo, una cucheta y una cama individual. Cómoda y luminosa, ideal para venir en familia.',
    capacity: { guests: 5, bedrooms: 2, beds: 4, bathrooms: 1 },
    amenities: SHARED_AMENITIES,
    pricing: {
      currency: 'USD',
      seasons: SEASON_RATES,
      minNights: 2,
    },
    icalUrl: 'https://ical.booking.com/v1/export?t=a9418b3b-2f86-4a6b-9446-1efd1206e094',
    whatsappNumber: WHATSAPP_NUMBER,
    photos: [
      { alt: 'Casa A — fachada' },
      { alt: 'Casa A — living comedor' },
      { alt: 'Casa A — cocina' },
      { alt: 'Casa A — dormitorio principal' },
      { alt: 'Casa A — baño' },
      { alt: 'Casa A — patio y parrilla' },
    ],
  },
  {
    id: 'casa-b',
    slug: 'casa-b',
    name: 'Casa B',
    tagline: 'Ideal para compartir en familia o con amigos',
    description:
      'Casa de dos dormitorios para hasta 5 huéspedes: uno con cama doble y otro con litera, más un sofá cama en el living. Cocina, living y baño, todo pensado para que estés como en tu casa.',
    capacity: { guests: 5, bedrooms: 2, beds: 4, bathrooms: 1 },
    amenities: SHARED_AMENITIES,
    pricing: {
      currency: 'USD',
      seasons: SEASON_RATES,
      minNights: 2,
    },
    icalUrl: 'https://ical.booking.com/v1/export?t=22d86a32-0a7b-4ff4-a004-92aeee35b089',
    whatsappNumber: WHATSAPP_NUMBER,
    photos: [
      { alt: 'Casa B — fachada y jardín', src: 'casa-b/fachada.jpg' },
      { alt: 'Casa B — dormitorio principal', src: 'casa-b/dormitorio-principal.jpg' },
      { alt: 'Casa B — segundo dormitorio', src: 'casa-b/dormitorio-cuchetas.jpg' },
      { alt: 'Casa B — baño', src: 'casa-b/bano.jpg' },
      { alt: 'Casa B — jardín', src: 'casa-b/jardin.jpg' },
      { alt: 'Casa B — patio', src: 'casa-b/exterior.jpg' },
      { alt: 'Casa B — baño secundario', src: 'casa-b/bano-secundario.jpg' },
      { alt: 'Casa B — patio de servicio', src: 'casa-b/patio.jpg' },
      { alt: 'Casa B — lavadero', src: 'casa-b/lavadero.jpg' },
    ],
  },
];

export function getPropertyBySlug(slug: string): Property | undefined {
  return PROPERTIES.find((p) => p.slug === slug);
}
