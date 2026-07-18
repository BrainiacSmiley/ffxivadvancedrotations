import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import MainView from '@/views/MainView.vue'
import { SUPPORTED_LANGUAGES } from '@/stores/settings'

const LANG_KEY = 'ffxivar.language'
const LANG_PATTERN = SUPPORTED_LANGUAGES.join('|')

/** Language for the bare `/` entry: the persisted choice, else the default. */
function defaultLang(): string {
  const stored = localStorage.getItem(LANG_KEY)
  return SUPPORTED_LANGUAGES.includes(stored as never) ? (stored as string) : 'en'
}

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: () => `/${defaultLang()}` },
  // Changelog page, e.g. /en/changelog (the static segment outranks `:job?`).
  {
    path: `/:lang(${LANG_PATTERN})/changelog`,
    name: 'changelog',
    component: () => import('@/views/ChangelogView.vue'),
  },
  // `/{lang}` (home) and `/{lang}/{jobAbbr}` (a class selected), e.g. /en/pld.
  { path: `/:lang(${LANG_PATTERN})/:job?`, name: 'main', component: MainView },
  // Anything else (including an unknown language segment) falls back to home.
  { path: '/:pathMatch(.*)*', redirect: () => `/${defaultLang()}` },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
