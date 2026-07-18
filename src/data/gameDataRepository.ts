import { fetchClassJobSheet, searchJobActions } from '@/api/xivapi'
import { DATA_PATCH_VERSION } from '@/config/patch'
import type { GameAction, Job, SupportedLanguage } from '@/domain/types'
import {
  clearAllCaches,
  readCachedActions,
  readCachedJobs,
  writeCachedActions,
  writeCachedJobs,
} from './db'
import { mapActions, mapJobs } from './mappers'

const PATCH_MARKER_KEY = 'ffxivar.dataPatch'

// Bump when the shape of cached records changes (independent of the game patch)
// so existing users' IndexedDB caches are invalidated. v2: jobs gained iconPath.
// v3: actions gained description/range/radius/cost/category/affinity.
// v4: job abbreviation is now the canonical English value (was localized).
// v5: action search now filters to IsPlayerAction (drops non-player actions).
const CACHE_SCHEMA_VERSION = 5

/** Cache marker combining the game patch with the cache-record schema version. */
const CACHE_MARKER = `${DATA_PATCH_VERSION}:v${CACHE_SCHEMA_VERSION}`

let patchCheck: Promise<void> | null = null

/**
 * Compare the stored cache marker against the current one exactly once per
 * session. On mismatch, wipe the IndexedDB caches so the next reads refetch.
 */
function ensurePatchFresh(): Promise<void> {
  if (!patchCheck) {
    patchCheck = (async () => {
      const stored = localStorage.getItem(PATCH_MARKER_KEY)
      if (stored !== CACHE_MARKER) {
        await clearAllCaches()
        localStorage.setItem(PATCH_MARKER_KEY, CACHE_MARKER)
      }
    })()
  }
  return patchCheck
}

/** Combat jobs for the sidebar, cache-first per language. */
export async function getJobs(language: SupportedLanguage): Promise<Job[]> {
  await ensurePatchFresh()
  const key = `${DATA_PATCH_VERSION}:${language}`
  const cached = await readCachedJobs(key)
  if (cached) {
    return cached
  }
  const jobs = mapJobs(await fetchClassJobSheet(language))
  await writeCachedJobs(key, DATA_PATCH_VERSION, jobs)
  return jobs
}

/** GCD/oGCD actions for a job, cache-first per language + job. */
export async function getActions(
  jobId: number,
  abbreviation: string,
  language: SupportedLanguage,
): Promise<GameAction[]> {
  await ensurePatchFresh()
  const key = `${DATA_PATCH_VERSION}:${language}:${jobId}`
  const cached = await readCachedActions(key)
  if (cached) {
    return cached
  }
  const actions = mapActions(await searchJobActions(abbreviation, language))
  await writeCachedActions(key, DATA_PATCH_VERSION, actions)
  return actions
}
