import type { SupportedLanguage } from '@/domain/types'

const BASE_URL = 'https://v2.xivapi.com/api'
const ASSET_ENDPOINT = `${BASE_URL}/asset`

/** Build a browser-loadable PNG URL for a XIVAPI icon texture path. */
export function assetUrl(path: string, format: 'png' | 'jpg' = 'png'): string {
  return `${ASSET_ENDPOINT}?path=${encodeURIComponent(path)}&format=${format}`
}

export interface RawIcon {
  id: number
  path: string
  path_hr1: string
}

export interface RawRef {
  value: number
  row_id?: number
  fields?: { Name?: string }
}

export interface RawSheetRow<F> {
  row_id: number
  fields: F
}

interface SheetResponse<F> {
  rows: RawSheetRow<F>[]
}

export interface SearchResult<F> {
  row_id: number
  score: number
  sheet: string
  fields: F
  /** Transient (linked) sheet data requested via the `transient` param. */
  transient?: { Description?: string }
}

interface SearchResponse<F> {
  results: SearchResult<F>[]
  next?: string
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`XIVAPI request failed (${res.status} ${res.statusText}): ${url}`)
  }
  return (await res.json()) as T
}

export interface RawClassJobFields {
  Name: string
  // ClassJob.Abbreviation is localized (WAR/KRG/GUE). We force the English
  // value via the `@lang(en)` field decorator so it is a stable, canonical key
  // usable for roster matching, the action-search query and URLs across all UI
  // languages. The response echoes the decorated field name verbatim.
  'Abbreviation@lang(en)': string
  Role: number
  BattleClassIndex: number
}

/** Fetch the (small) ClassJob sheet in one page. */
export async function fetchClassJobSheet(
  language: SupportedLanguage,
): Promise<RawSheetRow<RawClassJobFields>[]> {
  const params = new URLSearchParams({
    fields: 'Name,Abbreviation@lang(en),Role,BattleClassIndex',
    limit: '100',
    language,
  })
  const data = await getJson<SheetResponse<RawClassJobFields>>(
    `${BASE_URL}/sheet/ClassJob?${params.toString()}`,
  )
  return data.rows ?? []
}

export interface RawActionFields {
  Name: string
  Icon: RawIcon
  ActionCategory: RawRef
  ClassJobCategory: RawRef
  ClassJobLevel: number
  Cast100ms: number
  Recast100ms: number
  /** Targeting range in yalms (0 = self/no range). */
  Range: number
  /** Area-of-effect radius in yalms (0 = single target). */
  EffectRange: number
  /** Resource type consumed (3 = MP); other values are job gauges. */
  PrimaryCostType: number
  /** Raw cost value (for MP this is scaled per job role at display time). */
  PrimaryCostValue: number
  IsPvP: boolean
}

const SEARCH_PAGE_LIMIT = 500
const MAX_SEARCH_PAGES = 6

/**
 * Search real player actions usable by the given job abbreviation.
 * `IsPlayerAction=true` drops the huge tail of items, mounts, limit breaks and
 * NPC/system actions that also match a job's ClassJobCategory; callers still
 * filter by ActionCategory to keep only GCDs and oGCDs.
 */
export async function searchJobActions(
  abbreviation: string,
  language: SupportedLanguage,
): Promise<SearchResult<RawActionFields>[]> {
  const query = `+ClassJobCategory.${abbreviation}=true +IsPvP=false +IsPlayerAction=true`
  const results: SearchResult<RawActionFields>[] = []
  let cursor: string | undefined

  for (let page = 0; page < MAX_SEARCH_PAGES; page += 1) {
    const params = new URLSearchParams({
      sheets: 'Action',
      query,
      fields:
        'Name,Icon,ActionCategory.Name,ClassJobCategory.Name,ClassJobLevel,Cast100ms,Recast100ms,Range,EffectRange,PrimaryCostType,PrimaryCostValue,IsPvP',
      transient: 'Description',
      limit: String(SEARCH_PAGE_LIMIT),
      language,
    })
    if (cursor) {
      params.set('cursor', cursor)
    }
    const data = await getJson<SearchResponse<RawActionFields>>(
      `${BASE_URL}/search?${params.toString()}`,
    )
    const batch = data.results ?? []
    results.push(...batch)
    if (!data.next || batch.length < SEARCH_PAGE_LIMIT) {
      break
    }
    cursor = data.next
  }

  return results
}
