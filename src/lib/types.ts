export interface DateRange {
  /** ISO date string (yyyy-mm-dd), inclusive */
  start: string;
  /** ISO date string (yyyy-mm-dd), exclusive (checkout day, matches iCal DTEND) */
  end: string;
}

export interface PropertyPhoto {
  /** Used as alt text and as the label on the placeholder tile until real photos are added */
  alt: string;
  /**
   * Ruta relativa dentro de src/assets/properties (ej. "casa-b/fachada.jpg").
   * Si no se define, se muestra un placeholder en su lugar.
   */
  src?: string;
}

export interface PropertyAmenity {
  icon: AmenityIcon;
  label: string;
}

export interface SeasonRate {
  /** ISO date (yyyy-mm-dd), inclusive */
  start: string;
  /** ISO date (yyyy-mm-dd), inclusive */
  end: string;
  pricePerNight: number;
}

export type AmenityIcon =
  | 'wifi'
  | 'kitchen'
  | 'parking'
  | 'pool'
  | 'ac'
  | 'tv'
  | 'washer'
  | 'pets'
  | 'garden'
  | 'grill'
  | 'beach'
  | 'heating';

export interface Property {
  id: string;
  /** URL slug, also used as the /api/availability/[slug] key */
  slug: string;
  name: string;
  tagline: string;
  description: string;
  capacity: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  amenities: PropertyAmenity[];
  pricing: {
    currency: 'ARS' | 'USD';
    seasons: SeasonRate[];
    minNights: number;
  };
  /** Booking.com iCal export URL, consumed by /api/availability/[slug] */
  icalUrl: string;
  /** International format, digits only, no leading + (e.g. 5492235550123) */
  whatsappNumber: string;
  photos: PropertyPhoto[];
}
