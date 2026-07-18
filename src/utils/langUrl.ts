/**
 * Read the active UI language from the URL's leading path segment (`/de/…`).
 *
 * URL writes are owned by the router (`vue-router`); this reader only bootstraps
 * i18n and the settings store before the router-driven watchers take over.
 */
import type { SupportedLanguage } from '@/domain/types'

/** Read a supported language from the first path segment, or null if absent. */
export function readLangFromUrl(supported: readonly SupportedLanguage[]): SupportedLanguage | null {
  if (typeof window === 'undefined') {
    return null
  }
  const segment = window.location.pathname.split('/').filter(Boolean)[0] ?? ''
  return supported.includes(segment as SupportedLanguage) ? (segment as SupportedLanguage) : null
}
