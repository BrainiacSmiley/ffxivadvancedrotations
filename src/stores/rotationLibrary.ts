import { defineStore } from 'pinia'
import { PREDEFINED_ROTATION_URLS } from '@/config/predefinedRotations'
import { decodeRotation, encodeRotation, extractEncoded } from '@/utils/rotationShare'
import type { Rotation } from '@/domain/types'

const STORAGE_KEY = 'ffxivar.rotations'

/**
 * Persisted form of a saved rotation: just the display name plus the compact
 * lz-string share payload. The payload already encodes the job, pre-pull and
 * steps, so the full rotation is reconstructed on demand via `decodeRotation`
 * (the same logic that loads a rotation shared through the URL hash).
 */
interface StoredRotation {
  name: string
  encoded: string
}

/** Saved rotations bucketed by job id, so only one job's list is ever touched. */
type StoredLibrary = Record<number, StoredRotation[]>

/** A stored rotation together with its decoded content, for display and load. */
export interface SavedRotation {
  encoded: string
  name: string
  rotation: Rotation
  /** Curated rotation from config: always listed first and not deletable. */
  predefined: boolean
}

function isStored(value: unknown): value is StoredRotation {
  const v = value as StoredRotation
  return !!v && typeof v.name === 'string' && typeof v.encoded === 'string'
}

/** Group loose entries into per-job buckets, reading each entry's job from its payload. */
function groupByJob(entries: StoredRotation[]): StoredLibrary {
  const map: StoredLibrary = {}
  for (const entry of entries) {
    const jobId = decodeRotation(entry.encoded)?.jobId
    if (jobId != null) {
      const bucket = (map[jobId] ??= [])
      bucket.push(entry)
    }
  }
  return map
}

function loadStored(): StoredLibrary {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    // Migrate the previous flat-array format into per-job buckets.
    if (Array.isArray(parsed)) {
      return groupByJob(parsed.filter(isStored))
    }
    if (!parsed || typeof parsed !== 'object') {
      return {}
    }
    const map: StoredLibrary = {}
    for (const [job, list] of Object.entries(parsed)) {
      const jobId = Number(job)
      if (Number.isFinite(jobId) && Array.isArray(list)) {
        map[jobId] = list.filter(isStored)
      }
    }
    return map
  } catch {
    return {}
  }
}

/** Curated rotations from config, decoded once and bucketed by their payload's job. */
const PREDEFINED_BY_JOB: Record<number, SavedRotation[]> = (() => {
  const map: Record<number, SavedRotation[]> = {}
  for (const urls of Object.values(PREDEFINED_ROTATION_URLS)) {
    for (const url of urls) {
      const encoded = extractEncoded(url)
      const rotation = decodeRotation(encoded)
      if (rotation) {
        const bucket = (map[rotation.jobId] ??= [])
        bucket.push({ encoded, name: rotation.name, rotation, predefined: true })
      }
    }
  }
  return map
})()

export const useRotationLibraryStore = defineStore('rotationLibrary', {
  state: () => ({
    rotations: loadStored() as StoredLibrary,
  }),
  getters: {
    /**
     * Rotations for a job: curated (predefined) ones first, then the user's own
     * saved rotations newest-first. Only that job's bucket is read.
     */
    forJob(state) {
      return (jobId: number): SavedRotation[] => {
        const predefined = PREDEFINED_BY_JOB[jobId] ?? []
        const user = (state.rotations[jobId] ?? [])
          .map((entry) => ({
            ...entry,
            rotation: decodeRotation(entry.encoded),
            predefined: false,
          }))
          .filter((entry): entry is SavedRotation => entry.rotation !== null)
          .reverse()
        return [...predefined, ...user]
      }
    },
  },
  actions: {
    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.rotations))
    },
    /** Upsert a rotation into its job's bucket, keyed by name so re-saving overwrites. */
    save(rotation: Rotation) {
      const stored: StoredRotation = { name: rotation.name, encoded: encodeRotation(rotation) }
      const bucket = (this.rotations[rotation.jobId] ??= [])
      const index = bucket.findIndex((entry) => entry.name === rotation.name)
      if (index >= 0) {
        bucket[index] = stored
      } else {
        bucket.push(stored)
      }
      this.persist()
    },
    remove(jobId: number, encoded: string) {
      const bucket = this.rotations[jobId]
      if (!bucket) {
        return
      }
      this.rotations[jobId] = bucket.filter((entry) => entry.encoded !== encoded)
      this.persist()
    },
  },
})
