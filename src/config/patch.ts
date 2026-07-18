/**
 * Data patch marker. Bump this string when XIVAPI ships a new game patch to
 * invalidate every locally cached job/action set and force a fresh fetch.
 *
 * The value is compared against `localStorage["ffxivar.dataPatch"]` on first
 * data access; a mismatch clears the IndexedDB caches (see gameDataRepository).
 */
export const DATA_PATCH_VERSION = '7.2'

/** Application version, shown in the About panel. Keep in sync with package.json. */
export const APP_VERSION = '2.0.0'
