import { defineStore } from 'pinia'
import type { SupportedLanguage } from '@/domain/types'
import { readLangFromUrl } from '@/utils/langUrl'

export type ThemeMode = 'light' | 'dark'

const THEME_KEY = 'ffxivar.theme'
const LANG_KEY = 'ffxivar.language'
const REPLACE_LEVELED_KEY = 'ffxivar.replaceLeveledUpActions'
const REMOVE_NOT_LEARNED_KEY = 'ffxivar.removeNotLearnedActions'
const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'de', 'fr', 'ja']

/** Current level cap — the default ceiling for the skill-pool level filter. */
export const MAX_LEVEL = 100

function loadTheme(): ThemeMode {
  return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'
}

function loadLanguage(): SupportedLanguage {
  const fromUrl = readLangFromUrl(SUPPORTED_LANGUAGES)
  if (fromUrl) {
    return fromUrl
  }
  const stored = localStorage.getItem(LANG_KEY)
  return SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)
    ? (stored as SupportedLanguage)
    : 'en'
}

function loadBoolean(key: string, fallback: boolean): boolean {
  const stored = localStorage.getItem(key)
  return stored === null ? fallback : stored === 'true'
}

interface SettingsState {
  theme: ThemeMode
  language: SupportedLanguage
  levelFilter: number
  /** Replace lower-level actions with their upgraded versions. */
  replaceLeveledUpActions: boolean
  /** Hide actions the character has not learned yet at the current level. */
  removeNotLearnedActions: boolean
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    theme: loadTheme(),
    language: loadLanguage(),
    levelFilter: MAX_LEVEL,
    replaceLeveledUpActions: loadBoolean(REPLACE_LEVELED_KEY, true),
    removeNotLearnedActions: loadBoolean(REMOVE_NOT_LEARNED_KEY, false),
  }),
  actions: {
    setTheme(theme: ThemeMode) {
      this.theme = theme
      localStorage.setItem(THEME_KEY, theme)
    },
    toggleTheme() {
      this.setTheme(this.theme === 'dark' ? 'light' : 'dark')
    },
    setLanguage(language: SupportedLanguage) {
      this.language = language
      localStorage.setItem(LANG_KEY, language)
    },
    setLevelFilter(level: number) {
      this.levelFilter = level
    },
    setReplaceLeveledUpActions(value: boolean) {
      this.replaceLeveledUpActions = value
      localStorage.setItem(REPLACE_LEVELED_KEY, String(value))
    },
    setRemoveNotLearnedActions(value: boolean) {
      this.removeNotLearnedActions = value
      localStorage.setItem(REMOVE_NOT_LEARNED_KEY, String(value))
    },
  },
})

export { SUPPORTED_LANGUAGES }
