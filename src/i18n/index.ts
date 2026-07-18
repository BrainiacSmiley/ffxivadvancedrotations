import { createI18n } from 'vue-i18n'
import type { SupportedLanguage } from '@/domain/types'
import { readLangFromUrl } from '@/utils/langUrl'
import en from './locales/en'
import de from './locales/de'
import fr from './locales/fr'
import ja from './locales/ja'

const LANG_KEY = 'ffxivar.language'
const SUPPORTED: SupportedLanguage[] = ['en', 'de', 'fr', 'ja']

// Precedence: URL (?lang=) wins so shared links open in the right language,
// then the persisted choice, then the default.
function initialLocale(): SupportedLanguage {
  const fromUrl = readLangFromUrl(SUPPORTED)
  if (fromUrl) {
    return fromUrl
  }
  const stored = localStorage.getItem(LANG_KEY)
  return SUPPORTED.includes(stored as SupportedLanguage) ? (stored as SupportedLanguage) : 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale(),
  fallbackLocale: 'en',
  messages: { en, de, fr, ja },
})
