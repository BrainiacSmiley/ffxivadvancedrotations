import type { RawActionFields, RawClassJobFields, RawSheetRow, SearchResult } from '@/api/xivapi'
import { ROSTER_ROLE_BY_ABBR } from '@/domain/roster'
import type { GameAction, Job, SkillType } from '@/domain/types'

// XIVAPI ActionCategory row ids: 2 = Spell, 3 = Weaponskill (both on the GCD),
// 4 = Ability (off-GCD). Everything else (auto-attack, item, event, system,
// limit break, DoH/DoL) is not a plannable combat skill and is dropped.
const GCD_CATEGORY_IDS = new Set([2, 3])
const OGCD_CATEGORY_ID = 4

export function classifyAction(categoryId: number): SkillType | null {
  if (GCD_CATEGORY_IDS.has(categoryId)) return 'gcd'
  if (categoryId === OGCD_CATEGORY_ID) return 'ogcd'
  return null
}

function titleCase(value: string): string {
  return value.replace(/\b\p{L}/gu, (char) => char.toUpperCase())
}

// FFXIV framed job icons live in the UI texture set `ui/icon/062000/062<id>`,
// keyed by ClassJob row id. XIVAPI's ClassJob sheet carries no icon column, so
// the path is derived from the id rather than read from a field.
function jobIconPath(classJobId: number): string {
  return `ui/icon/062000/062${String(classJobId).padStart(3, '0')}.tex`
}

function categoryId(fields: RawActionFields): number {
  return fields.ActionCategory?.row_id ?? fields.ActionCategory?.value ?? 0
}

export function mapAction(result: SearchResult<RawActionFields>): GameAction | null {
  const fields = result.fields
  const type = classifyAction(categoryId(fields))
  if (!type || !fields.Name) {
    return null
  }
  return {
    id: result.row_id,
    name: fields.Name,
    iconPath: fields.Icon?.path ?? '',
    type,
    level: fields.ClassJobLevel ?? 0,
    cast100ms: fields.Cast100ms ?? 0,
    recast100ms: fields.Recast100ms ?? 0,
    description: result.transient?.Description ?? '',
    range: fields.Range ?? 0,
    radius: fields.EffectRange ?? 0,
    costType: fields.PrimaryCostType ?? 0,
    costValue: fields.PrimaryCostValue ?? 0,
    category: fields.ActionCategory?.fields?.Name ?? '',
    affinity: fields.ClassJobCategory?.fields?.Name ?? '',
  }
}

/** Normalise, de-duplicate and sort raw action search results. */
export function mapActions(results: SearchResult<RawActionFields>[]): GameAction[] {
  const byId = new Map<number, GameAction>()
  for (const result of results) {
    const action = mapAction(result)
    if (action && !byId.has(action.id)) {
      byId.set(action.id, action)
    }
  }
  return [...byId.values()].sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
}

/** Keep only roster jobs and attach their role bucket + localised name. */
export function mapJobs(rows: RawSheetRow<RawClassJobFields>[]): Job[] {
  const jobs: Job[] = []
  for (const row of rows) {
    const abbreviation = row.fields['Abbreviation@lang(en)']
    const role = ROSTER_ROLE_BY_ABBR.get(abbreviation)
    if (!role) {
      continue
    }
    jobs.push({
      id: row.row_id,
      name: titleCase(row.fields.Name || abbreviation),
      abbreviation,
      role,
      parentClassId: null,
      iconPath: jobIconPath(row.row_id),
    })
  }
  return jobs
}
