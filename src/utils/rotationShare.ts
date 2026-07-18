/**
 * Self-contained rotation sharing: the whole rotation is encoded into a compact,
 * URL-safe string (no backend, no database). A rotation is serialized as a tiny
 * positional array of raw action ids, then compressed with lz-string.
 *
 * Format (JSON array, then lz-string): `[version, jobId, name, prePull[], steps[]]`
 * where `steps[i] = [gcdActionId, ...weaveActionIds]`. An empty weave slot (a
 * gap) or an empty GCD (an oGCD-overflow column) is encoded as `0`; trailing
 * empty weave slots are omitted. The leading version lets future data-model
 * changes reject or migrate old links.
 */
import LZString from 'lz-string'
import { DATA_PATCH_VERSION } from '@/config/patch'
import { genId } from '@/domain/id'
import { MAX_WEAVES_PER_GCD, type Rotation } from '@/domain/types'

const SHARE_VERSION = 1

type SharePayload = [
  version: number,
  jobId: number,
  name: string,
  prePull: number[],
  steps: number[][],
]

/** Encode a rotation into a compact, URL-safe string. */
export function encodeRotation(rotation: Rotation): string {
  const payload: SharePayload = [
    SHARE_VERSION,
    rotation.jobId,
    rotation.name,
    rotation.prePull.map((entry) => entry.actionId),
    rotation.steps.map((step) => {
      const weaves = step.weaves.map((weave) => weave?.actionId ?? 0)
      while (weaves.length > 0 && weaves[weaves.length - 1] === 0) {
        weaves.pop()
      }
      return [step.gcd?.actionId ?? 0, ...weaves]
    }),
  ]
  return LZString.compressToEncodedURIComponent(JSON.stringify(payload))
}

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((n) => typeof n === 'number' && Number.isFinite(n))
}

/** Decode a shared string back into a full rotation, or null if invalid. */
export function decodeRotation(encoded: string): Rotation | null {
  let raw: unknown
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded)
    if (!json) {
      return null
    }
    raw = JSON.parse(json)
  } catch {
    return null
  }

  if (!Array.isArray(raw) || raw[0] !== SHARE_VERSION) {
    return null
  }
  const [, jobId, name, prePull, steps] = raw as SharePayload
  if (typeof jobId !== 'number' || typeof name !== 'string' || !isNumberArray(prePull)) {
    return null
  }
  if (!Array.isArray(steps) || !steps.every((step) => isNumberArray(step) && step.length >= 1)) {
    return null
  }

  const now = new Date().toISOString()
  return {
    id: genId(),
    name,
    jobId,
    patchVersion: DATA_PATCH_VERSION,
    prePull: prePull.map((actionId) => ({ instanceId: genId(), actionId })),
    steps: steps.map(([gcdId, ...weaveIds]) => ({
      id: genId(),
      gcd: gcdId ? { instanceId: genId(), actionId: gcdId } : null,
      weaves: Array.from({ length: MAX_WEAVES_PER_GCD }, (_unused, slot) => {
        const actionId = weaveIds[slot] ?? 0
        return actionId ? { instanceId: genId(), actionId } : null
      }),
    })),
    createdAt: now,
    updatedAt: now,
  }
}

const HASH_KEY = 'r'

/**
 * Pull the encoded payload out of a share string, accepting a full URL, a
 * `#r=…`/`r=…` fragment, or the raw payload itself. The value is taken verbatim
 * (no URL-decoding) so lz-string's `+`/`-`/`$` alphabet survives intact.
 */
export function extractEncoded(input: string): string {
  const trimmed = input.trim()
  const match = trimmed.match(/[#&?]r=([^&]+)/)
  return match ? match[1] : trimmed
}

/** Read and decode a shared rotation from the current URL hash, if present. */
export function readSharedRotationFromHash(): Rotation | null {
  if (typeof window === 'undefined') {
    return null
  }
  const encoded = new URLSearchParams(window.location.hash.slice(1)).get(HASH_KEY)
  return encoded ? decodeRotation(encoded) : null
}
