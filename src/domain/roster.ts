import type { JobRole } from './types'

export interface RosterEntry {
  abbr: string
  role: JobRole
}

/**
 * Curated roster of the current combat jobs and their role bucket. This drives
 * *which* jobs appear and *how* they are grouped; localised display names come
 * from the XIVAPI ClassJob sheet (matched by the language-independent
 * abbreviation). Add a line here when a new job ships.
 */
export const COMBAT_JOB_ROSTER: RosterEntry[] = [
  // Tanks
  { abbr: 'PLD', role: 'tank' },
  { abbr: 'WAR', role: 'tank' },
  { abbr: 'DRK', role: 'tank' },
  { abbr: 'GNB', role: 'tank' },
  // Healers
  { abbr: 'WHM', role: 'healer' },
  { abbr: 'SCH', role: 'healer' },
  { abbr: 'AST', role: 'healer' },
  { abbr: 'SGE', role: 'healer' },
  // Melee DPS
  { abbr: 'MNK', role: 'melee' },
  { abbr: 'DRG', role: 'melee' },
  { abbr: 'NIN', role: 'melee' },
  { abbr: 'SAM', role: 'melee' },
  { abbr: 'RPR', role: 'melee' },
  { abbr: 'VPR', role: 'melee' },
  // Physical Ranged DPS
  { abbr: 'BRD', role: 'ranged' },
  { abbr: 'MCH', role: 'ranged' },
  { abbr: 'DNC', role: 'ranged' },
  // Magical Ranged DPS (casters)
  { abbr: 'BLM', role: 'caster' },
  { abbr: 'SMN', role: 'caster' },
  { abbr: 'RDM', role: 'caster' },
  { abbr: 'PCT', role: 'caster' },
]

/** Display order of the role groups in the sidebar. */
export const ROLE_ORDER: JobRole[] = ['tank', 'healer', 'melee', 'ranged', 'caster', 'other']

export const ROSTER_ROLE_BY_ABBR: ReadonlyMap<string, JobRole> = new Map(
  COMBAT_JOB_ROSTER.map((entry) => [entry.abbr, entry.role]),
)
