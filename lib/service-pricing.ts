import {
  type Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
} from 'firebase/firestore';

/** Doc IDs in `pricing/{id}` — aligned with service booking `service` field values */
export const SERVICE_PRICING_KEYS = [
  'chauffeur-services',
  'event-rentals',
  'corporate-services',
] as const;

export type ServicePricingKey = (typeof SERVICE_PRICING_KEYS)[number];

export interface ServicePricingDoc {
  serviceKey: string;
  pricePerDay: number;
  notes: string;
  currency: string;
  updatedAt?: unknown;
  /** True when `pricing/{id}` was missing and a value was taken from legacy admin settings */
  fromLegacy?: boolean;
}

function normalizePricingDoc(
  id: ServicePricingKey,
  data: Record<string, unknown>,
  fromLegacy: boolean
): ServicePricingDoc | null {
  const pricePerDay = Number(data.pricePerDay);
  if (!Number.isFinite(pricePerDay) || pricePerDay < 0) return null;
  return {
    serviceKey: typeof data.serviceKey === 'string' ? data.serviceKey : id,
    pricePerDay,
    notes: typeof data.notes === 'string' ? data.notes : '',
    currency: typeof data.currency === 'string' ? data.currency : 'GBP',
    updatedAt: data.updatedAt,
    fromLegacy,
  };
}

function parsePriceValue(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 0) return raw;
  if (raw && typeof raw === 'object' && 'pricePerDay' in raw) {
    return parsePriceValue((raw as { pricePerDay: unknown }).pricePerDay);
  }
  return null;
}

/** Alternate field names on legacy `adminSettings/specialServicePricing` */
const LEGACY_KEY_ALIASES: Record<ServicePricingKey, string[]> = {
  'chauffeur-services': ['chauffeur-services', 'chauffeurServices', 'chauffeur'],
  'event-rentals': ['event-rentals', 'eventRentals', 'event'],
  'corporate-services': ['corporate-services', 'corporateServices', 'corporate'],
};

function extractLegacyPriceForService(
  legacy: Record<string, unknown> | undefined,
  key: ServicePricingKey
): ServicePricingDoc | null {
  if (!legacy) return null;
  const nested =
    legacy.services && typeof legacy.services === 'object'
      ? (legacy.services as Record<string, unknown>)
      : undefined;
  for (const alias of LEGACY_KEY_ALIASES[key]) {
    const p =
      parsePriceValue(legacy[alias]) ?? (nested ? parsePriceValue(nested[alias]) : null);
    if (p != null) {
      return normalizePricingDoc(
        key,
        { serviceKey: key, pricePerDay: p, notes: '', currency: 'GBP' },
        true
      );
    }
  }
  return null;
}

let legacySpecialPricingCache: Record<string, unknown> | undefined | false = false;

/**
 * Single read of `adminSettings/specialServicePricing` per page session (browser).
 * Used only when `pricing/{serviceKey}` has no valid `pricePerDay`.
 */
async function fetchLegacySpecialServicePricing(
  db: Firestore
): Promise<Record<string, unknown> | undefined> {
  if (legacySpecialPricingCache !== false) {
    return legacySpecialPricingCache === undefined ? undefined : legacySpecialPricingCache;
  }
  try {
    const snap = await getDoc(doc(db, 'adminSettings', 'specialServicePricing'));
    legacySpecialPricingCache = snap.exists()
      ? (snap.data() as Record<string, unknown>)
      : undefined;
  } catch {
    legacySpecialPricingCache = undefined;
  }
  return legacySpecialPricingCache === undefined ? undefined : legacySpecialPricingCache;
}

export async function getServicePricing(
  db: Firestore,
  serviceKey: ServicePricingKey
): Promise<ServicePricingDoc | null> {
  try {
    const snap = await getDoc(doc(db, 'pricing', serviceKey));
    if (snap.exists()) {
      const normalized = normalizePricingDoc(
        serviceKey,
        snap.data() as Record<string, unknown>,
        false
      );
      if (normalized) return normalized;
    }
  } catch {
    /* fall through to legacy */
  }
  const legacy = await fetchLegacySpecialServicePricing(db);
  return extractLegacyPriceForService(legacy, serviceKey);
}

/**
 * Loads all three service prices from `pricing`, then fills gaps from
 * `adminSettings/specialServicePricing` (one read) using legacy field shapes.
 */
export async function getAllServicePricing(
  db: Firestore
): Promise<Record<ServicePricingKey, ServicePricingDoc | null>> {
  const result: Record<ServicePricingKey, ServicePricingDoc | null> = {
    'chauffeur-services': null,
    'event-rentals': null,
    'corporate-services': null,
  };

  try {
    const col = await getDocs(collection(db, 'pricing'));
    col.forEach((d) => {
      const id = d.id as ServicePricingKey;
      if (!SERVICE_PRICING_KEYS.includes(id)) return;
      const normalized = normalizePricingDoc(id, d.data() as Record<string, unknown>, false);
      if (normalized) result[id] = normalized;
    });
  } catch {
    /* rely on legacy */
  }

  const legacy = await fetchLegacySpecialServicePricing(db);
  for (const key of SERVICE_PRICING_KEYS) {
    if (result[key]) continue;
    result[key] = extractLegacyPriceForService(legacy, key);
  }

  return result;
}

/** Rental day count — same formula as car booking (`/booking/[id]`). */
export function countServiceRentalDays(pickup: Date, dropoff: Date): number {
  const pickupDate = new Date(pickup);
  const dropoffDate = new Date(dropoff);
  if (isNaN(pickupDate.getTime()) || isNaN(dropoffDate.getTime())) return 0;
  const days = Math.ceil(
    (dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.max(1, days);
}

export function isServicePricingKey(id: string): id is ServicePricingKey {
  return (SERVICE_PRICING_KEYS as readonly string[]).includes(id);
}
