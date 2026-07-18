import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { RawActionFields, RawClassJobFields, RawSheetRow, SearchResult } from '@/api/xivapi'
import { classifyAction, mapActions, mapJobs } from '@/data/mappers'
import { useRotationStore } from '@/stores/rotation'
import type { GameAction } from '@/domain/types'

const actionExtras = {
  description: '',
  range: 0,
  radius: 0,
  costType: 0,
  costValue: 0,
  category: '',
  affinity: '',
}
const gcd = (id: number): GameAction => ({
  id,
  name: `g${id}`,
  iconPath: '',
  type: 'gcd',
  level: 1,
  cast100ms: 25,
  recast100ms: 25,
  ...actionExtras,
})
const ogcd = (id: number): GameAction => ({
  id,
  name: `o${id}`,
  iconPath: '',
  type: 'ogcd',
  level: 1,
  cast100ms: 0,
  recast100ms: 600,
  ...actionExtras,
})

function actionResult(
  rowId: number,
  name: string,
  categoryId: number,
  level: number,
): SearchResult<RawActionFields> {
  return {
    row_id: rowId,
    score: 1,
    sheet: 'Action',
    fields: {
      Name: name,
      Icon: { id: 0, path: `p${rowId}`, path_hr1: '' },
      ActionCategory: { value: categoryId, row_id: categoryId },
      ClassJobCategory: { value: 0, row_id: 0 },
      ClassJobLevel: level,
      Cast100ms: 0,
      Recast100ms: 25,
      Range: 0,
      EffectRange: 0,
      PrimaryCostType: 0,
      PrimaryCostValue: 0,
      IsPvP: false,
    },
  }
}

describe('classifyAction', () => {
  it('maps spell/weaponskill to gcd, ability to ogcd, rest to null', () => {
    expect(classifyAction(2)).toBe('gcd')
    expect(classifyAction(3)).toBe('gcd')
    expect(classifyAction(4)).toBe('ogcd')
    expect(classifyAction(8)).toBeNull()
  })
})

describe('mapActions', () => {
  it('drops non-combat categories, de-duplicates and sorts by level then name', () => {
    const results = [
      actionResult(1, 'B', 3, 20),
      actionResult(2, 'A', 4, 20),
      actionResult(3, 'Sprint', 8, 0),
      actionResult(1, 'B', 3, 20),
    ]
    const actions = mapActions(results)
    expect(actions.map((action) => action.id)).toEqual([2, 1])
    expect(actions.find((action) => action.id === 3)).toBeUndefined()
    expect(actions[0].type).toBe('ogcd')
  })
})

describe('mapJobs', () => {
  it('keeps only roster jobs with role and title-cased name', () => {
    const rows: RawSheetRow<RawClassJobFields>[] = [
      {
        row_id: 19,
        fields: { Name: 'paladin', 'Abbreviation@lang(en)': 'PLD', Role: 1, BattleClassIndex: 0 },
      },
      {
        row_id: 99,
        fields: {
          Name: 'carpenter',
          'Abbreviation@lang(en)': 'CRP',
          Role: 0,
          BattleClassIndex: -1,
        },
      },
    ]
    const jobs = mapJobs(rows)
    expect(jobs).toHaveLength(1)
    expect(jobs[0]).toMatchObject({ id: 19, name: 'Paladin', abbreviation: 'PLD', role: 'tank' })
  })
})

describe('rotation store weaving rules', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('adds GCD steps and rejects an oGCD as a step', () => {
    const store = useRotationStore()
    expect(store.addGcd(gcd(1))).toBe(true)
    expect(store.addGcd(ogcd(2))).toBe(false)
    expect(store.steps).toHaveLength(1)
  })

  it('allows at most two weaves per GCD', () => {
    const store = useRotationStore()
    store.addGcd(gcd(1))
    const stepId = store.steps[0].id
    expect(store.addWeave(stepId, ogcd(2))).toBe(true)
    expect(store.addWeave(stepId, ogcd(3))).toBe(true)
    expect(store.addWeave(stepId, ogcd(4))).toBe(false)
    expect(store.steps[0].weaves).toHaveLength(2)
  })

  it('rejects a GCD as weave and accepts oGCD pre-pull only', () => {
    const store = useRotationStore()
    store.addGcd(gcd(1))
    expect(store.addWeave(store.steps[0].id, gcd(5))).toBe(false)
    expect(store.addPrePull(ogcd(9))).toBe(true)
    expect(store.addPrePull(gcd(1))).toBe(false)
    expect(store.prePull).toHaveLength(1)
  })

  it('reorders steps with moveStep', () => {
    const store = useRotationStore()
    store.addGcd(gcd(1))
    store.addGcd(gcd(2))
    const firstId = store.steps[0].id
    store.moveStep(firstId, 1)
    expect(store.steps[1].id).toBe(firstId)
  })
})
