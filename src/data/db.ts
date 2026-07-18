import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { GameAction, Job } from '@/domain/types'

interface JobsRecord {
  key: string
  patchVersion: string
  jobs: Job[]
}

interface ActionsRecord {
  key: string
  patchVersion: string
  actions: GameAction[]
}

interface FfxivDB extends DBSchema {
  jobs: { key: string; value: JobsRecord }
  actions: { key: string; value: ActionsRecord }
}

const DB_NAME = 'ffxivar'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<FfxivDB>> | null = null

function getDb(): Promise<IDBPDatabase<FfxivDB>> {
  if (!dbPromise) {
    dbPromise = openDB<FfxivDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore('jobs', { keyPath: 'key' })
        db.createObjectStore('actions', { keyPath: 'key' })
      },
    })
  }
  return dbPromise
}

export async function readCachedJobs(key: string): Promise<Job[] | null> {
  const record = await (await getDb()).get('jobs', key)
  return record ? record.jobs : null
}

export async function writeCachedJobs(
  key: string,
  patchVersion: string,
  jobs: Job[],
): Promise<void> {
  await (await getDb()).put('jobs', { key, patchVersion, jobs })
}

export async function readCachedActions(key: string): Promise<GameAction[] | null> {
  const record = await (await getDb()).get('actions', key)
  return record ? record.actions : null
}

export async function writeCachedActions(
  key: string,
  patchVersion: string,
  actions: GameAction[],
): Promise<void> {
  await (await getDb()).put('actions', { key, patchVersion, actions })
}

/** Drop every cached sheet — used when the patch marker changes. */
export async function clearAllCaches(): Promise<void> {
  const db = await getDb()
  await Promise.all([db.clear('jobs'), db.clear('actions')])
}
