import { getCountryCode } from './country';

/**
 * Standardized Fetch Client for NestJS Backend
 * Ensures x-country-code is automatically attached to all HTTP requests,
 * satisfying the backend CountryMiddleware requirement.
 */
export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(init.headers || {});

  const country = getCountryCode();
  if (country && !headers.has('x-country-code')) {
    headers.set('x-country-code', country);
  }
  if (country && !headers.has('X-Country-Code')) {
    headers.set('X-Country-Code', country);
  }

  // Attach Authorization token if available in client storage
  if (typeof window !== 'undefined' && !headers.has('Authorization')) {
    try {
      const token =
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    } catch {}
  }

  return fetch(input, {
    ...init,
    headers,
  });
}
