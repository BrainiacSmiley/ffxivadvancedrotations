import { defineStore } from 'pinia'
import { DATA_PATCH_VERSION } from '@/config/patch'
import { genId } from '@/domain/id'
import {
  MAX_WEAVES_PER_GCD,
  type GameAction,
  type PlacedAction,
  type Rotation,
  type RotationStep,
} from '@/domain/types'

function place(action: GameAction): PlacedAction {
  return { instanceId: genId(), actionId: action.id }
}

/** Fresh, all-empty weave slots for a new step. */
function emptyWeaves(): (PlacedAction | null)[] {
  return Array.from({ length: MAX_WEAVES_PER_GCD }, () => null)
}

/** Clone weaves into a fixed-size slot array (pads/truncates to the slot count). */
function normalizeWeaves(weaves: (PlacedAction | null)[]): (PlacedAction | null)[] {
  const slots = emptyWeaves()
  weaves.slice(0, MAX_WEAVES_PER_GCD).forEach((weave, index) => {
    slots[index] = weave ? { ...weave } : null
  })
  return slots
}

interface RotationState {
  id: string
  name: string
  jobId: number | null
  createdAt: string | null
  prePull: PlacedAction[]
  steps: RotationStep[]
}

export const useRotationStore = defineStore('rotation', {
  state: (): RotationState => ({
    id: genId(),
    name: '',
    jobId: null,
    createdAt: null,
    prePull: [],
    steps: [],
  }),
  getters: {
    isEmpty(state): boolean {
      return state.prePull.length === 0 && state.steps.length === 0
    },
  },
  actions: {
    /** Start a fresh, unsaved rotation bound to the given job. */
    resetFor(jobId: number | null) {
      this.id = genId()
      this.name = ''
      this.jobId = jobId
      this.createdAt = null
      this.prePull = []
      this.steps = []
    },
    /**
     * Add a GCD. If oGCD overflow has left GCD-less columns, the first of those
     * gets this GCD (adopting its weaves); otherwise a new column is appended.
     */
    addGcd(action: GameAction): boolean {
      if (action.type !== 'gcd') {
        return false
      }
      const empty = this.steps.find((step) => step.gcd === null)
      if (empty) {
        empty.gcd = place(action)
      } else {
        this.steps.push({ id: genId(), gcd: place(action), weaves: emptyWeaves() })
      }
      return true
    },
    /** Fill the first empty weave slot of a step; false if it is full or not an oGCD. */
    addWeave(stepId: string, action: GameAction): boolean {
      if (action.type !== 'ogcd') {
        return false
      }
      const step = this.steps.find((entry) => entry.id === stepId)
      if (!step) {
        return false
      }
      const slot = step.weaves.findIndex((weave) => weave === null)
      if (slot < 0) {
        return false
      }
      step.weaves[slot] = place(action)
      return true
    },
    /** Place an oGCD in one specific weave slot (used when dropping onto that slot). */
    placeInSlot(stepId: string, slot: number, action: GameAction): boolean {
      if (action.type !== 'ogcd') {
        return false
      }
      const step = this.steps.find((entry) => entry.id === stepId)
      if (!step || slot < 0 || slot >= step.weaves.length) {
        return false
      }
      step.weaves[slot] = place(action)
      return true
    },
    /**
     * Place an oGCD in the first empty weave slot anywhere (front to back), so a
     * newly dropped oGCD fills the earliest gap. Falls back to pre-pull when no
     * GCD exists yet; returns false once every slot is taken.
     */
    fillWeave(action: GameAction): boolean {
      if (action.type !== 'ogcd') {
        return false
      }
      for (const step of this.steps) {
        const slot = step.weaves.findIndex((weave) => weave === null)
        if (slot >= 0) {
          step.weaves[slot] = place(action)
          return true
        }
      }
      if (this.steps.length === 0) {
        this.prePull.push(place(action))
        return true
      }
      // Every weave slot is taken: open a new column with an empty GCD so the
      // over-weaved oGCD is visibly clipping (no GCD to weave under).
      const weaves = emptyWeaves()
      weaves[0] = place(action)
      this.steps.push({ id: genId(), gcd: null, weaves })
      return true
    },
    /** Fill an empty-GCD overflow column's GCD slot, adopting its oGCDs. */
    setStepGcd(stepId: string, action: GameAction): boolean {
      if (action.type !== 'gcd') {
        return false
      }
      const step = this.steps.find((entry) => entry.id === stepId)
      if (!step) {
        return false
      }
      step.gcd = place(action)
      return true
    },
    addPrePull(action: GameAction): boolean {
      if (action.type !== 'ogcd') {
        return false
      }
      this.prePull.push(place(action))
      return true
    },
    /** Read the occupant of a weave slot (null when empty or out of range). */
    weaveAt(stepId: string, slot: number): PlacedAction | null {
      return this.steps.find((entry) => entry.id === stepId)?.weaves[slot] ?? null
    },
    /** Set a weave slot to a placed oGCD or null (empty), keeping the slot order. */
    setWeave(stepId: string, slot: number, value: PlacedAction | null) {
      const step = this.steps.find((entry) => entry.id === stepId)
      if (!step || slot < 0 || slot >= step.weaves.length) {
        return
      }
      step.weaves[slot] = value
      // Drop an empty GCD-less overflow column once its last oGCD is gone.
      if (step.gcd === null && step.weaves.every((weave) => weave === null)) {
        this.steps = this.steps.filter((entry) => entry.id !== stepId)
      }
    },
    /** Append an already-placed oGCD to pre-pull (used when moving one out of a slot). */
    addPrePullPlaced(placed: PlacedAction) {
      this.prePull.push(placed)
    },
    removeStep(stepId: string) {
      this.steps = this.steps.filter((step) => step.id !== stepId)
    },
    removePrePull(instanceId: string) {
      this.prePull = this.prePull.filter((entry) => entry.instanceId !== instanceId)
    },
    moveStep(stepId: string, direction: -1 | 1) {
      const index = this.steps.findIndex((step) => step.id === stepId)
      const target = index + direction
      if (index < 0 || target < 0 || target >= this.steps.length) {
        return
      }
      const [step] = this.steps.splice(index, 1)
      this.steps.splice(target, 0, step)
    },
    /**
     * Move a step to the slot currently held by `targetStepId` (drop it there);
     * an unknown target (e.g. the empty area) sends it to the end. The target
     * index is read before removing the dragged step, so it lands exactly where
     * it was dropped instead of one slot short when moved further back.
     */
    moveStepTo(stepId: string, targetStepId: string) {
      if (stepId === targetStepId) {
        return
      }
      const from = this.steps.findIndex((step) => step.id === stepId)
      if (from < 0) {
        return
      }
      const targetIndex = this.steps.findIndex((step) => step.id === targetStepId)
      const [moved] = this.steps.splice(from, 1)
      this.steps.splice(targetIndex < 0 ? this.steps.length : targetIndex, 0, moved)
    },
    clear() {
      this.prePull = []
      this.steps = []
    },
    setName(name: string) {
      this.name = name
    },
    /** Snapshot the current editing state into a persistable rotation. */
    toRotation(): Rotation {
      const now = new Date().toISOString()
      return {
        id: this.id,
        name: this.name.trim(),
        jobId: this.jobId ?? -1,
        patchVersion: DATA_PATCH_VERSION,
        prePull: this.prePull.map((entry) => ({ ...entry })),
        steps: this.steps.map((step) => ({
          id: step.id,
          gcd: step.gcd ? { ...step.gcd } : null,
          weaves: step.weaves.map((weave) => (weave ? { ...weave } : null)),
        })),
        createdAt: this.createdAt ?? now,
        updatedAt: now,
      }
    },
    /** Load a saved rotation into the editor. */
    loadRotation(rotation: Rotation) {
      this.id = rotation.id
      this.name = rotation.name
      this.jobId = rotation.jobId
      this.createdAt = rotation.createdAt
      this.prePull = rotation.prePull.map((entry) => ({ ...entry }))
      this.steps = rotation.steps.map((step) => ({
        id: step.id,
        gcd: step.gcd ? { ...step.gcd } : null,
        weaves: normalizeWeaves(step.weaves),
      }))
    },
  },
})
