/**
 * Curated rotations shipped with the app, grouped by job for readability.
 *
 * Keys are job abbreviations (PLD, WAR, WHM, …); add an entry for any job.
 * Each value is a list of share strings, where a share string may be:
 *   - a full rotation URL          (e.g. https://…/en/pld#r=NoRg…)
 *   - just the hash fragment        (e.g. #r=NoRg… or r=NoRg…)
 *   - the raw encoded payload       (e.g. NoRg…)
 *
 * The job a rotation belongs to is read from its encoded payload, so the
 * abbreviation key is only for organizing this file. Predefined rotations always
 * appear before the user's own saved rotations for that job and cannot be
 * deleted from the UI — edit this file to change them.
 */
export const PREDEFINED_ROTATION_URLS: Record<string, string[]> = {
  // Example (Paladin) — replace or remove:
  PLD: ['NoRgNCCcYEQCoFMDOAXGZgF0PGgZgDZIAmcAdjwA4BWbUAgFgIAYxiywLK86vxi8nKj0yYgA'],
  // WAR: [],
  // WHM: [],
}
