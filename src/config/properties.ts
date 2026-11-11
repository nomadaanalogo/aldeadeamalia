import type { Property } from '../lib/types';

/**
 * Único número de WhatsApp para todas las propiedades (decisión del cliente:
 * "que nos hablen y les damos precios/detalles por WhatsApp").
 * +54 9 2236 35-5338.
 */
export const WHATSAPP_NUMBER = '5492236355338';

export const SITE = {
  name: 'La Aldea de Amalia',
  shortName: 'La Aldea de Amalia',
  location: 'Sur de Mar del Plata, Buenos Aires, Argentina',
  areaLabel: 'sur de Mar del Plata',
  // Coordenadas reales (de la ficha de Google Maps del lugar) — se usan para centrar el mapa.
  coords: { lat: -38.0895964, lng: -57.5931634 },
  // Ficha real de Google Business Profile ("La Aldea de Amalia").
  googleMapsUrl: 'https://maps.app.goo.gl/PvJnwfPA6WLdMQXu6',
  description: 'Dos casas cómodas y familiares, pensadas para que te sientas como en tu hogar.',
  // Título y descripción para buscadores (SEO) — separados del copy del hero para poder
  // meter las palabras clave de búsqueda sin tocar el tono cercano del sitio.
  metaTitle: 'La Aldea de Amalia — Alquiler de casas en Mar del Plata (Zona Sur)',
  // Título al compartir el link (WhatsApp, Facebook, etc.).
  ogTitle: 'La Aldea de Amalia - 2 casas con cochera, parrilla y amplio jardín',
  metaDescription:
    'Alquiler de casas para hasta 5 huéspedes en el sur de Mar del Plata, cerca de Mute y las playas de Punta Mogotes. Consultá disponibilidad y reservá por WhatsApp.',
  url: 'https://aldeadeamalia.com',
};

/**
 * Tarifas por temporada (USD/noche), iguales para las dos casas.
 * Temporada 2026/2027, según lo indicado por el cliente.
 */
const SEASON_RATES: Property['pricing']['seasons'] = [
  { start: '2026-10-01', end: '2026-10-31', pricePerNight: 42 },
  { start: '2026-11-01', end: '2026-11-30', pricePerNight: 40 },
  { start: '2026-12-01', end: '2026-12-28', pricePerNight: 45 },
  { start: '2026-12-29', end: '2026-12-31', pricePerNight: 63 },
  { start: '2027-01-01', end: '2027-01-15', pricePerNight: 68 },
  { start: '2027-01-16', end: '2027-01-31', pricePerNight: 55 },
  { start: '2027-02-01', end: '2027-02-28', pricePerNight: 50 },
  { start: '2027-03-01', end: '2027-03-31', pricePerNight: 45 },
];

/** Lista de servicios compartida: ambas casas ofrecen exactamente lo mismo. */
const SHARED_AMENITIES: Property['amenities'] = [
  { icon: 'wifi', label: 'WiFi de alta velocidad' },
  { icon: 'kitchen', label: 'Cocina totalmente equipada' },
  { icon: 'parking', label: 'Cochera privada' },
  { icon: 'washer', label: 'Lavarropas' },
  { icon: 'garden', label: 'Jardín / patio' },
  { icon: 'grill', label: 'Parrilla' },
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
      { alt: 'Casa A — living comedor', src: 'casa-a/living-comedor.webp' },
      { alt: 'Casa A — cocina', src: 'casa-a/cocina.webp' },
      { alt: 'Casa A — living con escalera al dormitorio de arriba', src: 'casa-a/living-escalera.webp' },
      { alt: 'Casa A — comedor', src: 'casa-a/comedor.webp' },
      { alt: 'Casa A — mesada con microondas y pava eléctrica', src: 'casa-a/mesada.webp' },
      { alt: 'Casa A — baño', src: 'casa-a/bano.webp' },
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
      { alt: 'Casa B — living comedor con cocina', src: 'casa-b/living-comedor.webp' },
      { alt: 'Casa B — dormitorio principal con cama doble', src: 'casa-b/dormitorio-principal.webp' },
      { alt: 'Casa B — segundo dormitorio con cucheta', src: 'casa-b/dormitorio-cuchetas.webp' },
      { alt: 'Casa B — cocina', src: 'casa-b/cocina.webp' },
      { alt: 'Casa B — comedor', src: 'casa-b/comedor.webp' },
      { alt: 'Casa B — sofá cama en el living', src: 'casa-b/sofa-cama.webp' },
      { alt: 'Casa B — baño', src: 'casa-b/bano.webp' },
      { alt: 'Casa B — lavatorio', src: 'casa-b/lavatorio.webp' },
      { alt: 'Casa B — jardín con flores', src: 'casa-b/jardin.webp' },
      { alt: 'Casa B — dormitorio principal', src: 'casa-b/dormitorio-principal-2.webp' },
      { alt: 'Casa B — segundo dormitorio', src: 'casa-b/dormitorio-cuchetas-2.webp' },
      { alt: 'Casa B — comedor y heladera', src: 'casa-b/comedor-2.webp' },
    ],
  },
];

export function getPropertyBySlug(slug: string): Property | undefined {
  return PROPERTIES.find((p) => p.slug === slug);
}
