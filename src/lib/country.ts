/**
 * Client-side Country Detection & Storage Service
 * Synchronized with the backend CountryMiddleware and Angular CountryService
 */

const STORAGE_KEY = 'country_code';
const DEFAULT_COUNTRY = 'US';

let inMemoryCountryCode: string | null = null;

/**
 * Infer ISO 2-letter country code from browser timezone
 */
export function inferCountryFromTimezone(tz?: string): string {
  if (!tz) {
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } else {
      return DEFAULT_COUNTRY;
    }
  }

  const lower = tz.toLowerCase();
  if (
    lower.includes('calcutta') ||
    lower.includes('kolkata') ||
    lower.includes('delhi') ||
    lower.includes('mumbai')
  ) {
    return 'IN';
  }
  if (
    lower.includes('karachi') ||
    lower.includes('islamabad') ||
    lower.includes('lahore')
  ) {
    return 'PK';
  }
  if (lower.includes('dhaka')) {
    return 'BD';
  }
  if (lower.includes('london')) {
    return 'GB';
  }
  if (
    lower.includes('toronto') ||
    lower.includes('vancouver') ||
    lower.includes('montreal')
  ) {
    return 'CA';
  }
  if (lower.includes('sydney') || lower.includes('melbourne')) {
    return 'AU';
  }
  if (lower.includes('dubai')) {
    return 'AE';
  }
  if (lower.includes('riyadh')) {
    return 'SA';
  }
  if (lower.includes('berlin')) {
    return 'DE';
  }
  if (lower.includes('paris')) {
    return 'FR';
  }
  if (
    lower.includes('new_york') ||
    lower.includes('chicago') ||
    lower.includes('los_angeles') ||
    lower.includes('denver') ||
    lower.includes('america')
  ) {
    return 'US';
  }

  return DEFAULT_COUNTRY;
}

/**
 * Get current country code from memory, localStorage, timezone, or default fallback
 */
export function getCountryCode(): string {
  if (inMemoryCountryCode && /^[A-Z]{2}$/.test(inMemoryCountryCode)) {
    return inMemoryCountryCode;
  }

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && /^[A-Za-z]{2}$/.test(stored.trim())) {
        inMemoryCountryCode = stored.trim().toUpperCase();
        return inMemoryCountryCode;
      }
    } catch {}

    const inferred = inferCountryFromTimezone();
    inMemoryCountryCode = inferred;
    return inferred;
  }

  return DEFAULT_COUNTRY;
}

/**
 * Set and persist country code
 */
export function setCountryCode(code: string): void {
  if (!code || typeof code !== 'string') return;
  const clean = code.trim().toUpperCase().slice(0, 2);
  if (/^[A-Z]{2}$/.test(clean)) {
    inMemoryCountryCode = clean;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, clean);
      } catch {}
    }
  }
}

/**
 * Automatically detect country code via IP Geolocation APIs with timeout & fallbacks
 */
export async function detectCountry(): Promise<string> {
  if (typeof window === 'undefined') return DEFAULT_COUNTRY;

  // 1. If already stored, return immediately
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && /^[A-Za-z]{2}$/.test(stored.trim())) {
      const code = stored.trim().toUpperCase();
      inMemoryCountryCode = code;
      return code;
    }
  } catch {}

  // 2. Primary lightweight IP Geolocation API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch('https://api.country.is/', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data?.country && /^[A-Za-z]{2}$/.test(data.country)) {
        const code = data.country.toUpperCase();
        setCountryCode(code);
        return code;
      }
    }
  } catch {
    // Secondary fallback
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res2 = await fetch('https://ipapi.co/json/', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res2.ok) {
        const data2 = await res2.json();
        if (data2?.country_code && /^[A-Za-z]{2}$/.test(data2.country_code)) {
          const code = data2.country_code.toUpperCase();
          setCountryCode(code);
          return code;
        }
      }
    } catch {}
  }

  // 3. Fallback to timezone inference
  const inferred = inferCountryFromTimezone();
  setCountryCode(inferred);
  return inferred;
}
