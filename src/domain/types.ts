/** Whether an action sits on the global cooldown (GCD) or is an off-GCD ability. */
export type SkillType = 'gcd' | 'ogcd'

/** UI + game-data languages supported by XIVAPI v2. */
export type SupportedLanguage = 'en' | 'de' | 'fr' | 'ja'

/** Role buckets used to group jobs in the sidebar. */
export type JobRole = 'tank' | 'healer' | 'melee' | 'ranged' | 'caster' | 'other'

/** A single usable combat action, normalised from the XIVAPI Action sheet. */
export interface GameAction {
  id: number
  name: string
  /** XIVAPI icon texture path, e.g. `ui/icon/000000/000405.tex`. */
  iconPath: string
  type: SkillType
  /** Level at which the job unlocks this action (`ClassJobLevel`). */
  level: number
  /** Cast time in 100ms units (0 = instant). */
  cast100ms: number
  /** Recast (cooldown) time in 100ms units. */
  recast100ms: number
  /** In-game action description (plain text, may contain line breaks). */
  description: string
  /** Targeting range in yalms (0 = self/no range). */
  range: number
  /** Area-of-effect radius in yalms (0 = single target). */
  radius: number
  /** Resource type consumed (3 = MP); other values are job gauges. */
  costType: number
  /** Raw cost value (MP is scaled per job role at display time). */
  costValue: number
  /** Action category name, e.g. "Ability", "Spell", "Weaponskill". */
  category: string
  /** Job affinity from ClassJobCategory, e.g. "GLA PLD". */
  affinity: string
}

/** A combat job shown in the sidebar. */
export interface Job {
  id: number
  name: string
  abbreviation: string
  role: JobRole
  parentClassId: number | null
  iconPath: string
}

/**
 * A concrete placement of an action inside a rotation. `instanceId` lets the
 * same action appear multiple times and keeps drag/reorder identity stable.
 */
export interface PlacedAction {
  instanceId: string
  actionId: number
}

/** Maximum oGCDs that may be weaved after a single GCD in V1. */
export const MAX_WEAVES_PER_GCD = 2

/**
 * One GCD in the rotation plus its fixed weave slots. `weaves` always has
 * `MAX_WEAVES_PER_GCD` entries; a `null` entry is an empty slot (a gap left by
 * removing an oGCD) that a newly dropped oGCD fills, keeping the others in place.
 *
 * `gcd` may be `null`: once every weave slot is taken, extra oGCDs open new
 * columns with an empty GCD, making an over-weave (clipping) visible at a glance.
 */
export interface RotationStep {
  id: string
  gcd: PlacedAction | null
  weaves: (PlacedAction | null)[]
}

/** A complete, persistable rotation for one job. */
export interface Rotation {
  id: string
  name: string
  jobId: number
  patchVersion: string
  /** oGCDs used before the first GCD (opener pre-pull). */
  prePull: PlacedAction[]
  steps: RotationStep[]
  createdAt: string
  updatedAt: string
}
